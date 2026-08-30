using JobTracker.API.DTOs.SourcePlatform;

namespace JobTracker.API.Interfaces;

public interface ISourcePlatformService
{
    Task<List<SourcePlatformDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<SourcePlatformDto> CreateAsync(CreateSourcePlatformDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}