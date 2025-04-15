using SeriesTracker.Core.Models.Shikimori;
using System.Text.Json;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICalendarFetcher
    {
        /// <summary>
        /// Получает данные календаря аниме из внешнего источника.
        /// Фильтрует элементы, чтобы вернуть только те, у которых дата следующего эпизода находится в пределах следующих 7 дней.
        /// </summary>
        /// <returns>Коллекция объектов <see cref="CalendarAnimeItem"/>, представляющих аниме, выходящие в течение следующих 7 дней.</returns>
        /// <exception cref="HttpRequestException">Выбрасывается в случае ошибок при выполнении HTTP-запроса.</exception>
        /// <exception cref="JsonException">Выбрасывается в случае ошибок при десериализации.</exception>
        /// <exception cref="Exception">Выбрасывается при непредвиденных ошибках.</exception>
        Task<IEnumerable<CalendarAnimeItem>> FetchData();
    }
}
