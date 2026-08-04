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

    private async Task<Guid> GetEffectiveUserIdAsync()
    {
        var userId = _currentUserService.UserId;
        if (userId.HasValue && userId.Value != Guid.Empty)
        {
            var exists = await _context.Users.AnyAsync(u => u.Id == userId.Value);
            if (exists) return userId.Value;
        }

        var firstUser = await _context.Users.FirstOrDefaultAsync();
        if (firstUser != null)
        {
            return firstUser.Id;
        }

        // Seed generic demo user if none exists in database
        var defaultUser = new User
        {
            UserName = "demo@jobtracker.dev",
            NormalizedUserName = "DEMO@JOBTRACKER.DEV",
            Email = "demo@jobtracker.dev",
            NormalizedEmail = "DEMO@JOBTRACKER.DEV",
            Name = "Demo User",
            SecurityStamp = Guid.NewGuid().ToString()
        };
        _context.Users.Add(defaultUser);
        await _context.SaveChangesAsync();

        return defaultUser.Id;
    }

    public async Task<UserProfileDto> GetProfileAsync()
    {
        var userId = await GetEffectiveUserIdAsync();
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile is null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            profile = new UserProfile
            {
                UserId = userId,
                NameEnglish = user?.Name ?? "Software Engineer",
                Email = user?.Email ?? "user@example.com",
                Nationality = "Bangladeshi",
                Religion = "Islam",
                Gender = "Male",
                MaritalStatus = "Single",
                BioSummary = "Full Stack Engineer passionate about building modern web applications, scalable APIs, and developer productivity tools.",
            };

            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();
        }

        return MapToDto(profile);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(UserProfileDto dto)
    {
        var userId = await GetEffectiveUserIdAsync();
        var profile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile is null)
        {
            profile = new UserProfile { UserId = userId };
            _context.UserProfiles.Add(profile);
        }

        profile.NameEnglish = dto.NameEnglish ?? string.Empty;
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

        profile.PresentDivision = dto.PresentDivision;
        profile.PresentDistrict = dto.PresentDistrict;
        profile.PresentArea = dto.PresentArea;
        profile.PresentLocation = dto.PresentLocation;
        profile.PresentHouse = dto.PresentHouse;
        profile.PresentUpazila = dto.PresentUpazila;
        profile.PresentPoliceStation = dto.PresentPoliceStation;
        profile.PresentPostOffice = dto.PresentPostOffice;
        profile.PresentPostCode = dto.PresentPostCode;

        profile.PermanentDivision = dto.PermanentDivision;
        profile.PermanentDistrict = dto.PermanentDistrict;
        profile.PermanentUpazila = dto.PermanentUpazila;
        profile.PermanentUnion = dto.PermanentUnion;
        profile.PermanentVillage = dto.PermanentVillage;
        profile.PermanentPostOffice = dto.PermanentPostOffice;
        profile.PermanentPoliceStation = dto.PermanentPoliceStation;
        profile.PermanentPostCode = dto.PermanentPostCode;

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

        PresentDivision = profile.PresentDivision,
        PresentDistrict = profile.PresentDistrict,
        PresentArea = profile.PresentArea,
        PresentLocation = profile.PresentLocation,
        PresentHouse = profile.PresentHouse,
        PresentUpazila = profile.PresentUpazila,
        PresentPoliceStation = profile.PresentPoliceStation,
        PresentPostOffice = profile.PresentPostOffice,
        PresentPostCode = profile.PresentPostCode,

        PermanentDivision = profile.PermanentDivision,
        PermanentDistrict = profile.PermanentDistrict,
        PermanentUpazila = profile.PermanentUpazila,
        PermanentUnion = profile.PermanentUnion,
        PermanentVillage = profile.PermanentVillage,
        PermanentPostOffice = profile.PermanentPostOffice,
        PermanentPoliceStation = profile.PermanentPoliceStation,
        PermanentPostCode = profile.PermanentPostCode,

        PresentAddress = profile.PresentAddress,
        PermanentAddress = profile.PermanentAddress,
        BioSummary = profile.BioSummary,
        EducationDetailsJson = profile.EducationDetailsJson,
        CodingProfilesJson = profile.CodingProfilesJson,
    };
}
