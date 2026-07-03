using System;

namespace Backend.Application.DTOs.UserManagement;

/// <summary>
/// DTO for customer-specific details in user management operations
/// </summary>
public record CustomerDetailsDto(
    int TotalBookings,
    int CompletedBookings,
    int CancelledBookings,
    decimal TotalSpent,
    string? LastBookingDate
);
