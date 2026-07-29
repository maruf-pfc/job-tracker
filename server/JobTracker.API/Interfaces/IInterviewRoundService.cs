using JobTracker.API.DTOs.InterviewRound;

namespace JobTracker.API.Interfaces;

public interface IInterviewRoundService
{
    Task<IEnumerable<InterviewRoundDto>> GetRoundsForApplicationAsync(Guid jobApplicationId);
    Task<InterviewRoundDto> CreateAsync(Guid jobApplicationId, CreateInterviewRoundDto dto);
    Task<InterviewRoundDto> UpdateAsync(Guid roundId, UpdateInterviewRoundDto dto);
    Task DeleteAsync(Guid roundId);
}
