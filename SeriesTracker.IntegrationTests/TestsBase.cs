using Microsoft.AspNetCore.Mvc.Testing;
using Moq;

using System.Net.Http.Headers;
using Microsoft.Extensions.DependencyInjection;

namespace SeriesTracker.IntegrationTests
{
    public class TestsBase<T> : IClassFixture<CustomWebApplicationFactory> where T : class
    {
        protected readonly CustomWebApplicationFactory _factory;

        public TestsBase(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }

        // Метод для создания тестового клиента (с имитацией авторизации)
        protected HttpClient CreateTestClient(Mock<T>? mockService = null, bool isAuthorized = true)
        {
            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    if (mockService != null)
                    {
                        services.AddScoped(typeof(T), (sp) => mockService.Object);
                    }
                });
            }).CreateClient();

            if (!isAuthorized)
            {
                client.DefaultRequestHeaders.Clear();
            }
            else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");

            return client;
        }
    }
}