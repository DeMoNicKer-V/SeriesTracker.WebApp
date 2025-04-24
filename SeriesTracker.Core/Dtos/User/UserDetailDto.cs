namespace SeriesTracker.Core.Dtos
{
    public class UserDetailDto
    {
        public string? Avatar { get; set; }
        public string? DateBirth { get; set; }
        public string Email { get; set; }
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string RegDate { get; set; }
        public int RoleId { get; set; }
        public string? SurName { get; set; }
        public string UserName { get; set; }
    }
}