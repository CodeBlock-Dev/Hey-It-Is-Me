using CodeBlock.DevKit.Core.Helpers;
using CodeBlock.DevKit.Web.Api.Filters;
using HeyItIsMe.Application.Dtos.Facts;
using HeyItIsMe.Application.Services.Facts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeyItIsMe.Api.Controllers;

[Tags("Facts")]
[Route("facts")]
[Authorize]
public class FactsController : BaseApiController
{
    private readonly IFactService _factService;

    public FactsController(IFactService factService)
    {
        _factService = factService;
    }

    [HttpPost]
    public async Task<Result<CommandResult>> Post([FromBody] AddFactDto input)
    {
        return await _factService.AddFact(input);
    }

    [Route("{id}")]
    [HttpPut]
    public async Task<Result<CommandResult>> Put(string id, [FromBody] UpdateFactDto input)
    {
        return await _factService.UpdateFact(id, input);
    }

    [Route("{id}")]
    [HttpDelete]
    public async Task<Result<CommandResult>> Delete(string id)
    {
        return await _factService.RemoveFact(id);
    }

    [Route("{id}/image-url")]
    [HttpPut]
    public async Task<Result<CommandResult>> UpdateImageUrl(string id, [FromBody] UpdateFactImageUrlDto input)
    {
        return await _factService.UpdateFactImageUrl(id, input);
    }

    [Route("generate")]
    [HttpPost]
    public async Task<Result<CommandResult>> GenerateFact([FromBody] GenerateFactDto input)
    {
        return await _factService.GenerateFact(input.PageId, input.QuestionId, input.Answer);
    }
}
