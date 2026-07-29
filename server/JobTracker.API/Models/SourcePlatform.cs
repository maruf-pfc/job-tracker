namespace JobTracker.API.Models;

public class SourcePlatform : BaseLookupEntity
{
    public ICollection<JobApplication> JobApplications
    = new List<JobApplication>();
}