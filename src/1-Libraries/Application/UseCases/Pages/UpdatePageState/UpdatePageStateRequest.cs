using CodeBlock.DevKit.Application.Commands;
using HeyItIsMe.Core.Domain.Pages;

namespace HeyItIsMe.Application.UseCases.Pages.UpdatePageState;

internal class UpdatePageStateRequest : BaseCommand
{
    public UpdatePageStateRequest(string id, PageState state)
    {
        Id = id;
        State = state;
    }

    /// <summary>
    /// The unique identifier of the page to update.
    /// </summary>
    public string Id { get; }

    /// <summary>
    /// The new state for the page.
    /// </summary>
    public PageState State { get; }
}

