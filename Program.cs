using GeoWebApp.Data;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.IO.Converters;

var builder = WebApplication.CreateBuilder(args);

// ✅ Register services
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Converters.Add(new NetTopologySuite.IO.Converters.GeometryConverter());
    });
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseNetTopologySuite()));

var app = builder.Build();

// ✅ Middleware setup
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// ✅ Serve static files like index.html
app.UseDefaultFiles();
app.UseStaticFiles();

// ✅ Enable attribute routing for controllers
app.MapControllers();

app.Run();