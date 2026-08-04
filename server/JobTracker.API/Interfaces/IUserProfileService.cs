using JobTracker.API.DTOs.Profile;

namespace JobTracker.API.Interfaces;

public interface IUserProfileService
{
    Task<UserProfileDto> GetProfileAsync();
    Task<UserProfileDto> UpdateProfileAsync(UserProfileDto dto);
}
