public class NearestQueryRequest
{
    public string? Category { get; set; }
    public int Count { get; set; } = 5;
    public NetTopologySuite.Geometries.Geometry Geometry { get; set; } = default!;
}