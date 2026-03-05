namespace server.Models;

public enum WorkType { Onsite, Remote, Hybrid }

public enum JobType { FullTime, PartTime, Internship, Contract, Freelance }

public enum SourcePlatform { LinkedIn, Facebook, BdJobs, CompanySite, Referral, Other }

public enum ApplicationMethod { Email, Form, LinkedInEasyApply, Referral, Other }

public enum JobStatus { Saved, Applied, Screening, Interview, Offer, Rejected, Ghosted, Withdrawn }

public enum Priority { High, Medium, Low }

public enum InterviewType { Phone, Video, Onsite, TakeHomeTask, HR, Technical, SystemDesign }

public enum InterviewOutcome { Pass, Fail, Waiting, Cancelled }
