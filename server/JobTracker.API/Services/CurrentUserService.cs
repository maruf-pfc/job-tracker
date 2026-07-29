using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using JobTracker.API.Interfaces;

namespace JobTracker.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId
    { 
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user is null) return null;

            var userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
                         ?? user.FindFirstValue("sub");

            return string.IsNullOrEmpty(userIdStr) ? null : Guid.Parse(userIdStr);
        }
    }
}