namespace SeriesTracker.Contracts
{
    public record UserRequest
         (
           string Email,
    string Password,
    string UserName,
    string? Name,
    string? Surname,
    string? Avatar,
    string DateBirth
         );
}
