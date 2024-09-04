using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    public class SeriesConfiguration : IEntityTypeConfiguration<SeriesEntity>
    {
        public void Configure(EntityTypeBuilder<SeriesEntity> builder)
        {
           builder.HasKey(x => x.Id);
            builder.Property(s => s.AnimeId).IsRequired();
            builder.Property(s => s.AddedDate).IsRequired();
            builder.Property(s => s.AnimeId).IsRequired();
            builder.Property(s => s.WatchedEpisode).IsRequired();

            builder.HasOne(s => s.Category).
                WithMany(c => c.Series).HasForeignKey(c => c.CategoryId);
        }
    }
}
