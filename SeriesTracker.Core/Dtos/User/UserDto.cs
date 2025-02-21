namespace SeriesTracker.Core.Dtos.UserDtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
        public string RegDate { get; set; }
    }
}
