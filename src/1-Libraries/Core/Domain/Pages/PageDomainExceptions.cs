// Copyright (c) CodeBlock.Dev. All rights reserved.
// For more information visit https://codeblock.dev

using CodeBlock.DevKit.Core.Exceptions;
using CodeBlock.DevKit.Core.Resources;
using CodeBlock.DevKit.Domain.Exceptions;
using HeyItIsMe.Core.Resources;

namespace HeyItIsMe.Core.Domain.Pages;

/// <summary>
/// Static factory class for creating domain-specific exceptions related to Page entities and their
/// child entities (Contact, Fact). This class demonstrates how to implement domain exception factories
/// that provide localized error messages with proper resource management.
///
/// Key features demonstrated:
/// - Centralized exception creation with consistent error messages
/// - Localized error messages using resource files
/// - Domain-specific exception types for different validation failures
/// - Proper use of message placeholders for dynamic content
/// - Exceptions for both aggregate root (Page) and child entities (Contact, Fact)
/// </summary>
internal static class PageDomainExceptions
{
    /// <summary>
    /// Creates a domain exception when the Page route is missing or invalid.
    /// This exception is thrown when business rules require a valid route but none is provided.
    /// </summary>
    /// <returns>A domain exception with localized error message for missing route</returns>
    public static DomainException RouteIsRequired()
    {
        return new DomainException(
            nameof(CoreResource.Required),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Page_Route, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when a Route contains invalid characters.
    /// </summary>
    /// <returns>Domain exception with localized error message</returns>
    internal static DomainException RouteMustContainOnlyAlphanumericAndUnderscore()
    {
        return new DomainException(nameof(SharedResource.RouteMustContainOnlyAlphanumericAndUnderscore), typeof(SharedResource));
    }

    /// <summary>
    /// Creates a domain exception when the Page display name is missing or invalid.
    /// This exception is thrown when business rules require a valid display name but none is provided.
    /// </summary>
    /// <returns>A domain exception with localized error message for missing display name</returns>
    public static DomainException DisplayNameIsRequired()
    {
        return new DomainException(
            nameof(CoreResource.Required),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Page_DisplayName, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when the Page user ID is missing or invalid.
    /// This exception is thrown when business rules require a valid user ID for ownership tracking.
    /// </summary>
    /// <returns>A domain exception with localized error message for missing user ID</returns>
    public static DomainException UserIdIsRequired()
    {
        return new DomainException(
            nameof(CoreResource.Required),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Page_UserId, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when the Contact content is missing or invalid.
    /// This exception is thrown when business rules require valid contact content but none is provided.
    /// </summary>
    /// <returns>A domain exception with localized error message for missing contact content</returns>
    public static DomainException ContactContentIsRequired()
    {
        return new DomainException(
            nameof(CoreResource.Required),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Contact_Content, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when the Fact content is missing or invalid.
    /// This exception is thrown when business rules require valid fact content but none is provided.
    /// </summary>
    /// <returns>A domain exception with localized error message for missing fact content</returns>
    public static DomainException FactContentIsRequired()
    {
        return new DomainException(
            nameof(CoreResource.Required),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Fact_Content, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when the Fact title is missing or invalid.
    /// This exception is thrown when business rules require valid fact title but none is provided.
    /// </summary>
    /// <returns>A domain exception with localized error message for missing fact title</returns>
    public static DomainException FactTitleIsRequired()
    {
        return new DomainException(
            nameof(CoreResource.Required),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Fact_Title, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when attempting to add a contact that already exists.
    /// This exception is thrown when business rules prevent duplicate contacts.
    /// </summary>
    /// <returns>A domain exception with localized error message for duplicate contact</returns>
    public static DomainException ContactAlreadyExists()
    {
        return new DomainException(
            nameof(CoreResource.ALready_Exists),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Contact, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when attempting to add a fact that already exists.
    /// This exception is thrown when business rules prevent duplicate facts.
    /// </summary>
    /// <returns>A domain exception with localized error message for duplicate fact</returns>
    public static DomainException FactAlreadyExists()
    {
        return new DomainException(
            nameof(CoreResource.ALready_Exists),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Fact, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when attempting to remove a contact that doesn't exist.
    /// This exception is thrown when business rules prevent removing non-existent contacts.
    /// </summary>
    /// <returns>A domain exception with localized error message for contact not found</returns>
    public static DomainException ContactNotFound()
    {
        return new DomainException(
            nameof(CoreResource.Not_Found),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Contact, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when attempting to remove a fact that doesn't exist.
    /// This exception is thrown when business rules prevent removing non-existent facts.
    /// </summary>
    /// <returns>A domain exception with localized error message for fact not found</returns>
    public static DomainException FactNotFound()
    {
        return new DomainException(
            nameof(CoreResource.Not_Found),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Fact, typeof(SharedResource)) }
        );
    }

    /// <summary>
    /// Creates a domain exception when attempting to use a route that is already in use.
    /// This exception is thrown when business rules require unique routes but a duplicate is provided.
    /// </summary>
    /// <returns>A domain exception with localized error message for duplicate route</returns>
    public static DomainException RouteAlreadyExists()
    {
        return new DomainException(
            nameof(CoreResource.ALready_Exists),
            typeof(CoreResource),
            new List<MessagePlaceholder> { MessagePlaceholder.CreateResource(SharedResource.Page_Route, typeof(SharedResource)) }
        );
    }
}
