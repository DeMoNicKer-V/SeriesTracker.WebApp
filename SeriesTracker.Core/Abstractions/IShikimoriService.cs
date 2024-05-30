using GraphQL;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriService
    {
        Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimes(int page);
        Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimesByName(int page, string name);
        Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimeById(string Id);
    }
}
