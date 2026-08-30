using JobTracker.API.DTOs.Rejection;

namespace JobTracker.API.Interfaces;

public interface IRejectionRetrospectiveService
{
    Task<RejectionRetrospectiveResponseDto> UpsertRetrospectiveAsync(Guid applicationId, CreateRejectionRetrospectiveDto dto, CancellationToken cancellationToken = default);
    Task<RejectionRetrospectiveResponseDto?> GetByApplicationIdAsync(Guid applicationId, CancellationToken cancellationToken = default);
    Task<FailureAnalyticsDto> GetFailureAnalyticsAsync(CancellationToken cancellationToken = default);
}
