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
/// Service implementation for customer management operations (enrichment for admin users list)
/// </summary>
public class CustomerService : ICustomerService
{
    private readonly IApplicationDbContext _context;

    public CustomerService(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Enriches customer user records with aggregate statistics.
    /// Uses batching/projection to avoid N+1 query problem.
    /// </summary>
    public async Task<List<UserManagementDto>> EnrichCustomersAsync(
        List<UserManagementDto> users,
        CancellationToken cancellationToken = default)
    {
        if (users == null || users.Count == 0)
        {
            return users ?? new List<UserManagementDto>();
        }

        var userIds = users.Select(u => u.Id).ToList();

        // Batch query Bookings for total counts and spend
        var customerStats = await _context.Bookings
            .Where(b => userIds.Contains(b.UserId))
            .GroupBy(b => b.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                TotalBookings = g.Count(),
                CompletedBookings = g.Count(b => b.Status == BookingStatus.Completed),
                CancelledBookings = g.Count(b => b.Status == BookingStatus.Cancelled || b.Status == BookingStatus.CancelledByAdmin),
                TotalSpent = g.Where(b => b.Status == BookingStatus.Completed).Sum(b => b.GrandTotal ?? b.TotalPrice ?? 0),
                LastBookingDate = g.Max(b => (DateTime?)b.CreatedAt)
            })
            .ToDictionaryAsync(x => x.UserId, cancellationToken);

        var enrichedUsers = new List<UserManagementDto>();

        foreach (var user in users)
        {
            customerStats.TryGetValue(user.Id, out var stats);

            var customerDetails = new CustomerDetailsDto(
                TotalBookings: stats?.TotalBookings ?? 0,
                CompletedBookings: stats?.CompletedBookings ?? 0,
                CancelledBookings: stats?.CancelledBookings ?? 0,
                TotalSpent: stats?.TotalSpent ?? 0,
                LastBookingDate: stats?.LastBookingDate?.ToString("yyyy-MM-dd")
            );

            enrichedUsers.Add(user with { CustomerDetails = customerDetails });
        }

        return enrichedUsers;
    }
}
