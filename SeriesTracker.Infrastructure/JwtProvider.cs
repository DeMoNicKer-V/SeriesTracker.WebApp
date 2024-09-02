using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Infrastructure
{
    public class JwtProvider(IOptions<JwtOptions> jwtOptions) : IJwtProvider
    {
        private readonly JwtOptions _jwtOptions = jwtOptions.Value;

        public string GenerateToken(User user)
        {
            Claim[] claims = [new("userId", user.Id.ToString())];
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)), 
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                signingCredentials: signingCredentials, 
                expires: DateTime.UtcNow.AddHours(_jwtOptions.ExpiresHours));

            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);  
            
            return tokenValue;
        }
    }
}
