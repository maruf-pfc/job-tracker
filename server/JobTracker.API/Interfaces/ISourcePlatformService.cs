using JobTracker.API.DTOs.SourcePlatform;

namespace JobTracker.API.Interfaces;

public interface ISourcePlatformService
{
    Task<List<SourcePlatformDto>> GetAllAsync();
    Task<SourcePlatformDto> CreateAsync(CreateSourcePlatformDto dto);
    Task<bool>
    DeleteAsync(Guid id);
}