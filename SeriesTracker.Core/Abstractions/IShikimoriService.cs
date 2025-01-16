using GraphQL;
using GraphQL.Client.Abstractions;
using SeriesTracker.Core.Models;
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
         Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimes(int page, string order);


         Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimesByName(string name);


         Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimeById(string Id);


         Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimeListByIds(string Id);


        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParams(int page, string name, string season, string status, string kind, string genre, string order, bool censored);
    

         Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParamsAndIds(int page, string name, string ids, string season, string status, string kind, string genre, string order, bool censored);


         Task<GraphQLResponse<GenreList>> GetGenres();
  

         Task<GraphQLResponse<ShikimoriAnimeList>> GetRandomAnime();
    
    }
}
