using CodeBlock.DevKit.AIChatBot.Domain.Bots;
using CodeBlock.DevKit.Application.Commands;
using CodeBlock.DevKit.Application.Srvices;
using CodeBlock.DevKit.Core.Extensions;
using CodeBlock.DevKit.Core.Helpers;
using HeyItIsMe.Application.Contracts;
using HeyItIsMe.Application.Exceptions;
using HeyItIsMe.Core.Domain.Pages;
using HeyItIsMe.Core.Domain.Questions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace HeyItIsMe.Application.UseCases.Facts.GenerateFact;

internal class GenerateFactUseCase : BaseCommandHandler, IRequestHandler<GenerateFactRequest, CommandResult>
{
    private readonly IPageRepository _pageRepository;
    private readonly IAITextService _aiTextService;
    private readonly IAIImageService _aiImageService;
    private readonly IBotRepository _botRepository;
    private readonly IImageService _imageService;
    private readonly IQuestionRepository _questionRepository;
    public GenerateFactUseCase(
        IPageRepository pageRepository,
        IRequestDispatcher requestDispatcher,
        ILogger<GenerateFactUseCase> logger,
        IAITextService aiTextService,
        IAIImageService aiImageService,
        IBotRepository botRepository,
        IImageService imageService
,
        IQuestionRepository questionRepository)
        : base(requestDispatcher, logger)
    {
        _pageRepository = pageRepository;
        _aiTextService = aiTextService;
        _aiImageService = aiImageService;
        _botRepository = botRepository;
        _imageService = imageService;
        _questionRepository = questionRepository;
    }

    public async Task<CommandResult> Handle(GenerateFactRequest request, CancellationToken cancellationToken)
    {
        var page = await _pageRepository.GetByIdAsync(request.PageId);
        if (page == null)
            throw PageApplicationExceptions.PageNotFound(request.PageId);

        var loadedVersion = page.Version;

        var fact = await GenerateFactAndAddItToPage(page, request);

        await _pageRepository.ConcurrencySafeUpdateAsync(page, loadedVersion);

        await PublishDomainEventsAsync(page.GetDomainEvents());

        return CommandResult.Create(entityId: fact.Id);
    }

    private async Task<Fact> GenerateFactAndAddItToPage(Page page, GenerateFactRequest request)
    {
        var question = await _questionRepository.GetByIdAsync(request.QuestionId);
        if (question == null)
            throw QuestionApplicationExceptions.QuestionNotFound(request.QuestionId);

        var textBot = await _botRepository.GetBySystemName(Constants.FACT_TEXT_GENERATOR_BOT);
        if (textBot == null)
            throw PageApplicationExceptions.FactGeneratorBotNotFound(Constants.FACT_TEXT_GENERATOR_BOT);

        var imageBot = await _botRepository.GetBySystemName(Constants.FACT_IMAGE_GENERATOR_BOT);
        if (imageBot == null)
            throw PageApplicationExceptions.FactGeneratorBotNotFound(Constants.FACT_IMAGE_GENERATOR_BOT);

        var content = await GetFactContent(textBot, question.Content, request.Answer);
        var title = await GetFactTitle(textBot, question.Content, request.Answer, content);
        var base64Image = await GetFactBase64Image(page, imageBot, question.Content, request.Answer, title, content);

        var fact = page.AddFact(title, content, question.Id);

        var fileName = $"{fact.Id}.jpg?v={RandomDataGenerator.GetRandomNumber(5)}";

        var savedImageUrl = await _imageService.SaveImageFileAsync(fileName, base64Image, "pages", page.Id, "facts");

        page.UpdateFactImageUrl(fact.Id, savedImageUrl);

        return fact;
    }

    private async Task<string> GetFactContent(Bot bot, string question, string answer)
    {
        var prompt = bot.Prompts.FirstOrDefault(p => p.Title == Constants.FACT_CONTENT_GENERATOR_PROMPT);
        if (prompt == null)
            PageApplicationExceptions.RequiredPromptIsMissing();

        if (prompt.Content.Contains("{QUESTIONS}") || prompt.Content.Contains("{ANSWER}"))
        {
            var promptContent = prompt.Content.Replace("{QUESTIONS}", question).Replace("{ANSWER}", answer);
            bot.UpdatePrompt(prompt.Id, promptContent, prompt.Type, prompt.Title, prompt.Order, prompt.Status, prompt.Tokens);
        }

        return await _aiTextService.GenerateTextAsync(bot.LLMParameters, bot.Prompts.Where(p => p.Title == Constants.FACT_CONTENT_GENERATOR_PROMPT).ToList());
    }

    private async Task<string> GetFactTitle(Bot bot, string question, string answer, string content)
    {
        var prompt = bot.Prompts.FirstOrDefault(p => p.Title == Constants.FACT_TITLE_GENERATOR_PROMPT);
        if (prompt == null)
            PageApplicationExceptions.RequiredPromptIsMissing();

        if (prompt.Content.Contains("{QUESTIONS}") || prompt.Content.Contains("{ANSWER}") || prompt.Content.Contains("{FACT_CONTENT}"))
        {
            var promptContent = prompt.Content.Replace("{QUESTIONS}", question).Replace("{ANSWER}", answer).Replace("{FACT_CONTENT}", content);
            bot.UpdatePrompt(prompt.Id, promptContent, prompt.Type, prompt.Title, prompt.Order, prompt.Status, prompt.Tokens);
        }

        return await _aiTextService.GenerateTextAsync(bot.LLMParameters, bot.Prompts.Where(p => p.Title == Constants.FACT_TITLE_GENERATOR_PROMPT).ToList());

    }

    private async Task<string> GetFactBase64Image(Page page, Bot bot, string question, string answer, string title, string content)
    {
        foreach (var prompt in bot.Prompts)
        {
            if (
                prompt.Content.Contains("{QUESTIONS}")
                || prompt.Content.Contains("{ANSWER}")
                || prompt.Content.Contains("{FACT_CONTENT}")
                || prompt.Content.Contains("{FACT_TITLE}")
            )
            {
                var promptContent = prompt
                    .Content.Replace("{QUESTIONS}", question)
                    .Replace("{ANSWER}", answer)
                    .Replace("{FACT_CONTENT}", content)
                    .Replace("{FACT_TITLE}", title);
                bot.UpdatePrompt(prompt.Id, promptContent, prompt.Type, prompt.Title, prompt.Order, prompt.Status, prompt.Tokens);
            }
        }

        var referenceImageBase64 = await _imageService.GetBase64FromImageUrl(page.ReferenceImageUrl);

        return await _aiImageService.GenerateImageAsync(bot.LLMParameters, bot.Prompts, referenceImageBase64);
    }
}
