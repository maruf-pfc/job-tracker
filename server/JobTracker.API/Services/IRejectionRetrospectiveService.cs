using JobTracker.API.DTOs.Rejection;

namespace JobTracker.API.Services;

public interface IRejectionRetrospectiveService
{
    Task<RejectionRetrospectiveResponseDto> UpsertRetrospectiveAsync(Guid applicationId, CreateRejectionRetrospectiveDto dto);
    Task<RejectionRetrospectiveResponseDto?> GetByApplicationIdAsync(Guid applicationId);
    Task<FailureAnalyticsDto> GetFailureAnalyticsAsync();
}
