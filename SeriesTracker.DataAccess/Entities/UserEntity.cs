namespace SeriesTracker.DataAccess.Entities
{
    public class UserEntity
    {
        public string? Avatar
        {
            get; set;
        }

        public string? DateBirth
        {
            get; set;
        }

        public string Email
        {
            get; set;
        }

        public Guid Id
        {
            get; set;
        }

        public string? Name
        {
            get; set;
        }

        public string PasswordHash
        {
            get; set;
        }

        public string RegDate
        {
            get; set;
        }

        public ICollection<RoleEntity> Roles { get; set; } = [];
        public ICollection<UserSeriesEntity> UserSeries { get; set; } = [];

        public string? SurName
        {
            get; set;
        }

        public string UserName
        {
            get; set;
        }
    }
}