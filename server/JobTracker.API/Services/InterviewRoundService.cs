using JobTracker.API.Configs;
using JobTracker.API.DTOs.InterviewRound;
using JobTracker.API.Interfaces;
using JobTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Services;

public class InterviewRoundService : IInterviewRoundService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public InterviewRoundService(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<IEnumerable<InterviewRoundDto>> GetRoundsForApplicationAsync(Guid jobApplicationId)
    {
        var userId = _currentUser.UserId;
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j => j.Id == jobApplicationId && j.UserId == userId);

        if (application is null)
        {
            throw new KeyNotFoundException("Job application not found or access denied.");
        }

        var rounds = await _context.InterviewRounds
            .Where(r => r.JobApplicationId == jobApplicationId)
            .OrderBy(r => r.RoundDate)
            .Select(r => new InterviewRoundDto
            {
                Id = r.Id,
                JobApplicationId = r.JobApplicationId,
                RoundName = r.RoundName,
                RoundDate = r.RoundDate,
                Experience = r.Experience,
                Result = r.Result,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return rounds;
    }

    public async Task<InterviewRoundDto> CreateAsync(Guid jobApplicationId, CreateInterviewRoundDto dto)
    {
        var userId = _currentUser.UserId;
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(j => j.Id == jobApplicationId && j.UserId == userId);

        if (application is null)
        {
            throw new KeyNotFoundException("Job application not found or access denied.");
        }

        var round = new InterviewRound
        {
            JobApplicationId = jobApplicationId,
            RoundName = dto.RoundName.Trim(),
            RoundDate = dto.RoundDate,
            Experience = dto.Experience,
            Result = dto.Result
        };

        _context.InterviewRounds.Add(round);
        await _context.SaveChangesAsync();

        return new InterviewRoundDto
        {
            Id = round.Id,
            JobApplicationId = round.JobApplicationId,
            RoundName = round.RoundName,
            RoundDate = round.RoundDate,
            Experience = round.Experience,
            Result = round.Result,
            CreatedAt = round.CreatedAt
        };
    }

    public async Task<InterviewRoundDto> UpdateAsync(Guid roundId, UpdateInterviewRoundDto dto)
    {
        var userId = _currentUser.UserId;
        var round = await _context.InterviewRounds
            .Include(r => r.JobApplication)
            .FirstOrDefaultAsync(r => r.Id == roundId && r.JobApplication.UserId == userId);

        if (round is null)
        {
            throw new KeyNotFoundException("Interview round not found or access denied.");
        }

        round.RoundName = dto.RoundName.Trim();
        round.RoundDate = dto.RoundDate;
        round.Experience = dto.Experience;
        round.Result = dto.Result;
        round.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new InterviewRoundDto
        {
            Id = round.Id,
            JobApplicationId = round.JobApplicationId,
            RoundName = round.RoundName,
            RoundDate = round.RoundDate,
            Experience = round.Experience,
            Result = round.Result,
            CreatedAt = round.CreatedAt
        };
    }

    public async Task DeleteAsync(Guid roundId)
    {
        var userId = _currentUser.UserId;
        var round = await _context.InterviewRounds
            .Include(r => r.JobApplication)
            .FirstOrDefaultAsync(r => r.Id == roundId && r.JobApplication.UserId == userId);

        if (round is null)
        {
            throw new KeyNotFoundException("Interview round not found or access denied.");
        }

        _context.InterviewRounds.Remove(round);
        await _context.SaveChangesAsync();
    }
}
