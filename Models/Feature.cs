using NetTopologySuite.Geometries;

namespace GeoWebApp.Models
{
    public class Feature
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Category { get; set; } = String.Empty;
        public Geometry Geom { get; set; } = default!;
    }
}
