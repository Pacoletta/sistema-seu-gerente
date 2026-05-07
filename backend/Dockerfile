# ==================================
# Build Stage
# ==================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies (better caching)
COPY src/SeuGerente.Domain/SeuGerente.Domain.csproj ./src/SeuGerente.Domain/
COPY src/SeuGerente.Application/SeuGerente.Application.csproj ./src/SeuGerente.Application/
COPY src/SeuGerente.Infrastructure/SeuGerente.Infrastructure.csproj ./src/SeuGerente.Infrastructure/
COPY src/SeuGerente.Service/SeuGerente.Service.csproj ./src/SeuGerente.Service/
COPY src/SeuGerente.Api/SeuGerente.Api.csproj ./src/SeuGerente.Api/

# Restore dependencies
RUN dotnet restore ./src/SeuGerente.Api/SeuGerente.Api.csproj

# Copy the rest of the source code
COPY src/ ./src/

# Build and publish
WORKDIR /src/src/SeuGerente.Api
RUN dotnet publish -c Release -o /app/publish --no-restore

# ==================================
# Runtime Stage
# ==================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Create non-root user for security
RUN useradd -m -u 1001 -s /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 5000

# Start the application
CMD ["dotnet", "SeuGerente.Api.dll"]
