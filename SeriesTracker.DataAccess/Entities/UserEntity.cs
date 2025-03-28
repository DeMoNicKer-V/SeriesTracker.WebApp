﻿namespace SeriesTracker.DataAccess.Entities
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

        public required string Email
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

        public required string PasswordHash
        {
            get; set;
        }

        public required string RegDate
        {
            get; set;
        }

        public ICollection<RoleEntity> Roles { get; set; } = [];
        public ICollection<UserSeriesEntity> UserSeries { get; set; } = new List<UserSeriesEntity>();

        public string? SurName
        {
            get; set;
        }

        public required string UserName
        {
            get; set;
        }
    }
}
