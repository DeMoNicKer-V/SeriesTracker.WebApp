namespace SeriesTracker.API.Contracts
{
    public record UserResponse
    (
          string Email,
          string Password,
          string UserName,
          string Avatar,
          string Name,
          string SurName,
          string DateBirth
        );


}
