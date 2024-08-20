using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SeriesTracker.Core.Models;
using System.Xml.Linq;

namespace SeriesTracker.DataAccess.Configurations
{
    internal class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(s => s.UserRoleId).IsRequired();
            builder.Property(s => s.UserName).IsRequired();
            builder.Property(s => s.Email).IsRequired();
            builder.Property(s => s.PasswordHash).IsRequired();
            builder.Property(s => s.DateOfBirth).IsRequired();
            builder.Property(s => s.RegistrationDate).IsRequired();
        }
    }
}
