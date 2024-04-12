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
            builder.Property(t => t.Title).IsRequired();
            builder.Property(w => w.WatchedEpisode).IsRequired();
            builder.Property(l => l.LastEpisode).IsRequired();
            builder.Property(d => d.Duration).IsRequired();
            builder.Property(s => s.ReleaseDate).IsRequired();
        }
    }
}
