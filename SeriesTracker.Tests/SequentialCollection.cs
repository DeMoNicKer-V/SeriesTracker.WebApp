using SeriesTracker.Tests.UserRepositoryTests;
using Xunit;

namespace SeriesTracker.Tests
{
    [CollectionDefinition("Sequential", DisableParallelization = true)]
    public class SequentialCollection : ICollectionFixture<UserRepositoryTestsBase>
    {
        // Этот класс просто служит маркером и не содержит кода
    }
}