using GeoWebApp.Models;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace GeoWebApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {}

        public DbSet<Feature> Features { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Feature>().Property(f => f.Geom).HasColumnType("geometry");
        }
    }
}


