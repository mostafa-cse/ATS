# বিল্ড করার জন্য .NET SDK ইমেজ
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# প্রজেক্টের ফাইলগুলো কপি করা এবং বিল্ড করা
COPY . .
RUN dotnet restore "AestheticTechStore.Api/AestheticTechStore.Api.csproj"
RUN dotnet publish "AestheticTechStore.Api/AestheticTechStore.Api.csproj" -c Release -o /app/publish

# রানটাইম ইমেজ তৈরি করা
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# পোর্ট এক্সপোজ করা এবং অ্যাপ চালু করা
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "AestheticTechStore.Api.dll"]