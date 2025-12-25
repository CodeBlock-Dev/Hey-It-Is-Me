using CodeBlock.DevKit.Contracts.Dtos;
using CodeBlock.DevKit.Core.Helpers;
using HeyItIsMe.Application.Dtos.Pages;
using HeyItIsMe.Core.Domain.Pages;

namespace HeyItIsMe.Application.Services.Pages;

public interface IPageService
{
    /// <summary>
    /// Retrieves a page by its user Id.
    /// </summary>
    Task<Result<GetPageDto>> GetPageByUserId(string userId);

    /// <summary>
    /// Checks if a user has any page.
    /// </summary>
    Task<Result<bool>> UserHasAnyPage(string userId);

    /// <summary>
    /// Retrieves a page by its unique identifier.
    /// </summary>
    Task<Result<GetPageDto>> GetPage(string id);

    /// <summary>
    /// Creates a new page with the specified data.
    /// </summary>
    Task<Result<CommandResult>> CreatePage(CreatePageDto input);

    /// <summary>
    /// Updates the route of an existing page.
    /// </summary>
    Task<Result<CommandResult>> UpdatePageRoute(string id, UpdatePageRouteDto input);

    /// <summary>
    /// Updates the display name of an existing page.
    /// </summary>
    Task<Result<CommandResult>> UpdatePageDisplayName(string id, UpdatePageDisplayNameDto input);

    /// <summary>
    /// Updates the avatar image of an existing page.
    /// </summary>
    Task<Result<CommandResult>> UpdatePageAvatarImage(string id, string base64Image);

    /// <summary>
    /// Updates the reference image of an existing page.
    /// </summary>
    Task<Result<CommandResult>> UpdatePageReferenceImage(string id, string base64Image);

    /// <summary>
    /// Searches for pages based on specified criteria.
    /// </summary>
    Task<Result<SearchOutputDto<GetPageDto>>> SearchPages(SearchPagesInputDto input);

    /// <summary>
    /// Updates the state of an existing page.
    /// </summary>
    Task<Result<CommandResult>> UpdatePageState(string id, PageState state);
}
