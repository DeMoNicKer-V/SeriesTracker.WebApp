using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.API.Extensions;
using SeriesTracker.Application;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Mappers;
using SeriesTracker.DataAccess;
using SeriesTracker.DataAccess.Repositories;
using SeriesTracker.Infrastructure.Authentication;
using SeriesTracker.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConsole();
builder.Services.AddApiAuthentication(builder.Configuration);
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));
builder.Services.Configure<AuthorizationOptions>(builder.Configuration.GetSection(nameof(AuthorizationOptions)));
builder.Services.AddInfrastructure();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IUserSeriesRepository, UserSeriesRepository>();
builder.Services.AddScoped<IUserSeriesService, UserSeriesService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

builder.Services.AddScoped<ISeriesService, SeriesService>();
builder.Services.AddScoped<ISeriesRepository, SeriesRepository>();

builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<ICategorySeriesRepository, CategorySeriesRepository>();
builder.Services.AddScoped<ICategorySeriesService, CategorySeriesService>();


builder.Services.AddAutoMapper(typeof(AnimeMappingProfile));
builder.Services.AddScoped<IShikimoriService, ShikimoriService>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ICalendarFetcher, CalendarFetcher>();

builder.Services.AddDbContextFactory<SeriesTrackerDbContext>(options =>
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
