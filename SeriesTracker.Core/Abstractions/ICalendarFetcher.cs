using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICalendarFetcher
    {
        /// <summary>
        /// Получает данные календаря аниме из внешнего источника.
        /// Фильтрует элементы, чтобы вернуть только те, у которых дата следующего эпизода находится в пределах следующих 7 дней.
        /// </summary>
        /// <returns>Коллекция объектов <see cref="CalendarAnimeItem"/>, представляющих аниме, выходящие в течение следующих 7 дней.</returns>
        /// <exception cref="Exception">Выбрасывается в случае ошибок при выполнении HTTP-запроса, десериализации JSON или других непредвиденных ошибок.</exception>
        Task<IEnumerable<CalendarAnimeItem>> FetchData();
    }
}
