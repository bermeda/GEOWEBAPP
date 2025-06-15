// =================== Map Initialization ===================
const rasterLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const vectorSource = new ol.source.Vector();

const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: function (feature) {
        const category = feature.get('category') || 'default';
        const colors = {
            restaurant: 'rgba(233, 24, 24, 0.6)',
            school: 'rgba(100, 255, 100, 0.6)',
            hospital: 'rgba(100, 100, 255, 0.6)',
            default: 'rgba(149, 140, 140, 0.6)',
        };
        return new ol.style.Style({
            fill: new ol.style.Fill({ color: colors[category] || colors.default }),
            stroke: new ol.style.Stroke({ color: '#333', width: 2 }),
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: colors[category] || colors.default }),
                stroke: new ol.style.Stroke({ color: '#000', width: 1 }),
            }),
        });
    },
});

const map = new ol.Map({
    target: 'map',
    layers: [rasterLayer, vectorLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([13.07, 43.13]),
        zoom: 12,
        projection: 'EPSG:3857',
    }),
});

// =================== Load & Render Features ===================
function loadAllFeatures() {
    fetch('http://localhost:5253/api/features')
        .then((res) => res.json())
        .then(renderFeatures);
}

function renderFeatures(features) {
    console.log("Rendering features:", features);
    vectorSource.clear();

    if (!Array.isArray(features)) {
        console.error("Features is not an array:", features);
        return;
    }

    const geojson = {
        type: "FeatureCollection",
        features: features
            .filter(f => f && f.geom && f.geom.type && f.geom.coordinates)
            .map(f => ({
                type: "Feature",
                geometry: f.geom,
                properties: {
                    id: f.id,
                    name: f.name,
                    category: f.category
                }
            }))
    };

    const format = new ol.format.GeoJSON();
    const olFeatures = format.readFeatures(geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });

    vectorSource.addFeatures(olFeatures);
    if (olFeatures.length > 0) {
        map.getView().fit(vectorSource.getExtent(), {
            padding: [20, 20, 20, 20],
            maxZoom: 16
        });
    } else {
        console.log("No features with valid geometry.");
    }
}

function filterByCategory(category) {
    fetch(`http://localhost:5253/api/features/filter?category=${category}`)
        .then((res) => res.json())
        .then(renderFeatures);
}

// =================== Category Dropdown Setup ===================
const categorySelect = document.getElementById("categoryFilter");

fetch("http://localhost:5253/api/features/categories")
    .then((res) => res.json())
    .then((categories) => {
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All";
        categorySelect.appendChild(allOption);

        categories.forEach((cat) => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            categorySelect.appendChild(option);
        });
    });

categorySelect.addEventListener("change", function () {
    const selected = this.value;
    selected === "all" ? loadAllFeatures() : filterByCategory(selected);
});

// =================== Search selected area ===================

const selectDraw = new ol.interaction.Draw({
    source: new ol.source.Vector(), // dummy source, not added to map
    type: 'Polygon'
});

document.getElementById('selectAreaBtn').addEventListener('click', () => {
    map.addInteraction(selectDraw);
});

selectDraw.on('drawend', function (event) {
    map.removeInteraction(selectDraw);

    const geometry = event.feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326');
    const geojson = new ol.format.GeoJSON().writeGeometryObject(geometry);

    fetch('/api/features/spatialfilter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geometry: geojson })
    })
        .then(res => res.json())
        .then(filteredFeatures => {
            console.log("Filtered features:", filteredFeatures);
            renderFeatures(filteredFeatures);
        })
        .catch(err => console.error("Spatial filter error:", err));
});

// =================== Drawing Features ===================
let drawInteraction;

function startDraw(type) {
    if (drawInteraction) map.removeInteraction(drawInteraction);

    drawInteraction = new ol.interaction.Draw({
        source: vectorSource,
        type: type,
    });

    drawInteraction.on('drawend', function (event) {
        const feature = event.feature;
        const geojson = new ol.format.GeoJSON().writeFeatureObject(feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        const name = prompt("Enter name for the feature:");
        const category = prompt("Enter category:");

        fetch('http://localhost:5253/api/features', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                category: category,
                geom: geojson.geometry,
            }),
        })
            .then((res) => res.json())
            .then(() => loadAllFeatures());
    });

    map.addInteraction(drawInteraction);
}

// =================== Edit Feature ===================
const modify = new ol.interaction.Modify({ source: vectorSource });
map.addInteraction(modify);

// Save changes to backend when modification ends
modify.on('modifyend', async (e) => {
    const geojsonFormat = new ol.format.GeoJSON(); // Or reuse your existing formatter
    for (let feature of e.features.getArray()) {
        const geojson = geojsonFormat.writeFeatureObject(feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        await fetch(`/api/features/${feature.get('id')}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: feature.get('id'),
                name: feature.get('name'),
                category: feature.get('category'),
                geom: geojson.geometry
            })
        });
    }
});


// =================== selecting and translating (dragging) whole geometries (Polygon) ===================
const select = new ol.interaction.Select({
    layers: [vectorLayer] // restrict to editable layer
});
map.addInteraction(select);

const translate = new ol.interaction.Translate({
    features: select.getFeatures()
});
map.addInteraction(translate);

// When dragging ends, send PUT to update geometry
translate.on('translateend', async function (event) {
    const format = new ol.format.GeoJSON();

    event.features.getArray().forEach(async (feature) => {
        const id = feature.get('id');
        if (!id) return;

        const geojson = format.writeFeatureObject(feature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        await fetch(`/api/features/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                name: feature.get('name'),
                category: feature.get('category'),
                geom: geojson.geometry
            })
        });
    });
});


// =================== Find Nearest Feature ===================
let nearestMode = false;

document.getElementById('findNearest').addEventListener('click', () => {
    nearestMode = true;
    alert('Click a point on the map to search nearest features');
});

map.on('click', async function (evt) {
    if (!nearestMode) return;
    nearestMode = false;

    const category = document.getElementById('nearestCategory').value;
    const count = parseInt(document.getElementById('nearestCount').value) || 5;

    const clickedCoord = ol.proj.toLonLat(evt.coordinate);
    const geom = {
        type: 'Point',
        coordinates: clickedCoord
    };

    const response = await fetch('/api/features/nearest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geometry: geom, category, count })
    });

    const features = await response.json();
    renderFeatures(features);
});

// =================== Init ===================
loadAllFeatures();