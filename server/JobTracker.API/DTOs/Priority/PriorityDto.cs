namespace JobTracker.API.DTOs.Priority;

public class PriorityDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}