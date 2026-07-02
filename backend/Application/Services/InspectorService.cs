using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Backend.Application.DTOs.UserManagement;
using Backend.Application.Interfaces;
using Backend.Domain.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services;

/// <summary>
/// Service implementation for inspector management operations (enrichment for admin users list)
/// </summary>
public class InspectorService : IInspectorService
{
    private readonly IApplicationDbContext _context;

    public InspectorService(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Enriches inspector user records with profile information and aggregate statistics.
    /// Uses batching/projection to avoid N+1 query problem.
    /// </summary>
    public async Task<List<UserManagementDto>> EnrichInspectorsAsync(
        List<UserManagementDto> users,
        CancellationToken cancellationToken = default)
    {
        if (users == null || users.Count == 0)
        {
            return users ?? new List<UserManagementDto>();
        }

        var userIds = users.Select(u => u.Id).ToList();

        // Batch query Inspector Profiles for EmployeeCode and Availability
        var profiles = await _context.Inspectors
            .Where(i => userIds.Contains(i.UserId))
            .Select(i => new
            {
                i.UserId,
                i.EmployeeCode,
                i.IsAvailable
            })
            .ToDictionaryAsync(i => i.UserId, cancellationToken);

        // Batch query VehicleInspections for counts
        var inspectionsStats = await _context.VehicleInspections
            .Where(vi => vi.InspectorId != null && userIds.Contains(vi.InspectorId.Value))
            .GroupBy(vi => vi.InspectorId!.Value)
            .Select(g => new
            {
                InspectorId = g.Key,
                AssignedCount = g.Count(),
                CompletedCount = g.Count(vi => vi.Status == InspectionStatus.Approved || vi.Status == InspectionStatus.Rejected || vi.IsSubmitted)
            })
            .ToDictionaryAsync(x => x.InspectorId, cancellationToken);

        var enrichedUsers = new List<UserManagementDto>();

        foreach (var user in users)
        {
            profiles.TryGetValue(user.Id, out var profile);
            inspectionsStats.TryGetValue(user.Id, out var stats);

            var inspectorDetails = new InspectorDetailsDto(
                EmployeeCode: profile?.EmployeeCode,
                AssignedInspections: stats?.AssignedCount ?? 0,
                CompletedInspections: stats?.CompletedCount ?? 0,
                Availability: (profile?.IsAvailable ?? false) ? "Available" : "Unavailable"
            );

            enrichedUsers.Add(user with { InspectorDetails = inspectorDetails });
        }

        return enrichedUsers;
    }

    public async Task UpdateInspectorProfileAsync(
        Guid userId,
        string? employeeCode,
        string? availability,
        CancellationToken cancellationToken = default)
    {
        var inspector = await _context.Inspectors
            .FirstOrDefaultAsync(i => i.UserId == userId, cancellationToken);

        if (inspector != null)
        {
            if (employeeCode != null)
            {
                inspector.EmployeeCode = employeeCode;
            }

            if (availability != null)
            {
                inspector.IsAvailable = availability.Equals("Available", StringComparison.OrdinalIgnoreCase);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
