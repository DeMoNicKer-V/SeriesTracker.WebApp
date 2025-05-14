using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.IntegrationTests
{
    public class ShikimoriContollerIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IShikimoriService>(factory)
    {

    }
}
