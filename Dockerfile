# Stage 1: Build Frontend React Client SPA
FROM oven/bun:latest AS client-build
WORKDIR /app/client

COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile

COPY client/ ./
ENV VITE_API_BASE_URL=/api
RUN bun run build

# Stage 2: Build Backend .NET 10 Web API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-build
WORKDIR /src

COPY server/JobTracker.API/JobTracker.API.csproj ./JobTracker.API/
RUN dotnet restore "./JobTracker.API/JobTracker.API.csproj"

COPY server/JobTracker.API/ ./JobTracker.API/
WORKDIR /src/JobTracker.API
RUN dotnet publish "JobTracker.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Full-Stack Container (Frontend SPA + Backend API + Database Client)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=server-build /app/publish .
COPY --from=client-build /app/client/dist ./wwwroot

ENTRYPOINT ["dotnet", "JobTracker.API.dll"]
