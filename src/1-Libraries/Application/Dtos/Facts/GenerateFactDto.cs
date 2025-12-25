using System.ComponentModel.DataAnnotations;
using CodeBlock.DevKit.Core.Resources;
using HeyItIsMe.Core.Resources;

namespace HeyItIsMe.Application.Dtos.Facts;

public class GenerateFactDto
{
    /// <summary>
    /// The unique identifier of the page to generate the fact for.
    /// </summary>
    [Required(ErrorMessageResourceName = nameof(CoreResource.Required), ErrorMessageResourceType = typeof(CoreResource))]
    public string PageId { get; set; }

    /// <summary>
    /// The question for generating the fact. Required field that cannot be empty.
    /// </summary>
    [Display(Name = nameof(SharedResource.Question), ResourceType = typeof(SharedResource))]
    [Required(ErrorMessageResourceName = nameof(CoreResource.Required), ErrorMessageResourceType = typeof(CoreResource))]
    public string QuestionId { get; set; }

    /// <summary>
    /// The answer for generating the fact. Required field that cannot be empty.
    /// </summary>
    [Display(Name = nameof(SharedResource.Answer), ResourceType = typeof(SharedResource))]
    [Required(ErrorMessageResourceName = nameof(CoreResource.Required), ErrorMessageResourceType = typeof(CoreResource))]
    public string Answer { get; set; }
}
