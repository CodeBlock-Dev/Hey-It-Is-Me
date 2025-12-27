namespace HeyItIsMe.Core.Domain.Pages;

/// <summary>
/// Represents the current state of a page in the creation wizard.
/// </summary>
public enum PageState
{
    /// <summary>
    /// Page has been created but display name is not set yet.
    /// </summary>
    PendingDisplayName = 0,

    /// <summary>
    /// Display name is set but avatar image is not uploaded yet.
    /// </summary>
    PendingAvatar = 1,

    /// <summary>
    /// Avatar is uploaded but reference image is not set yet.
    /// </summary>
    PendingReferenceImage = 2,

    /// <summary>
    /// Reference image is set but contacts are not added yet.
    /// </summary>
    PendingContacts = 3,

    /// <summary>
    /// Contacts are added but questions are not completed yet.
    /// </summary>
    PendingQuestions = 4,

    /// <summary>
    /// All wizard steps are completed and the page is ready.
    /// </summary>
    Completed = 5
}

