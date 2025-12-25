using CodeBlock.DevKit.Application.Srvices;
using CodeBlock.DevKit.Core.Helpers;
using HeyItIsMe.Application.Dtos.Facts;
using HeyItIsMe.Application.UseCases.Facts.AddFact;
using HeyItIsMe.Application.UseCases.Facts.GenerateFact;
using HeyItIsMe.Application.UseCases.Facts.RemoveFact;
using HeyItIsMe.Application.UseCases.Facts.UpdateFact;
using HeyItIsMe.Application.UseCases.Facts.UpdateFactImageUrl;

namespace HeyItIsMe.Application.Services.Facts;

internal class FactService : ApplicationService, IFactService
{
    public FactService(IRequestDispatcher requestDispatcher)
        : base(requestDispatcher) { }

    public async Task<Result<CommandResult>> AddFact(AddFactDto input)
    {
        return await _requestDispatcher.SendCommand(new AddFactRequest(input.PageId, input.Content, input.Title));
    }

    public async Task<Result<CommandResult>> UpdateFact(string factId, UpdateFactDto input)
    {
        return await _requestDispatcher.SendCommand(new UpdateFactRequest(factId, input.Title, input.Content));
    }

    public async Task<Result<CommandResult>> RemoveFact(string factId)
    {
        return await _requestDispatcher.SendCommand(new RemoveFactRequest(factId));
    }

    public async Task<Result<CommandResult>> UpdateFactImageUrl(string factId, UpdateFactImageUrlDto input)
    {
        return await _requestDispatcher.SendCommand(new UpdateFactImageUrlRequest(factId, input.Base64Image));
    }

    public async Task<Result<CommandResult>> GenerateFact(string pageId, string questionId, string answer)
    {
        return await _requestDispatcher.SendCommand(new GenerateFactRequest(pageId, questionId, answer));
    }
}
