using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    public record UserRequest
      (
          string? Email,
          string? Password,
          string? UserName,
          string? Avatar,
          string? Name,
          string? SurName,
          string? DateBirth
      );
}