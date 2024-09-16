using SeriesTracker.Core.Enums;

namespace SeriesTracker.API.Contracts
{
        public record DefaultUserResponse
(
      string Email,
      string Password,
      string UserName,
      string Avatar,
      string Name,
      string SurName,
      string DateBirth,
      string RegDate,
      int YearsOld
    );
    
}
