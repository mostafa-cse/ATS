using System;
using System.Threading.Tasks;
using AestheticTechStore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AestheticTechStore.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedDataAsync(IServiceProvider serviceProvider)
        {
            var logger = serviceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");

            try
            {
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

                // 1. Seed Roles
                string[] roleNames = { "Admin", "User", "Rider" };
                foreach (var roleName in roleNames)
                {
                    var roleExist = await roleManager.RoleExistsAsync(roleName);
                    if (!roleExist)
                    {
                        await roleManager.CreateAsync(new IdentityRole(roleName));
                        logger.LogInformation($"Role '{roleName}' created.");
                    }
                }

                // 2. Seed Default Admin User
                var adminEmail = "admin@aesthetictech.com";
                var adminUser = await userManager.FindByEmailAsync(adminEmail);

                if (adminUser == null)
                {
                    var newAdmin = new AppUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        FirstName = "System",
                        LastName = "Administrator",
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(newAdmin, "Admin@123");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newAdmin, "Admin");
                        logger.LogInformation("Default Admin user created successfully.");
                    }
                    else
                    {
                        logger.LogError("Failed to create default Admin user.");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
            }
        }
    }
}
