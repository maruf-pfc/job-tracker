using JobTracker.API.Common;
using JobTracker.API.DTOs.Profile;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IUserProfileService _profileService;

    public ProfileController(IUserProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        var result = await _profileService.GetProfileAsync(cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Profile loaded successfully"));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDto dto, CancellationToken cancellationToken)
    {
        var result = await _profileService.UpdateProfileAsync(dto, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(result, "Profile updated successfully"));
    }
}
