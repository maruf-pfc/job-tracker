namespace JobTracker.API.Models;

public class ApplicationStatus : BaseLookupEntity
{
    public ICollection<JobApplication> JobApplications
    = new List<JobApplication>();
}