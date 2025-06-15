using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GeoWebApp.Data;
using GeoWebApp.Models;
using NetTopologySuite.Geometries;
using GeoWebApp.Dto;

namespace GeoWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeaturesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeaturesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/features
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var features = await _context.Features.ToListAsync();
            return Ok(features);
        }

        // GET: api/features/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var feature = await _context.Features.FindAsync(id);
            if (feature == null)
                return NotFound();

            return Ok(feature);
        }

        // POST: api/features
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Feature feature)
        {
            _context.Features.Add(feature);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = feature.Id }, feature);
        }

        // PUT: api/features/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Feature feature)
        {
            if (id != feature.Id)
                return BadRequest();

            _context.Entry(feature).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Features.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/features/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var feature = await _context.Features.FindAsync(id);
            if (feature == null)
                return NotFound();

            _context.Features.Remove(feature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/features/filter?category=restaurant
        [HttpGet("filter")]
        public async Task<IActionResult> GetByCategory([FromQuery] string category)
        {
            if (string.IsNullOrWhiteSpace(category))
                return BadRequest("Category is required.");

            var features = await _context.Features
                .Where(f => f.Category.ToLower() == category.ToLower())
                .ToListAsync();

            return Ok(features);
        }

        // GET: api/features/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Features
                .Select(f => f.Category)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }

        [HttpPost("nearest")]
        public async Task<IActionResult> GetNearest([FromBody] NearestQueryRequest request)
        {
            if (request.Geometry == null)
                return BadRequest("Missing geometry.");

            var query = _context.Features
                .Where(f => f.Geom != null);

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                query = query.Where(f => f.Category == request.Category);
            }

            var nearest = await query
                .OrderBy(f => f.Geom.Distance(request.Geometry))
                .Take(request.Count)
                .ToListAsync();

            return Ok(nearest);
        }

        /* [HttpPost("spatialfilter")]
        public async Task<IActionResult> SpatialFilter([FromBody] GeometryFilterRequest request)
        {
            if (request?.Geometry == null)
                return BadRequest("Missing geometry");

            // ✅ Ensure SRID matches the one stored in DB (usually 4326)
            request.Geometry.SRID = 4326;

            var filtered = await _context.Features
                .Where(f => f.Geom != null && EF.Functions.Contains(request.Geometry, f.Geom))
                .ToListAsync();

            return Ok(filtered);
        } */
    }
}
