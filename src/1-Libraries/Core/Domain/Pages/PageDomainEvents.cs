using CodeBlock.DevKit.Domain.Events;

namespace HeyItIsMe.Core.Domain.Pages;

/// <summary>
/// Event raised when a new Page entity is created. This event contains the essential
/// information about the newly created page that other parts of the system might need.
/// </summary>
public record PageCreated(string Id, string Route) : IDomainEvent;

public record PageRouteUpdated(string Id, string Route) : IDomainEvent;

public record PageDisplayNameUpdated(string Id, string DisplayName) : IDomainEvent;

public record PageAvatarImageUpdated(string Id, string AvatarImageUrl) : IDomainEvent;

public record PageReferenceImageUpdated(string Id, string ReferenceImageUrl) : IDomainEvent;

public record ContactAdded(string PageId, string ContactId, string Content) : IDomainEvent;

public record ContactUpdated(string PageId, string ContactId, string Content) : IDomainEvent;

public record ContactRemoved(string PageId, string ContactId) : IDomainEvent;

public record FactAdded(string PageId, string FactId, string Title, string Content) : IDomainEvent;

public record FactUpdated(string PageId, string FactId, string Title, string Content) : IDomainEvent;

public record FactImageUrlUpdated(string PageId, string FactId, string ImageUrl) : IDomainEvent;

public record FactRemoved(string PageId, string FactId) : IDomainEvent;

public record PageStateUpdated(string PageId, PageState State) : IDomainEvent;