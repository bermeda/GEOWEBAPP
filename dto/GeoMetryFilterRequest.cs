using NetTopologySuite.Geometries;

namespace GeoWebApp.Dto
{
    public class GeometryFilterRequest
    {
        public Geometry Geometry { get; set; } = default!;
    }
}