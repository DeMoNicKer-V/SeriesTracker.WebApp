using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.API.Extensions;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core.Mappers;
using SeriesTracker.DataAccess;
using SeriesTracker.DataAccess.Extensions;
using SeriesTracker.Infrastructure.Authentication;
using SeriesTracker.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// ��������� �����������
builder.Logging.AddConsole();

// ��������� �������������� � �����������
services.AddApiAuthentication(builder.Configuration);
services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));
services.Configure<AuthorizationOptions>(builder.Configuration.GetSection(nameof(AuthorizationOptions)));

services.AddInfrastructure();
services.AddApplication();
services.AddDataAccess();

// ��������� API
services.AddControllers(); // ��������� ��������� ������������
services.AddEndpointsApiExplorer(); // ��������� ��������� API Explorer
services.AddSwaggerGen(); // ��������� ��������� Swagger ��� ���������������� API

services.AddAutoMapper(typeof(AnimeMappingProfile));
services.AddAutoMapper(typeof(UserMappingProfile));

services.AddDbContextFactory<SeriesTrackerDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(SeriesTrackerDbContext)));
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseCors(x =>
{
    x.WithOrigins("http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
});

app.Run();