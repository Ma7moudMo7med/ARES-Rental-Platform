using System;

namespace Backend.Application.DTOs.UserManagement;

/// <summary>
/// DTO for inspector-specific details in user management operations
/// </summary>
public record InspectorDetailsDto(
    string? EmployeeCode,
    int AssignedInspections,
    int CompletedInspections,
    string? Availability
);
