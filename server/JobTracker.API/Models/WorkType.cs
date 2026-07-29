namespace JobTracker.API.Models;

public class WorkType : BaseLookupEntity
{
    public ICollection<JobApplication> JobApplications
    = new List<JobApplication>();
}