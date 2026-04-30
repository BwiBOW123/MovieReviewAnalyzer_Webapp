'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import './info.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';
const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_BASE_URL ?? 'http://127.0.0.1:8001';

type Movie = {
  id: number;
  Image: string;
  Tag: string[];
  actor: string[];
  writers: string[];
  director: string;
  duration: number;
  m_name: string;
  rating: number;
  sentiment: number;
  story: string;
  yearRelease: number;
};

type Comment = {
  cmt_text: string;
  create_at?: string;
};

type Sentiment = {
  Positive: number;
  Negative: number;
};

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} m`;
  if (remainingMinutes === 0) return `${hours} h`;
  return `${hours} h ${remainingMinutes} m`;
}

function imageFromBase64(value: string): string {
  return value.startsWith('data:') ? value : `data:image/png;base64,${value}`;
}

function percent(value: number, total: number): number {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export default function MovieInfoPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [sentiment, setSentiment] = useState<Sentiment>({ Positive: 0, Negative: 0 });
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSentiment = sentiment.Positive + sentiment.Negative;
  const positivePercent = percent(sentiment.Positive, totalSentiment);
  const negativePercent = totalSentiment ? 100 - positivePercent : 0;

  const posterImage = useMemo(() => {
    if (!movie?.Image) return '';
    return imageFromBase64(movie.Image);
  }, [movie]);

  useEffect(() => {
    if (!id) return;

    async function fetchMoviePage() {
      const [movieResponse, commentsResponse, sentimentResponse, ratingResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/movies/${id}`),
          fetch(`${API_BASE_URL}/comment/${id}`),
          fetch(`${API_BASE_URL}/sentiment/${id}`),
          fetch(`${API_BASE_URL}/Rating/5`),
        ]);

      const movieData = await movieResponse.json();
      const commentData = await commentsResponse.json();
      const sentimentData = await sentimentResponse.json();
      const ratingData = await ratingResponse.json();

      setMovie(movieData.data?.[0] ?? null);
      setComments(commentData.data ?? []);
      setRecommendations((ratingData.data ?? []).filter((item: Movie) => item.id?.toString() !== id).slice(0, 4));

      const currentSentiment = sentimentData.data?.[0];
      setSentiment({
        Positive: currentSentiment?.positive ?? 0,
        Negative: currentSentiment?.negative ?? 0,
      });
    }

    fetchMoviePage().catch((error) => console.error('Failed to load movie page:', error));
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedReview = reviewText.trim();
    if (!trimmedReview || !id) return;

    setIsSubmitting(true);
    setComments((current) => [{ cmt_text: trimmedReview }, ...current]);

    const commentPayload = new FormData();
    commentPayload.append(
      'cmt_data',
      new Blob([JSON.stringify({ cmt_text: trimmedReview, m_id: id })], { type: 'application/json' }),
    );

    const aiPayload = new FormData();
    aiPayload.append(
      'file',
      new Blob([JSON.stringify({ text: trimmedReview, m_id: id })], { type: 'application/json' }),
    );

    try {
      await fetch(`${API_BASE_URL}/comment`, { method: 'POST', body: commentPayload });
      await fetch(`${AI_API_BASE_URL}/predict`, { method: 'POST', body: aiPayload });
      setReviewText('');
      setRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!movie || !posterImage) {
    return <main className="movie-review-page movie-review-loading">Loading...</main>;
  }

  return (
    <main className="movie-review-page">
      <section className="review-hero" aria-label="Write a movie review">
        <div className="movie-poster-summary">
          <Image className="poster-image" src={posterImage} width={250} height={340} alt={movie.m_name} priority />
          <div className="poster-title">
            <h1>{movie.m_name}</h1>
            <p>{movie.Tag?.join(', ')}</p>
            <p>{movie.yearRelease}</p>
          </div>
        </div>

        <form className="review-panel" onSubmit={handleSubmit}>
          <h2>Write Your Review</h2>
          <label className="rating-control" htmlFor="review-rating">
            <span>Rate this movie:</span>
            <span className="star-rating">{rating}/10</span>
          </label>
          <input
            id="review-rating"
            className="rating-slider"
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          />
          <textarea
            value={reviewText}
            maxLength={500}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Share your thoughts, spoilers are hidden by default..."
          />
          <div className="review-footer">
            <span>{reviewText.length} / 500 characters</span>
            <button type="submit" disabled={isSubmitting || reviewText.trim().length === 0}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
          <p className="guideline-text">By submitting, you agree to our community guidelines.</p>
        </form>
      </section>

      <section className="review-results" aria-label="Movie review analysis">
        <div className="sentiment-scoreboard">
          <div className="score-line positive">
            <span className="score-icon">+</span>
            <strong>{positivePercent}%</strong>
          </div>
          <div className="score-line negative">
            <span className="score-icon">-</span>
            <strong>{negativePercent}%</strong>
          </div>
        </div>

        <div
          className="sentiment-pie"
          style={{ background: `conic-gradient(#cf4b4d 0 ${negativePercent}%, #72b67b ${negativePercent}% 100%)` }}
          aria-label={`${positivePercent}% positive and ${negativePercent}% negative reviews`}
        >
          <strong>{positivePercent}%</strong>
        </div>

        <div className="review-thanks">
          <h2>Thank you for your review</h2>
          <div className="legend-row">
            <span className="legend-dot positive"></span>
            <span>Loved the acting</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot negative"></span>
            <span>Found the pacing slow</span>
          </div>
        </div>
      </section>

      <section className="recommended-section" aria-label="Recommended movies">
        <h2>Recommended for You</h2>
        <div className="recommended-grid">
          {recommendations.map((item) => (
            <a className="recommended-card" href={`/movie-info/${item.id}`} key={item.id}>
              <Image src={imageFromBase64(item.Image)} width={190} height={100} alt={item.m_name} />
              <span>{item.m_name}</span>
              <small>Rating {item.rating}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="movie-detail-section" aria-label="Movie information">
        <div className="movie-facts">
          <span>{formatTime(movie.duration)}</span>
          <span>{movie.yearRelease}</span>
          <span>{movie.sentiment}% audience score</span>
        </div>
        <div className="tag-list">
          {movie.Tag?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <dl className="metadata-list">
          <div>
            <dt>Stars</dt>
            <dd>{movie.actor?.join(', ')}</dd>
          </div>
          <div>
            <dt>Writers</dt>
            <dd>{movie.writers?.join(', ')}</dd>
          </div>
          <div>
            <dt>Director</dt>
            <dd>{movie.director}</dd>
          </div>
          <div>
            <dt>Story</dt>
            <dd>{movie.story}</dd>
          </div>
        </dl>
      </section>

      <section className="comment-section" aria-label="Audience comments">
        <h2>Audience Comments</h2>
        <div className="comment-list">
          {comments.map((comment, index) => (
            <article className="comment-item" key={`${comment.cmt_text}-${index}`}>
              <p>{comment.cmt_text}</p>
              {comment.create_at ? <time>{new Date(comment.create_at).toLocaleDateString()}</time> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
