using CodeBlock.DevKit.Contracts.Dtos;
using HeyItIsMe.Application.Dtos.Contacts;
using HeyItIsMe.Application.Dtos.Facts;
using HeyItIsMe.Core.Domain.Pages;

namespace HeyItIsMe.Application.Dtos.Pages;

public class GetPageDto : GetEntityDto
{
    /// <summary>
    /// The unique route for accessing this page for display purposes.
    /// </summary>
    public string Route { get; set; }

    /// <summary>
    /// The display name shown to users for display purposes.
    /// </summary>
    public string DisplayName { get; set; }

    /// <summary>
    /// The unique identifier of the user who owns this page.
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// Collection of contacts associated with this page.
    /// </summary>
    public ICollection<GetContactDto> Contacts { get; set; }

    /// <summary>
    /// Collection of facts associated with this page.
    /// </summary>
    public ICollection<GetFactDto> Facts { get; set; }

    /// <summary>
    /// URL of the avatar image for this page. Can be empty if no avatar is set.
    /// </summary>
    public string AvatarImageUrl { get; set; }

    /// <summary>
    /// URL of the reference image used for AI image generation. Can be empty if no reference image is set.
    /// </summary>
    public string ReferenceImageUrl { get; set; }

    /// <summary>
    /// The current state of the page in the creation wizard.
    /// </summary>
    public PageState State { get; set; }
}
