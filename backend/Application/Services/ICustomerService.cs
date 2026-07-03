using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Backend.Application.DTOs.UserManagement;

namespace Backend.Application.Services;

/// <summary>
/// Service interface for customer management operations (admin functionality)
/// </summary>
public interface ICustomerService
{
    /// <summary>
    /// Enriches customer user records with aggregate statistics.
    /// </summary>
    Task<List<UserManagementDto>> EnrichCustomersAsync(
        List<UserManagementDto> users,
        CancellationToken cancellationToken = default);
}
