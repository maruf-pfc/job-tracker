using JobTracker.API.DTOs.InterviewRound;

namespace JobTracker.API.Interfaces;

public interface IInterviewRoundService
{
    Task<IEnumerable<InterviewRoundDto>> GetRoundsForApplicationAsync(Guid jobApplicationId, CancellationToken cancellationToken = default);
    Task<InterviewRoundDto> CreateAsync(Guid jobApplicationId, CreateInterviewRoundDto dto, CancellationToken cancellationToken = default);
    Task<InterviewRoundDto> UpdateAsync(Guid roundId, UpdateInterviewRoundDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid roundId, CancellationToken cancellationToken = default);
}
