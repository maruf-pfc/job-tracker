namespace JobTracker.API.Models;

public class Priority : BaseLookupEntity
{
    public ICollection<JobApplication> JobApplications
    = new List<JobApplication>();
}