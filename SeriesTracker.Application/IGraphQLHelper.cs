using AutoMapper;
using GraphQL;
using Microsoft.Extensions.Logging;

namespace SeriesTracker.Application
{
    public interface IGraphQLHelper
    {
        /// <summary>
        /// Выполняет GraphQL-запрос и преобразует результат с использованием AutoMapper.
        /// </summary>
        /// <typeparam name="TSource">Тип данных, возвращаемых GraphQL-запросом.</typeparam>
        /// <typeparam name="TResult">Тип данных, в который необходимо преобразовать результат.</typeparam>
        /// <param name="request">GraphQL-запрос для выполнения.</param>
        /// <param name="logger">Интерфейс логгера для записи информации о запросе и возможных ошибках.</param>
        /// <param name="mapper">Интерфейс AutoMapper для преобразования данных.</param>
        /// <returns>Преобразованный результат GraphQL-запроса или null, если произошла ошибка.</returns>
        Task<TResult?> ExecuteGraphQLRequest<TSource, TResult>(GraphQLRequest request, ILogger logger, IMapper mapper);

        /// <summary>
        /// Выполняет GraphQL-запрос и возвращает результат указанного типа.
        /// </summary>
        /// <typeparam name="TSource">Тип данных, возвращаемых GraphQL-запросом.</typeparam>
        /// <typeparam name="TResult">Тип данных, в который необходимо преобразовать результат.</typeparam>
        /// <param name="request">GraphQL-запрос для выполнения.</param>
        /// <param name="logger">Интерфейс логгера для записи информации о запросе и возможных ошибках.</param>
        /// <returns>Результат GraphQL-запроса или null, если произошла ошибка.</returns>
        Task<TResult?> ExecuteGraphQLRequest<TSource, TResult>(GraphQLRequest request, ILogger logger);

        /// <summary>
        /// Выполняет GraphQL-запрос и возвращает результат указанного типа.
        /// </summary>
        /// <typeparam name="TSource">Тип данных, возвращаемых GraphQL-запросом.</typeparam>
        /// <param name="request">GraphQL-запрос для выполнения.</param>
        /// <param name="logger">Интерфейс логгера для записи информации о запросе и возможных ошибках.</param>
        /// <returns>Результат GraphQL-запроса или null, если произошла ошибка.</returns>
        Task<TSource?> ExecuteGraphQLRequest<TSource>(GraphQLRequest request, ILogger logger);
    }
}