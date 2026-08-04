using JobTracker.API.Configs;
using JobTracker.API.DTOs.Profile;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class UserProfileService : IUserProfileService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UserProfileService(AppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<UserProfileDto> GetProfileAsync()
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile is null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            profile = new UserProfile
            {
                UserId = userId,
                NameEnglish = "Demo User",
                NameBangla = "",
                FatherName = "",
                MotherName = "",
                DateOfBirth = new DateTime(2003, 8, 19),
                Nationality = "Bangladeshi",
                Religion = "Islam",
                Gender = "Male",
                BirthRegistration = "",
                NationalId = "",
                MaritalStatus = "Single",
                MobileNumber = "",
                Email = user?.Email ?? "demo@jobtracker.dev",
                PresentAddress = " (House 176/7), Ward 22, Hatirjheel, Khilgaon, Dhaka - 1219",
                PermanentAddress = ", , , , Cumilla - 3544",
                BioSummary = "Full Stack Developer and competitive programmer with hands-on experience building web applications and AI-powered automation tools for real-world business operations.",
            };

            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();
        }

        return MapToDto(profile);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(UserProfileDto dto)
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile is null)
        {
            profile = new UserProfile { UserId = userId };
            _context.UserProfiles.Add(profile);
        }

        profile.NameEnglish = dto.NameEnglish;
        profile.NameBangla = dto.NameBangla;
        profile.FatherName = dto.FatherName;
        profile.MotherName = dto.MotherName;
        profile.DateOfBirth = dto.DateOfBirth;
        profile.Nationality = dto.Nationality;
        profile.Religion = dto.Religion;
        profile.Gender = dto.Gender;
        profile.BirthRegistration = dto.BirthRegistration;
        profile.NationalId = dto.NationalId;
        profile.MaritalStatus = dto.MaritalStatus;
        profile.MobileNumber = dto.MobileNumber;
        profile.Email = dto.Email;
        profile.PresentAddress = dto.PresentAddress;
        profile.PermanentAddress = dto.PermanentAddress;
        profile.BioSummary = dto.BioSummary;
        profile.EducationDetailsJson = dto.EducationDetailsJson;
        profile.CodingProfilesJson = dto.CodingProfilesJson;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(profile);
    }

    private static UserProfileDto MapToDto(UserProfile profile) => new()
    {
        Id = profile.Id,
        UserId = profile.UserId,
        NameEnglish = profile.NameEnglish,
        NameBangla = profile.NameBangla,
        FatherName = profile.FatherName,
        MotherName = profile.MotherName,
        DateOfBirth = profile.DateOfBirth,
        Nationality = profile.Nationality,
        Religion = profile.Religion,
        Gender = profile.Gender,
        BirthRegistration = profile.BirthRegistration,
        NationalId = profile.NationalId,
        MaritalStatus = profile.MaritalStatus,
        MobileNumber = profile.MobileNumber,
        Email = profile.Email,
        PresentAddress = profile.PresentAddress,
        PermanentAddress = profile.PermanentAddress,
        BioSummary = profile.BioSummary,
        EducationDetailsJson = profile.EducationDetailsJson,
        CodingProfilesJson = profile.CodingProfilesJson,
    };
}
