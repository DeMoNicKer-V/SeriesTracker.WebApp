namespace SeriesTracker.API.Contracts
{
    public record UserRequest
      (
          string Email,
          string Password,
          string NickName,
          string Avatar,
          string Name,
          string SurName,
          string DateBirth
      );
}
