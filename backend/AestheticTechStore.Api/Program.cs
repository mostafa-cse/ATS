using System.Text;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(x => 
    x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Custom Services
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.ITokenService, AestheticTechStore.Infrastructure.Services.TokenService>();
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.Repositories.IProductRepository, AestheticTechStore.Infrastructure.Repositories.ProductRepository>();
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.Repositories.IOrderRepository, AestheticTechStore.Infrastructure.Repositories.OrderRepository>();
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.Repositories.IUserRepository, AestheticTechStore.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.Services.IEMICalculatorService, AestheticTechStore.Application.Services.EMICalculatorService>();

// Register Strategies
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.IPaymentStrategy, AestheticTechStore.Application.Strategies.Payment.CODPaymentStrategy>();
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.IShippingStrategy, AestheticTechStore.Application.Strategies.Shipping.InsideDhakaShippingStrategy>();
builder.Services.AddScoped<AestheticTechStore.Application.Interfaces.IShippingStrategy, AestheticTechStore.Application.Strategies.Shipping.OutsideDhakaShippingStrategy>();

// Configure EF Core with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing.");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Configure MediatR
// We add MediatR from the Application assembly
var applicationAssembly = AppDomain.CurrentDomain.GetAssemblies().FirstOrDefault(a => a.GetName().Name == "AestheticTechStore.Application") 
    ?? System.Reflection.Assembly.Load("AestheticTechStore.Application");
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));

// Configure CORS for Next.js
builder.Services.AddCors(options =>
{
    // CORS policy for Next.js frontend
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Authorization policy for admin-only endpoints
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowNextJs");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure Database is Created & Roles are seeded (Simplification for dev)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    // Will apply migrations automatically when we start the app
    context.Database.Migrate(); 

    // Seed default roles and admin user
    try
    {
        AestheticTechStore.Infrastructure.Data.DbSeeder.SeedDataAsync(services).Wait();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
