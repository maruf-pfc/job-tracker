using JobTracker.API.DTOs.Profile;

namespace JobTracker.API.Interfaces;

public interface IUserProfileService
{
    Task<UserProfileDto> GetProfileAsync(CancellationToken cancellationToken = default);
    Task<UserProfileDto> UpdateProfileAsync(UserProfileDto dto, CancellationToken cancellationToken = default);
}
