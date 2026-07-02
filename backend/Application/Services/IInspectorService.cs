using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Backend.Application.DTOs.UserManagement;

namespace Backend.Application.Services;

/// <summary>
/// Service interface for inspector management operations (admin functionality)
/// </summary>
public interface IInspectorService
{
    /// <summary>
    /// Enriches inspector user records with aggregate statistics.
    /// </summary>
    Task<List<UserManagementDto>> EnrichInspectorsAsync(
        List<UserManagementDto> users,
        CancellationToken cancellationToken = default);
}
