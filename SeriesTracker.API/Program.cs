using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.API.Extensions;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core.Mappers;
using SeriesTracker.DataAccess;
using SeriesTracker.DataAccess.Extensions;
using SeriesTracker.Infrastructure.Authentication;
using SeriesTracker.Infrastructure.Extensions;

// ������� WebApplicationBuilder, ��������� ���������� ��������� ��������� ������.
// WebApplicationBuilder ������������� ������ ��� ��������� ���-����������.
var builder = WebApplication.CreateBuilder(args);
var services = builder.Services; // �������� ��������� ��������, ��� ���������� ������������.

// ---- ��������� ����������� ----
// ��������� ���������� ������, ����� �������� ���� � �������.
builder.Logging.AddConsole();

// ---- ��������� ������������ ----
// (����� ����� ���� �������������� ��������� ������������, ��������, ���������� ����������� ������������)

// ---- ��������� ������������ (Dependency Injection) ----

// ��������� ���������������� �������
services.AddInfrastructure();

// ��������� ������� ������ ����������
services.AddApplication();

// ��������� ������� ��� ������� � ������ (�����������).
services.AddDataAccess();

// ��������� ������� DbContext ��� ������ � ����� ������ PostgreSQL.
// ���������� ������������ ����������� �� appsettings.json.
services.AddDbContextFactory<SeriesTrackerDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(SeriesTrackerDbContext)));
    /* options.UseNpgsql().LogTo(Console.WriteLine, LogLevel.Information)
                   .EnableSensitiveDataLogging(); // ������ ��� ����������!*/
});

// ��������� AutoMapper ��� �������� ��������.
// ��������� ���� �������� ��������, ������� ����� ��������������.
services.AddAutoMapper(typeof(AnimeMappingProfile));
services.AddAutoMapper(typeof(UserMappingProfile));

// ---- ��������� �������������� � ����������� ----
// ��������� ������� ��������������, ��������� ������������.
services.AddApiAuthentication(builder.Configuration);

// ����������� ��������� JWT �� ������������ ����������.
services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));

// ����������� ��������� ����������� �� ������������ ����������.
services.Configure<AuthorizationOptions>(builder.Configuration.GetSection(nameof(AuthorizationOptions)));

// ---- ��������� API ----
// ��������� ��������� ������������ MVC.
services.AddControllers();

// ��������� ��������� API Explorer ��� ��������������� �������� ������������ API.
services.AddEndpointsApiExplorer();

// ��������� ��������� Swagger ��� ��������� ������������ API.
services.AddSwaggerGen();

// ---- �������� � ��������� WebApplication ----
// �������� ������������ ���-����������.
var app = builder.Build();

// ---- ��������� ��������� ��������� �������� (middleware) ----

// ���� ���������� �������� � ����� ����������...
if (app.Environment.IsDevelopment())
{
    // ...���������� Swagger UI ��� ���������������� API.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// �������������� HTTP-������� �� HTTPS.
app.UseHttpsRedirection();

// ����������� �������� cookie.
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict, //  ������������ SameSite=Strict
    HttpOnly = HttpOnlyPolicy.Always, //  ������ �� XSS ����
    Secure = CookieSecurePolicy.Always //  ������������� HTTPS
});

// �������� CORS (Cross-Origin Resource Sharing) ��� �������� � http://localhost:3000.
app.UseCors(x =>
{
    x.WithOrigins("http://localhost:3000") // ��������� ������� � ���������� origin.
                   .AllowAnyMethod() // ��������� ��� ������ (GET, POST, PUT, DELETE � �.�.).
                   .AllowAnyHeader() // ��������� ��� ���������.
                   .AllowCredentials(); // ��������� �������� ������� ������ (����, ��������������� ���������).
});

// �������� ��������������.
app.UseAuthentication();

// �������� �����������.
app.UseAuthorization();

// ������������ ����������� � ��������� �������.
app.MapControllers();

// ---- ������ ���������� ----
// ��������� ���-����������.
app.Run();

public partial class Program { }