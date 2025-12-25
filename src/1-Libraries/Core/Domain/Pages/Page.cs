using CodeBlock.DevKit.Core.Extensions;
using CodeBlock.DevKit.Domain.Entities;

namespace HeyItIsMe.Core.Domain.Pages;

public sealed class Page : AggregateRoot
{
    private Page(string route, string userId, IPageRepository pageRepository)
    {
        Route = route;
        DisplayName = string.Empty;
        UserId = userId;
        AvatarImageUrl = string.Empty;
        ReferenceImageUrl = string.Empty;
        Contacts = new List<Contact>();
        Facts = new List<Fact>();

        CheckPageCreationPolicies(pageRepository);

        AddDomainEvent(new PageCreated(Id, Route));
        TrackChange(nameof(PageCreated));
    }

    /// <summary>
    /// The unique route for accessing this page. Required field that cannot be empty.
    /// </summary>
    public string Route { get; private set; }

    /// <summary>
    /// The display name shown to users. Required field that cannot be empty.
    /// </summary>
    public string DisplayName { get; private set; }

    /// <summary>
    /// Identifier of the user who owns this page. Required field for ownership tracking.
    /// </summary>
    public string UserId { get; private set; }

    /// <summary>
    /// Collection of contacts associated with this page. Managed through domain methods.
    /// </summary>
    public ICollection<Contact> Contacts { get; private set; }

    /// <summary>
    /// Collection of facts associated with this page. Managed through domain methods.
    /// </summary>
    public ICollection<Fact> Facts { get; private set; }

    public string AvatarImageUrl { get; private set; }

    public string ReferenceImageUrl { get; private set; }

    public static Page Create(string route, string userId, IPageRepository pageRepository)
    {
        return new Page(route, userId, pageRepository);
    }

    public void UpdateRoute(string route, IPageRepository pageRepository)
    {
        Route = route;

        CheckRoutePolicy(pageRepository);

        AddDomainEvent(new PageRouteUpdated(Id, Route));
        TrackChange(nameof(PageRouteUpdated));
    }

    public void UpdateDisplayName(string displayName)
    {
        DisplayName = displayName;

        CheckDisplayNamePolicy();

        AddDomainEvent(new PageDisplayNameUpdated(Id, DisplayName));
        TrackChange(nameof(PageDisplayNameUpdated));
    }

    public void UpdateAvatarImageUrl(string avatarImageUrl)
    {
        if (AvatarImageUrl == avatarImageUrl)
            return;

        AvatarImageUrl = avatarImageUrl;

        AddDomainEvent(new PageAvatarImageUpdated(Id, AvatarImageUrl));
        TrackChange(nameof(PageAvatarImageUpdated));
    }

    public void UpdateReferenceImageUrl(string referenceImageUrl)
    {
        if (ReferenceImageUrl == referenceImageUrl)
            return;

        ReferenceImageUrl = referenceImageUrl;

        AddDomainEvent(new PageReferenceImageUpdated(Id, ReferenceImageUrl));
        TrackChange(nameof(PageReferenceImageUpdated));
    }

    public Contact AddContact(string content)
    {
        var contact = Contact.Create(content);

        // Check if contact with same content already exists
        if (Contacts.Any(c => c.Content == content))
            throw PageDomainExceptions.ContactAlreadyExists();

        Contacts.Add(contact);

        AddDomainEvent(new ContactAdded(Id, contact.Id, content));
        TrackChange(nameof(ContactAdded));

        return contact;
    }

    public void UpdateContact(string contactId, string content)
    {
        var contact = Contacts.FirstOrDefault(c => c.Id == contactId);
        if (contact == null)
            throw PageDomainExceptions.ContactNotFound();

        contact.Update(content);

        AddDomainEvent(new ContactUpdated(Id, contactId, content));
        TrackChange(nameof(ContactUpdated));
    }

    public void RemoveContact(string contactId)
    {
        var contact = Contacts.FirstOrDefault(c => c.Id == contactId);
        if (contact == null)
            throw PageDomainExceptions.ContactNotFound();

        Contacts.Remove(contact);

        AddDomainEvent(new ContactRemoved(Id, contactId));
        TrackChange(nameof(ContactRemoved));
    }

    public Fact AddFact(string title, string content, string questionId)
    {
        var fact = Fact.Create(title, content, questionId);

        Facts.Add(fact);

        AddDomainEvent(new FactAdded(Id, fact.Id, title, content));
        TrackChange(nameof(FactAdded));

        return fact;
    }

    public void UpdateFact(string factId, string title, string content)
    {
        var fact = Facts.FirstOrDefault(f => f.Id == factId);
        if (fact == null)
            throw PageDomainExceptions.FactNotFound();

        fact.Update(title, content);

        AddDomainEvent(new FactUpdated(Id, factId, title, content));
        TrackChange(nameof(FactUpdated));
    }

    public void RemoveFact(string factId)
    {
        var fact = Facts.FirstOrDefault(f => f.Id == factId);
        if (fact == null)
            throw PageDomainExceptions.FactNotFound();

        Facts.Remove(fact);

        AddDomainEvent(new FactRemoved(Id, factId));
        TrackChange(nameof(FactRemoved));
    }

    public void UpdateFactImageUrl(string factId, string imageUrl)
    {
        var fact = Facts.FirstOrDefault(f => f.Id == factId);
        if (fact == null)
            throw PageDomainExceptions.FactNotFound();

        fact.UpdateImageUrl(imageUrl);

        AddDomainEvent(new FactImageUrlUpdated(Id, factId, imageUrl));
        TrackChange(nameof(FactImageUrlUpdated));
    }

    protected override void CheckInvariants() { }

    private void CheckPageCreationPolicies(IPageRepository pageRepository)
    {
        CheckRoutePolicy(pageRepository);
        CheckUserIdPolicy();
    }

    private void CheckRoutePolicy(IPageRepository pageRepository)
    {
        if (Route.IsNullOrEmptyOrWhiteSpace())
            throw PageDomainExceptions.RouteIsRequired();

        if (!Route.IsAlphanumericAndUnderscore())
            throw PageDomainExceptions.RouteMustContainOnlyAlphanumericAndUnderscore();

        var isRouteInUse = pageRepository.IsRouteInUse(Route, Id);
        if (isRouteInUse)
            throw PageDomainExceptions.RouteAlreadyExists();
    }

    private void CheckDisplayNamePolicy()
    {
        if (DisplayName.IsNullOrEmptyOrWhiteSpace())
            throw PageDomainExceptions.DisplayNameIsRequired();
    }

    private void CheckUserIdPolicy()
    {
        if (UserId.IsNullOrEmptyOrWhiteSpace())
            throw PageDomainExceptions.UserIdIsRequired();
    }
}
