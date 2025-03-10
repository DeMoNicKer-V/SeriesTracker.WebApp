using SeriesTracker.Core.Dtos.Series;

namespace SeriesTracker.Core.Dtos.User
{
    public class UserActivityDTO
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
        public List<SeriesGroupDto> SeriesGroup { get; set; }
        public string SeriesIDS { get; set; }
    }
}
