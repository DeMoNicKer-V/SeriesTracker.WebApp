using SeriesTracker.Tests.UserRepositoryTests;
using Xunit;

namespace SeriesTracker.Tests
{
    //  [CollectionDefinition]: Атрибут, который определяет класс как определение коллекции тестов.
    //  "Sequential": Имя коллекции. Все тесты, входящие в эту коллекцию, будут выполняться последовательно.
    //  DisableParallelization = true: Отключает параллельное выполнение тестов в этой коллекции.
    [CollectionDefinition("Sequential", DisableParallelization = true)]
    public class SequentialCollection : ICollectionFixture<UserRepositoryTestsBase>
    {
        //  Этот класс просто служит маркером и не содержит кода.
        //  Он используется xUnit для определения коллекции тестов и ее настроек.
    }
}