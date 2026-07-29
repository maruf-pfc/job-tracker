using JobTracker.API.DTOs.Company;

namespace JobTracker.API.Interfaces;

public interface ICompanyService
{
    Task<List<CompanyDto>> GetAllAsync();
    Task<CompanyDto?> GetByIdAsync(Guid id);
    Task<CompanyDto> CreateAsync(CreateCompanyDto dto);
    Task<CompanyDto?> UpdateAsync(Guid id, CreateCompanyDto dto);
    Task<bool> DeleteAsync(Guid id);
}