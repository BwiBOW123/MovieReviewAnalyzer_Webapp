using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        if (origins.Length == 0)
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            policy.WithOrigins(origins);
        }

        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();

var store = new MovieStore();

app.MapGet("/", () => Results.Ok(new { msg = "MovieReview ASP.NET data API" }));

app.MapGet("/movies", () => Results.Ok(new { data = store.GetMovies() }));

app.MapGet("/movies/{movieId:int}", (int movieId) =>
{
    var movie = store.GetMovie(movieId);
    return movie.Count > 0
        ? Results.Ok(new { data = movie })
        : Results.NotFound(new { detail = "Movie not found" });
});

app.MapGet("/Category/{category}/{limit:int}", (string category, int limit) =>
    Results.Ok(new { data = store.GetMoviesByCategory(category, limit) }));

app.MapGet("/Rating/{limit:int}", (int limit) =>
    Results.Ok(new { data = store.GetMoviesByRating(limit) }));

app.MapGet("/comment/{movieId:int}", (int movieId) =>
    Results.Ok(new { data = store.GetComments(movieId) }));

app.MapPost("/comment", async (HttpRequest request) =>
{
    if (!request.HasFormContentType)
    {
        return Results.BadRequest(new { detail = "Expected multipart form data" });
    }

    var form = await request.ReadFormAsync();
    var file = form.Files["cmt_data"];
    if (file is null)
    {
        return Results.BadRequest(new { detail = "Missing cmt_data file" });
    }

    await using var stream = file.OpenReadStream();
    using var document = await JsonDocument.ParseAsync(stream);
    var root = document.RootElement;
    var text = root.GetProperty("cmt_text").GetString();
    var movieId = GetRequiredInt(root.GetProperty("m_id"));

    if (string.IsNullOrWhiteSpace(text))
    {
        return Results.BadRequest(new { detail = "Comment text is required" });
    }

    store.AddComment(movieId, text);
    return Results.Ok(new { msg = "Create Success" });
});

app.MapGet("/sentiment/{movieId:int}", (int movieId) =>
    Results.Ok(new { data = store.GetSentiment(movieId) }));

app.MapPost("/sentiment", async (HttpRequest request) =>
{
    if (!request.HasFormContentType)
    {
        return Results.BadRequest(new { detail = "Expected multipart form data" });
    }

    var form = await request.ReadFormAsync();
    var file = form.Files["s_data"];
    if (file is null)
    {
        return Results.BadRequest(new { detail = "Missing s_data file" });
    }

    await using var stream = file.OpenReadStream();
    using var document = await JsonDocument.ParseAsync(stream);
    var root = document.RootElement;
    store.SetSentiment(
        GetRequiredInt(root.GetProperty("m_id")),
        GetRequiredInt(root.GetProperty("positive")),
        GetRequiredInt(root.GetProperty("negative")));

    return Results.Ok(new { msg = "Create Success" });
});

app.MapGet("/search/{movieName}", (string movieName) =>
{
    var movies = store.SearchMovies(movieName);
    return movies.Count > 0
        ? Results.Ok(new { data = movies })
        : Results.NotFound(new { detail = "Movie not found" });
});

app.MapGet("/search_by_sort/{sortBy}/{way:int}/{limit:int}", (string sortBy, int way, int limit) =>
    Results.Ok(new { data = store.GetTopMoviesBy(sortBy, way, limit) }));

app.Run();

static int GetRequiredInt(JsonElement element) => element.ValueKind switch
{
    JsonValueKind.Number => element.GetInt32(),
    JsonValueKind.String when int.TryParse(element.GetString(), out var value) => value,
    _ => throw new BadHttpRequestException("Expected an integer value")
};

internal sealed class MovieStore
{
    private const string MockImage =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lcWv9wAAAABJRU5ErkJggg==";

    private readonly List<Dictionary<string, object?>> movies =
    [
        Movie(1, "The Midnight Archive", 128, 8.7, 2024, 91, ["Mystery", "Sci-Fi"], "Maya Chen",
            ["Jon Patel", "Maya Chen"], ["Ari Stone", "Lena Voss", "Niko Reed"],
            "A film restorer discovers that old reels contain memories from people who vanished decades ago."),
        Movie(2, "Harbor Lights", 112, 7.9, 2023, 84, ["Drama"], "Elena Morris",
            ["Sam Rivera"], ["Mina Hart", "Cole Bennett"],
            "Two estranged siblings return to their coastal hometown and reopen their father's cinema."),
        Movie(3, "Orbit Cafe", 96, 8.2, 2025, 76, ["Comedy", "Sci-Fi"], "Theo Grant",
            ["Iris Novak", "Theo Grant"], ["June Park", "Marco Hale"],
            "A cook on a lunar station tries to keep morale alive while supplies and patience run low."),
        Movie(4, "Red Line Chase", 105, 7.4, 2022, 63, ["Action", "Thriller"], "Rafael Knox",
            ["Dana Blake"], ["Tess Morgan", "Ivan Cross"],
            "A transit detective tracks a coded ransom note across one night on the city train system."),
        Movie(5, "Paper Moons", 121, 8.9, 2024, 94, ["Fantasy", "Drama"], "Nora Ellis",
            ["Nora Ellis", "Kai Lin"], ["Ada Wells", "Felix Moon"],
            "A young illustrator creates a fantasy world that starts answering back.")
    ];

    private readonly Dictionary<int, List<Dictionary<string, object?>>> comments = new()
    {
        [1] =
        [
            Comment(1, "Smart mystery with a great final reveal.", "2026-04-29T10:15:00Z"),
            Comment(2, "The atmosphere and sound design were excellent.", "2026-04-29T11:40:00Z")
        ],
        [2] = [Comment(3, "Quiet, emotional, and beautifully acted.", "2026-04-28T09:30:00Z")],
        [3] = [Comment(4, "Funny without losing the science fiction angle.", "2026-04-27T15:20:00Z")],
        [4] = [Comment(5, "Good pace, but the ending felt rushed.", "2026-04-26T18:10:00Z")],
        [5] = [Comment(6, "Beautiful visuals and a strong emotional core.", "2026-04-25T20:45:00Z")]
    };

    private readonly Dictionary<int, Dictionary<string, object?>> sentiments = new()
    {
        [1] = Sentiment(1, 46, 5),
        [2] = Sentiment(2, 32, 6),
        [3] = Sentiment(3, 25, 8),
        [4] = Sentiment(4, 19, 11),
        [5] = Sentiment(5, 58, 4)
    };

    public List<Dictionary<string, object?>> GetMovies() => movies.Select(Clone).ToList();

    public List<Dictionary<string, object?>> GetMovie(int movieId) =>
        movies.Where(movie => (int)movie["id"]! == movieId).Select(Clone).ToList();

    public List<Dictionary<string, object?>> GetMoviesByCategory(string category, int limit)
    {
        var filtered = movies
            .Where(movie => ((string[])movie["Tag"]!).Any(tag => tag.Equals(category, StringComparison.OrdinalIgnoreCase)))
            .OrderByDescending(movie => (int)movie["sentiment"]!)
            .Take(limit)
            .Select(Clone)
            .ToList();

        return filtered.Count > 0 ? filtered : GetMovies().Take(limit).ToList();
    }

    public List<Dictionary<string, object?>> GetMoviesByRating(int limit) =>
        movies.OrderByDescending(movie => Convert.ToDouble(movie["rating"]))
            .Take(limit)
            .Select(Clone)
            .ToList();

    public List<List<Dictionary<string, object?>>> SearchMovies(string movieName) =>
        movies.Where(movie => ((string)movie["m_name"]!).Contains(movieName, StringComparison.OrdinalIgnoreCase))
            .Take(4)
            .Select(movie => new List<Dictionary<string, object?>> { Clone(movie) })
            .ToList();

    public List<List<Dictionary<string, object?>>> GetTopMoviesBy(string sortBy, int way, int limit)
    {
        Func<Dictionary<string, object?>, double> key = sortBy.ToLowerInvariant() switch
        {
            "sentiment" => movie => Convert.ToDouble(movie["sentiment"]),
            "rating" => movie => Convert.ToDouble(movie["rating"]),
            _ => movie => Convert.ToDouble(movie["id"])
        };

        var ordered = way == 1 ? movies.OrderByDescending(key) : movies.OrderBy(key);
        return ordered.Take(limit).Select(movie => new List<Dictionary<string, object?>> { Clone(movie) }).ToList();
    }

    public List<Dictionary<string, object?>> GetComments(int movieId) =>
        comments.TryGetValue(movieId, out var values) ? values.Select(Clone).ToList() : [];

    public void AddComment(int movieId, string text)
    {
        var nextId = comments.Values.Sum(list => list.Count) + 1;
        var comment = Comment(nextId, text, DateTimeOffset.UtcNow.ToString("O"));
        if (!comments.TryGetValue(movieId, out var values))
        {
            values = [];
            comments[movieId] = values;
        }

        values.Insert(0, comment);

        if (!sentiments.TryGetValue(movieId, out var sentiment))
        {
            sentiment = Sentiment(movieId, 0, 0);
            sentiments[movieId] = sentiment;
        }

        var target = text.Contains("bad", StringComparison.OrdinalIgnoreCase) ||
                     text.Contains("slow", StringComparison.OrdinalIgnoreCase) ||
                     text.Contains("boring", StringComparison.OrdinalIgnoreCase)
            ? "negative"
            : "positive";
        sentiment[target] = (int)sentiment[target]! + 1;
    }

    public List<Dictionary<string, object?>> GetSentiment(int movieId) =>
        sentiments.TryGetValue(movieId, out var value) ? [Clone(value)] : [Sentiment(movieId, 0, 0)];

    public void SetSentiment(int movieId, int positive, int negative) =>
        sentiments[movieId] = Sentiment(movieId, positive, negative);

    private static Dictionary<string, object?> Movie(
        int id,
        string name,
        int duration,
        double rating,
        int yearRelease,
        int sentiment,
        string[] tags,
        string director,
        string[] writers,
        string[] actors,
        string story) => new()
        {
            ["id"] = id,
            ["m_name"] = name,
            ["duration"] = duration,
            ["rating"] = rating,
            ["story"] = story,
            ["Tag"] = tags,
            ["director"] = director,
            ["writers"] = writers,
            ["actor"] = actors,
            ["yearRelease"] = yearRelease,
            ["sentiment"] = sentiment,
            ["Image"] = MockImage
        };

    private static Dictionary<string, object?> Comment(int id, string text, string createdAt) => new()
    {
        ["cmt_id"] = id,
        ["cmt_text"] = text,
        ["create_at"] = createdAt
    };

    private static Dictionary<string, object?> Sentiment(int movieId, int positive, int negative) => new()
    {
        ["m_id"] = movieId,
        ["positive"] = positive,
        ["negative"] = negative
    };

    private static Dictionary<string, object?> Clone(Dictionary<string, object?> value) => new(value);
}
