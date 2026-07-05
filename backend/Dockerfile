FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY AestheticTechStore.sln ./
COPY AestheticTechStore.Api/AestheticTechStore.Api.csproj AestheticTechStore.Api/
COPY AestheticTechStore.Application/AestheticTechStore.Application.csproj AestheticTechStore.Application/
COPY AestheticTechStore.Domain/AestheticTechStore.Domain.csproj AestheticTechStore.Domain/
COPY AestheticTechStore.Infrastructure/AestheticTechStore.Infrastructure.csproj AestheticTechStore.Infrastructure/

RUN dotnet restore AestheticTechStore.Api/AestheticTechStore.Api.csproj

COPY . .
WORKDIR /src/AestheticTechStore.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AestheticTechStore.Api.dll"]