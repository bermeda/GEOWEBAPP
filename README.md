<p align="center"> 
  <strong>Medhin Berhe Hagos</strong><br />
  <em>GIS Systems - University of Camerino</em>
</p>

<h1 align="center">Geo Web Map</h1>

<p align="center"><em>A full-stack GIS web application for managing, visualizing, and analyzing spatial data using ASP.NET Core Web API, Entity Framework Core, Newtonsoft.Json, NetTopologySuite, PostgreSQL/PostGIS, and Leaflet.js.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Leaflet.js-blue?logo=javascript" alt="Frontend Leaflet.js" />
  <img src="https://img.shields.io/badge/Backend-ASP.NET_Core-blue?logo=dotnet" alt="Backend ASP.NET Core" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql" alt="Database PostgreSQL" />
  <img src="https://img.shields.io/badge/GIS-PostGIS-orange?logo=mapbox" alt="GIS PostGIS" />
</p>

  

### 📚 Table of Contents

- [📄 Abstract](#-abstract)
- [🌍 Introduction](#-introduction)
- [✨ Features](#-features)
- [🧪 Technologies Used](#-technologies-used)
- [🚀 Getting Started](#-getting-started)
 - [ 📌 Future Work](#-futurework)
- [✅ Conclusion](#-conclusion)
- [🙏 Acknowledgements](#-acknowledgements)

### 📄 Abstract

Geo Web Map is a full-stack Geographic Information System (GIS) web application designed to manage, visualize, and analyze spatial data efficiently. The backend is built using ASP.NET Core Web API with Entity Framework Core and NetTopologySuite for spatial data handling, connected to a PostgreSQL/PostGIS database. The frontend leverages Leaflet.js for interactive map rendering and user interaction.

This application supports CRUD operations on spatial features, spatial queries such as nearest neighbor and polygon selection, and dynamic filtering by categories. Geo Web Map aims to provide an intuitive and powerful platform for spatial data management suitable for academic, research, and practical GIS applications.


### 🌍 Introduction

GeoWebApp is a full-stack GIS web application for managing and visualizing spatial data.  
It uses OpenLayers for the frontend map interface and ASP.NET Core with PostgreSQL/PostGIS on the backend.

### Features

* Interactive map rendering with OpenLayers
* Add, edit, and delete points, lines, and polygons
* Categorize features (e.g., restaurant, school, hospital)
* Filter features by category
* Draw polygons to spatially filter features
* Find nearest features to a user-selected point
* Persist spatial data in PostgreSQL/PostGIS database

### Technology Used

* Frontend: HTML5, CSS, JavaScript, OpenLayers v7.3
* Backend: ASP.NET Core Web API, Entity Framework Core, Newtonsoft.Json, NetTopologySuite
* Database: PostgreSQL with PostGIS extension


### Running the Application

1. Ensure PostgreSQL with PostGIS is installed and running.
2. Update `appsettings.json` with your database connection string.
3. Run the backend API:
   
### 🚀 Getting Started

Follow these steps to set up and run the Geo Web Map application locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bermeda//geowebmap.git
   cd geowebmap
   Run database migrations
   dotnet ef database update
   Run the backend API:

   dotnet run --project GeoWebApp


   
   



### 📌 Future Work

To further enhance the Geo Web Map application, the following features and improvements are recommended:

- 🔧 *Geometry Editing Enhancements*
  - Enable drag-and-drop editing for point features.
  - Allow interactive editing of line and polygon vertices (add, move, delete).
  - Add a “Save Geometry” button to persist edits.

- 🔍 *Advanced Spatial Filtering*
  - Filter features by drawing spatial boundaries (polygon or buffer).
  - Combine spatial filters with attribute filters (e.g., show only schools in a specific area).

- 🖌️ *Dynamic Styling & Legend*
  - Style features based on attributes (e.g., color by population).
  - Display an auto-updating legend reflecting current map styles.

- 📍 *Spatial Queries*
  - Implement nearest neighbor queries (e.g., find 5 nearest hospitals).
  - Use PostGIS functions like `ST_DWithin`, `ST_Intersects`, `ST_Area`.

- 📁 *Layer & Data Management*
  - Let users toggle visibility of different layers (points, lines, polygons).
  - Add import/export functionality for GeoJSON spatial data.

- 🧭 *User Interface Enhancements*
  - Show cursor coordinates on the map.
  - Add a search bar to find features by name or ID.
  - Enable popups/tooltips displaying feature details on click.

- 📈 *GIS Analytics (Optional)*
  - Display basic statistics (e.g., total features, average area/length).
  - Export filtered results to CSV or GeoJSON.

These tasks will make the Geo Web Map application more robust, user-friendly, and suitable for more advanced GIS analysis.
### 🛠️ Tasks Implemented

- ✅ Create, update, delete for point, line, and polygon geometries
- ✅ Visualize spatial layers using Leaflet.js
- ✅ Filter features by attribute (e.g., category = restaurant)
- ✅ Spatial queries: select features within polygon (ST_Within)
- ✅ Spatial queries: find intersecting features (ST_Intersects)
- ✅ Edit geometry via drag-and-drop and vertex manipulation
- ✅ Nearest neighbor query using ST_DWithin and ST_Distance
- ✅ Dynamic styling of features by attribute (color by population)
- ✅ Display of map legends and layer toggles


### ✅ Conclusion

The **Geo Web Map** project successfully delivers a full-stack GIS web application that enables users to manage, visualize, and analyze spatial data effectively. Leveraging technologies like ASP.NET Core Web API, Entity Framework Core, NetTopologySuite, PostgreSQL/PostGIS, and Leaflet.js, the system provides robust GIS functionalities including CRUD operations, spatial queries, and interactive mapping features.

This project demonstrates the power of integrating spatial databases with modern web frameworks to build scalable and user-friendly GIS applications. Future enhancements could include real-time collaboration, advanced spatial analytics, and mobile responsiveness to further improve usability and functionality.
### 🙏 Acknowledgements

I would like to express my sincere gratitude to the University of Camerino for providing the opportunity to work on this GIS Systems project. Special thanks to my professors and mentors for their guidance and support throughout the development of the Geo Web Map application.

I also acknowledge the open-source communities behind ASP.NET Core, Entity Framework Core, NetTopologySuite, PostgreSQL/PostGIS, and Leaflet.js, whose tools and libraries made this project possible.

Finally, thank you to my peers and friends for their valuable feedback and encouragement.


