using CodeBlock.DevKit.Core.Helpers;
using HeyItIsMe.Application.Dtos.Facts;

namespace HeyItIsMe.Application.Services.Facts;

public interface IFactService
{
    /// <summary>
    /// Adds a new fact to a page with the specified data.
    /// </summary>
    Task<Result<CommandResult>> AddFact(AddFactDto input);

    /// <summary>
    /// Updates an existing fact with new data.
    /// </summary>
    Task<Result<CommandResult>> UpdateFact(string factId, UpdateFactDto input);

    /// <summary>
    /// Removes a fact from a page.
    /// </summary>
    Task<Result<CommandResult>> RemoveFact(string factId);

    /// <summary>
    /// Updates the image URL for a fact.
    /// </summary>
    Task<Result<CommandResult>> UpdateFactImageUrl(string factId, UpdateFactImageUrlDto input);

    /// <summary>
    /// Generates a new fact based on question and answer.
    /// </summary>
    Task<Result<CommandResult>> GenerateFact(string pageId, string questionId, string answer);
}
