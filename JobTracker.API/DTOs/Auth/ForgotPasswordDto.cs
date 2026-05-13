using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.DTOs.Auth;

public class ForgotPasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}