using JobTracker.API.Common;
using JobTracker.API.DTOs.InterviewRound;
using JobTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobTracker.API.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class InterviewRoundsController : ControllerBase
{
    private readonly IInterviewRoundService _roundService;

    public InterviewRoundsController(IInterviewRoundService roundService)
    {
        _roundService = roundService;
    }

    [HttpGet("jobapplications/{jobApplicationId}/rounds")]
    public async Task<ActionResult<ApiResponse<IEnumerable<InterviewRoundDto>>>> GetRoundsForApplication(Guid jobApplicationId, CancellationToken cancellationToken)
    {
        var rounds = await _roundService.GetRoundsForApplicationAsync(jobApplicationId, cancellationToken);
        return Ok(ApiResponse<IEnumerable<InterviewRoundDto>>.SuccessResponse(rounds));
    }

    [HttpPost("jobapplications/{jobApplicationId}/rounds")]
    public async Task<ActionResult<ApiResponse<InterviewRoundDto>>> Create(Guid jobApplicationId, [FromBody] CreateInterviewRoundDto dto, CancellationToken cancellationToken)
    {
        var round = await _roundService.CreateAsync(jobApplicationId, dto, cancellationToken);
        return CreatedAtAction(nameof(GetRoundsForApplication), new { jobApplicationId }, ApiResponse<InterviewRoundDto>.SuccessResponse(round, "Interview round added successfully"));
    }

    [HttpPut("rounds/{roundId}")]
    public async Task<ActionResult<ApiResponse<InterviewRoundDto>>> Update(Guid roundId, [FromBody] UpdateInterviewRoundDto dto, CancellationToken cancellationToken)
    {
        var round = await _roundService.UpdateAsync(roundId, dto, cancellationToken);
        return Ok(ApiResponse<InterviewRoundDto>.SuccessResponse(round, "Interview round updated successfully"));
    }

    [HttpDelete("rounds/{roundId}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(Guid roundId, CancellationToken cancellationToken)
    {
        await _roundService.DeleteAsync(roundId, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(null, "Interview round deleted successfully"));
    }
}
