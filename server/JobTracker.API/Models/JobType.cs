namespace JobTracker.API.Models;

public class JobType : BaseLookupEntity
{
    public ICollection<JobApplication> JobApplications
    = new List<JobApplication>();
}