using SeriesTracker.Core.Enums;

namespace SeriesTracker.API.Contracts
{
        public record DefaultUserResponse
(
      string Email,
      string UserName,
      string Avatar,
      string Name,
      string SurName,
      string RegDate,
      string DateBirth,
      int RoleId
    );
    
}
