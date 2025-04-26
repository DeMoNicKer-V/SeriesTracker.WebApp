using AutoMapper;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;
using System.Collections.ObjectModel;

namespace SeriesTracker.Core.Mappers
{
    public class AnimeMappingProfile : Profile
    {
        // Список строк, которые не должны включаться в связанные аниме.
        private static readonly ReadOnlyCollection<string> _sourceArray = new(["MUSIC", "PV", "CM"]);

        // Конструктор класса AnimeMappingProfile. Здесь определяются все маппинги AutoMapper.
        public AnimeMappingProfile()
        {
            // Маппинг из ShikimoriAnimeDto в ShikimoriAnime.
            CreateMap<ShikimoriAnimeDto, ShikimoriAnime>().AfterMap((src, dest) =>
            {
                dest.Description = ConvertDescription(src.Description);
                dest.Rating = ConvertRating(src.Rating);
                dest.Kind = ConvertKind(src.Kind);
                dest.Status = ConvertStatus(src.Status);
            });

            // Маппинг из ShikimoriAnimeFullDto в ShikimoriAnimeFull.

            CreateMap<ShikimoriAnimeFullDto, ShikimoriAnimeFull>()
                .IncludeBase<ShikimoriAnimeDto, ShikimoriAnime>()
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
                .ForMember(dest => dest.Relateds, opt => opt.MapFrom(src => GetRelateds(src.Relateds)));

            // Маппинг из ShikimoriAnime в AnimeSeriesDto.
            CreateMap<ShikimoriAnime, AnimeSeriesDto>()

              // Вызываем метод BeforeMap для установки свойств категории.
              .BeforeMap((_, dest, context) =>
              {
                  if (context.Items.Count == 0)
                  {
                      return;
                  }

                  MapCategoryProperties(dest, context);
              });

            // Маппинг из ShikimoriAnimeFull в AnimeSeriesFullDto.
            CreateMap<ShikimoriAnimeFull, AnimeSeriesFullDto>()

                // Вызываем метод BeforeMap для установки свойств, специфичных для AnimeSeriesFullDto и свойств категории.
                .BeforeMap((_, dest, context) =>
                {
                    if (context.Items.Count == 0)
                    {
                        return;
                    }

                    dest.SeriesId = (Guid)context.Items["SeriesId"];
                    dest.WatchedEpisodes = (int)context.Items["WatchedEpisodes"];
                    dest.ChangedDate = (string)context.Items["ChangedDate"];
                    dest.AddedDate = (string)context.Items["AddedDate"];
                    dest.IsFavorite = (bool)context.Items["IsFavorite"];
                    MapCategoryProperties(dest, context);
                });
        }

        // Преобразует описание аниме с использованием регулярных выражений.
        // Возвращает null, если описание отсутствует.
        private static string? ConvertDescription(string? descriptionInfo)
        {
            return string.IsNullOrEmpty(descriptionInfo) ? null : AnimeConverter.ConvertDescriptionWithRegex(descriptionInfo);
        }

        // Преобразует тип аниме в русский эквивалент.
        private static string ConvertKind(string? kindInfo)
        {
            return AnimeConverter.ConvertKindToRussian(kindInfo);
        }

        // Преобразует рейтинг аниме в имя изображения.
        private static string ConvertRating(string? ratingInfo)
        {
            return AnimeConverter.ConvertRatingToImageName(ratingInfo);
        }

        // Преобразует статус аниме в значение по умолчанию.
        private static string ConvertStatus(string? statusInfo)
        {
            return AnimeConverter.ConvertStatusToDefault(statusInfo);
        }

        // Фильтрует связанные аниме, исключая элементы, содержащие строки из _sourceArray в свойстве Kind.
        private static Related[]? GetRelateds(Related[]? relatedData)
        {
            if (relatedData == null) return null;

            // Фильтруем связанные аниме, исключая "MUSIC", "PV" и "CM".
            return relatedData.Where(a => a.Anime != null && !_sourceArray.Any(c => a.Anime.Kind?.Contains(c) == true)).ToArray();
        }

        // Устанавливает свойства категории (CategoryId, CategoryName, CategoryColor) из ResolutionContext.
        private static void MapCategoryProperties(IAnimeSeries dest, ResolutionContext context)
        {
            // Получаем соответствующие данные из context.Items.
            dest.CategoryId = (int)context.Items["CategoryId"];
            dest.CategoryName = (string)context.Items["CategoryName"];
            dest.CategoryColor = (string)context.Items["CategoryColor"];
        }
    }
}