# MovieReview.Api

ASP.NET Core microservice for the standard movie review API surface.

The service listens on `http://localhost:5000` in development and proxies regular movie, comment, sentiment, category, rating, and search requests to the existing data API configured by `Services:DataApi` in `appsettings.json`.

AI prediction endpoints are intentionally not proxied here. The frontend calls the FastAPI AI service directly at `NEXT_PUBLIC_AI_API_BASE_URL` for `/predict`.

## Run

```powershell
dotnet run --project MovieReview.Api
```

Default service mapping:

- ASP.NET standard API: `http://127.0.0.1:5000`
- FastAPI data API: `http://127.0.0.1:8000`
- FastAPI AI API: `http://127.0.0.1:8001`
