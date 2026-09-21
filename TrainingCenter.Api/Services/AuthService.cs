using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TrainingCenter.Api.Data;
using TrainingCenter.Api.DTOs.Auth;
using TrainingCenter.Api.Models;

namespace TrainingCenter.Api.Services
{
    public class AuthService
    {
        private readonly TrainingCenterDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(TrainingCenterDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<(bool Success, string Message, AuthResponseDto? Data)> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return (false, "Email is already registered.", null);
            }

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return (true, "Registration successful.", new AuthResponseDto { Token = token, Email = user.Email });
        }

        public async Task<(bool Success, string Message, AuthResponseDto? Data)> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return (false, "Invalid credentials.", null);
            }

            var token = GenerateJwtToken(user);
            return (true, "Login successful.", new AuthResponseDto { Token = token, Email = user.Email });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(double.Parse(jwtSettings["DurationInDays"] ?? "7")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}