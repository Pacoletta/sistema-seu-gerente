namespace SeuGerente.Application.Interfaces;

public interface IStorageService
{
    Task<string> UploadTemporaryFileAsync(byte[] fileBytes, string fileName, string bucket = "temp-whatsapp", CancellationToken cancellationToken = default);

    Task<bool> DeleteFileAsync(string fileName, string bucket = "temp-whatsapp", CancellationToken cancellationToken = default);

    Task ScheduleFileDeletionAsync(string fileName, string bucket, TimeSpan delay, CancellationToken cancellationToken = default);

    /// <summary>
    /// Upload com caminho de objeto completo (ex: "comprovantes-despesas/userId/file.jpg")
    /// </summary>
    Task<string> UploadFileAsync(byte[] fileBytes, string objectPath, string contentType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete pelo caminho de objeto completo
    /// </summary>
    Task<bool> DeleteObjectAsync(string objectPath, CancellationToken cancellationToken = default);
}
