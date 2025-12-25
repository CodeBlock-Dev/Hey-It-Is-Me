using AutoMapper;
using CodeBlock.DevKit.AIChatBot.Domain.Bots;
using CodeBlock.DevKit.AIChatBot.Domain.Credits;
using CodeBlock.DevKit.Application.Queries;
using CodeBlock.DevKit.Application.Srvices;
using HeyItIsMe.Application.Contracts;
using HeyItIsMe.Application.Dtos.Questions;
using HeyItIsMe.Core.Domain.Pages;
using HeyItIsMe.Core.Domain.Questions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace HeyItIsMe.Application.UseCases.Questions.GetOrderedQuestions;

internal class GetOrderedQuestionsUseCase : BaseQueryHandler, IRequestHandler<GetOrderedQuestionsRequest, IEnumerable<GetQuestionDto>>
{
    private readonly IQuestionRepository _questionRepository;
    private readonly ICurrentUser _currentUser;
    private readonly IPageRepository _pageRepository;
    private readonly ICreditRepository _creditRepository;
    private readonly IBotRepository _botRepository;
    public GetOrderedQuestionsUseCase(IQuestionRepository questionRepository, IMapper mapper, ILogger<GetOrderedQuestionsUseCase> logger, ICurrentUser currentUser, IPageRepository pageRepository, ICreditRepository creditRepository, IBotRepository botRepository)
        : base(mapper, logger)
    {
        _questionRepository = questionRepository;
        _currentUser = currentUser;
        _pageRepository = pageRepository;
        _creditRepository = creditRepository;
        _botRepository = botRepository;
    }

    public async Task<IEnumerable<GetQuestionDto>> Handle(GetOrderedQuestionsRequest request, CancellationToken cancellationToken)
    {
        var questions = await _questionRepository.GetListAsync();
        var page= await _pageRepository.GetByUserIdAsync(_currentUser.GetUserId());
        var imageBot = await _botRepository.GetBySystemName(Constants.FACT_IMAGE_GENERATOR_BOT);
        var imageCredits = (int) await _creditRepository.GetUserCreditsAmount(imageBot.Id,_currentUser.GetUserId());

        var orderedQuestions = questions.Where(q=> !page.Facts.Any(f=>f.QuestionId==q.Id)).OrderBy(q => q.Order).Take(imageCredits).ToList();

        var questionsDto = _mapper.Map<IEnumerable<GetQuestionDto>>(orderedQuestions);

        return questionsDto;
    }
}
