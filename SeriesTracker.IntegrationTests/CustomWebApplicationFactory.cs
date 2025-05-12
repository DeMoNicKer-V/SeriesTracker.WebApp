using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.AddAuthentication("Test")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", options => { });

                var mockPermissionService = new Mock<IPermissionSevice>();
                var userId = Guid.Parse("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
                mockPermissionService.Setup(p => p.GetPermissionsAsync(userId)).ReturnsAsync([Permission.Delete]);

                services.AddScoped(typeof(IPermissionSevice), (sp) => mockPermissionService.Object);
            });
        }
    }
}