using JobTracker.API.DTOs.Company;

namespace JobTracker.API.Interfaces;

public interface ICompanyService
{
    Task<List<CompanyDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CompanyDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CompanyDto> CreateAsync(CreateCompanyDto dto, CancellationToken cancellationToken = default);
    Task<CompanyDto?> UpdateAsync(Guid id, CreateCompanyDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}