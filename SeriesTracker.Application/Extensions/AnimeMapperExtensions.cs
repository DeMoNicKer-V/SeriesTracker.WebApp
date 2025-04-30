using AutoMapper;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Extensions
{
    /// <summary>
    /// Статический класс, содержащий методы расширения для IMapper,
    /// упрощающие маппинг аниме в DTO с учетом пользоватеской информации.
    /// </summary>
    public static class AnimeMapperExtensions
    {
        /// <summary>
        /// Маппит ShikimoriAnimeFull в AnimeSeriesFullDto, добавляя пользоватескую информацию, если она предоставлена.
        /// </summary>
        /// <param name="mapper">Экземпляр IMapper.</param>
        /// <param name="anime">Объект ShikimoriAnimeFull для маппинга.</param>
        /// <param name="series">Объект SeriesCategoryDto, содержащий пользоватескую информацию (может быть null).</param>
        /// <returns>Объект AnimeSeriesFullDto с полной информацией об аниме и пользоватеских данных.</returns>
        public static AnimeSeriesFullDto MapToFullSeriesDto(this IMapper mapper, ShikimoriAnimeFull anime, SeriesCategoryDto? series)
        {
            if (series == null)
            {
                // Если пользовательская информация отсутствует, маппим только базовые данные аниме.
                return mapper.Map<AnimeSeriesFullDto>(anime, opt => { });
            }

            // Если пользовательская информация предоставлена, добавляем ее в контекст маппинга и маппим аниме.
            return mapper.Map<AnimeSeriesFullDto>(anime, opt =>
            {
                opt.Items["SeriesId"] = series.SeriesId;
                opt.Items["WatchedEpisodes"] = series.WatchedEpisodes;
                opt.Items["AddedDate"] = series.AddedDate;
                opt.Items["ChangedDate"] = series.ChangedDate;
                MapCategoryProperties(opt, series);
            });
        }

        /// <summary>
        /// Маппит ShikimoriAnime в AnimeSeriesDto, добавляя пользоватескую информацию, если она предоставлена.
        /// </summary>
        /// <param name="mapper">Экземпляр IMapper.</param>
        /// <param name="anime">Объект ShikimoriAnime для маппинга.</param>
        /// <param name="series">Объект SeriesCategoryDto, содержащий пользоватескую информацию (может быть null).</param>
        /// <returns>Объект AnimeSeriesDto с информацией об аниме и пользоватеских данных.</returns>
        public static AnimeSeriesDto MapToShortSeriesDto(this IMapper mapper, ShikimoriAnime anime, SeriesCategoryDto? series)
        {
            if (series == null)
            {
                // Если пользовательская информация отсутствует, маппим только базовые данные аниме.
                return mapper.Map<AnimeSeriesDto>(anime, opt => { });
            }

            // Если пользовательская информация предоставлена, добавляем ее в контекст маппинга и маппим аниме.
            return mapper.Map<AnimeSeriesDto>(anime, opt =>
            {
                MapCategoryProperties(opt, series);
            });
        }

        // Устанавливает свойства категории (CategoryId, CategoryName, CategoryColor, IsFavorite) из ResolutionContext.
        private static void MapCategoryProperties<T>(IMappingOperationOptions<object, T> opt, SeriesCategoryDto series)
        {
            // Получаем соответствующие данные из context.Items.
            opt.Items["CategoryId"] = series.CategoryId;
            opt.Items["CategoryName"] = series.CategoryName;
            opt.Items["CategoryColor"] = series.CategoryColor;
            opt.Items["IsFavorite"] = series.IsFavorite;
        }
    }
}