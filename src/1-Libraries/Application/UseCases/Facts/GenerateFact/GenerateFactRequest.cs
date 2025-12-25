using System.ComponentModel.DataAnnotations;
using CodeBlock.DevKit.Application.Commands;
using CodeBlock.DevKit.Core.Resources;
using HeyItIsMe.Core.Resources;

namespace HeyItIsMe.Application.UseCases.Facts.GenerateFact;

internal class GenerateFactRequest : BaseCommand
{
    public GenerateFactRequest(string pageId, string questionId, string answer)
    {
        PageId = pageId;
        QuestionId = questionId;
        Answer = answer;
    }

    public string PageId { get; }

    [Display(Name = nameof(SharedResource.Question), ResourceType = typeof(SharedResource))]
    [Required(ErrorMessageResourceName = nameof(CoreResource.Required), ErrorMessageResourceType = typeof(CoreResource))]
    public string QuestionId { get; }

    [Display(Name = nameof(SharedResource.Answer), ResourceType = typeof(SharedResource))]
    [Required(ErrorMessageResourceName = nameof(CoreResource.Required), ErrorMessageResourceType = typeof(CoreResource))]
    public string Answer { get; }
}
