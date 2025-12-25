using CodeBlock.DevKit.Application.Srvices;
using CodeBlock.DevKit.Contracts.Dtos;
using CodeBlock.DevKit.Core.Helpers;
using HeyItIsMe.Application.Dtos.Pages;
using HeyItIsMe.Application.UseCases.Pages.CreatePage;
using HeyItIsMe.Application.UseCases.Pages.GetPage;
using HeyItIsMe.Application.UseCases.Pages.GetPageByUserId;
using HeyItIsMe.Application.UseCases.Pages.UserHasAnyPage;
using HeyItIsMe.Application.UseCases.Pages.SearchPages;
using HeyItIsMe.Application.UseCases.Pages.UpdatePageAvatarImage;
using HeyItIsMe.Application.UseCases.Pages.UpdatePageDisplayName;
using HeyItIsMe.Application.UseCases.Pages.UpdatePageReferenceImage;
using HeyItIsMe.Application.UseCases.Pages.UpdatePageRoute;
using HeyItIsMe.Application.UseCases.Pages.UpdatePageState;
using HeyItIsMe.Core.Domain.Pages;

namespace HeyItIsMe.Application.Services.Pages;

internal class PageService : ApplicationService, IPageService
{
    public PageService(IRequestDispatcher requestDispatcher)
        : base(requestDispatcher) { }

    public async Task<Result<GetPageDto>> GetPageByUserId(string userId)
    {
        return await _requestDispatcher.SendQuery(new GetPageByUserIdRequest(userId));
    }

    public async Task<Result<bool>> UserHasAnyPage(string userId)
    {
        return await _requestDispatcher.SendQuery(new UserHasAnyPageRequest(userId));
    }

    public async Task<Result<GetPageDto>> GetPage(string id)
    {
        return await _requestDispatcher.SendQuery(new GetPageRequest(id));
    }

    public async Task<Result<CommandResult>> CreatePage(CreatePageDto input)
    {
        return await _requestDispatcher.SendCommand(new CreatePageRequest(input.Route));
    }

    public async Task<Result<CommandResult>> UpdatePageRoute(string id, UpdatePageRouteDto input)
    {
        return await _requestDispatcher.SendCommand(new UpdatePageRouteRequest(id, input.Route));
    }

    public async Task<Result<CommandResult>> UpdatePageDisplayName(string id, UpdatePageDisplayNameDto input)
    {
        return await _requestDispatcher.SendCommand(new UpdatePageDisplayNameRequest(id, input.DisplayName));
    }

    public async Task<Result<CommandResult>> UpdatePageAvatarImage(string id, string base64Image)
    {
        return await _requestDispatcher.SendCommand(new UpdatePageAvatarImageRequest(id, base64Image));
    }

    public async Task<Result<CommandResult>> UpdatePageReferenceImage(string id, string base64Image)
    {
        return await _requestDispatcher.SendCommand(new UpdatePageReferenceImageRequest(id, base64Image));
    }

    public async Task<Result<CommandResult>> UpdatePageState(string id, PageState state)
    {
        return await _requestDispatcher.SendCommand(new UpdatePageStateRequest(id, state));
    }

    public async Task<Result<SearchOutputDto<GetPageDto>>> SearchPages(SearchPagesInputDto input)
    {
        return await _requestDispatcher.SendQuery(
            new SearchPagesRequest(input.Term, input.PageNumber, input.RecordsPerPage, input.SortOrder, input.FromDateTime, input.ToDateTime)
        );
    }
}
