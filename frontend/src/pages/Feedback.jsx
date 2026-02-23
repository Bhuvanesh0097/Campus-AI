import { useState } from 'react';
import { feedbackApi } from '../services/api';
import {
    HiOutlineStar,
    HiStar,
    HiOutlineCheckCircle,
} from 'react-icons/hi2';

const CATEGORIES = [
    { value: 'course', label: '📚 Course' },
    { value: 'faculty', label: '👨‍🏫 Faculty' },
    { value: 'event', label: '🎉 Event' },
    { value: 'general', label: '💬 General' },
];

export default function Feedback() {
    const [category, setCategory] = useState('course');
    const [subject, setSubject] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim()) {
            setError('Please enter a subject');
            return;
        }
        if (rating < 1) {
            setError('Please select a rating');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await feedbackApi.submit(category, subject, rating, comments);
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCategory('course');
        setSubject('');
        setRating(0);
        setComments('');
        setSubmitted(false);
        setError('');
    };

    if (submitted) {
        return (
            <div className="feedback-page">
                <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            background: 'var(--success-pale)',
                            border: '2px solid var(--success)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'float 3s ease-in-out infinite',
                        }}>
                            <HiOutlineCheckCircle style={{ fontSize: '2rem', color: 'var(--success)' }} />
                        </div>
                    </div>
                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Thank you so much! 🙏
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                        Your feedback means the world to us. We'll use it to make things even better!
                    </p>
                    <button className="btn btn-primary" onClick={resetForm}>
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-page">
            <div className="page-header">
                <h1>📋 Share Your Feedback</h1>
                <p>Your voice matters — help us improve the campus experience!</p>
            </div>

            <form className="feedback-form card" onSubmit={handleSubmit}>
                {error && (
                    <div className="error-msg" style={{ margin: 0 }} role="alert">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Category selector */}
                <div className="input-group">
                    <label>Category</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                className={`btn ${category === c.value ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                onClick={() => setCategory(c.value)}
                                id={`category-${c.value}`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject */}
                <div className="input-group">
                    <label htmlFor="fb-subject">
                        {category === 'course'
                            ? 'Course Name'
                            : category === 'faculty'
                                ? 'Faculty Name'
                                : category === 'event'
                                    ? 'Event Name'
                                    : 'Subject'}
                    </label>
                    <input
                        id="fb-subject"
                        type="text"
                        className="input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={`What ${category} would you like to review?`}
                        required
                    />
                </div>

                {/* Rating */}
                <div className="input-group">
                    <label>How would you rate it?</label>
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`rating-star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setRating(star)}
                                aria-label={`Rate ${star} out of 5`}
                            >
                                {star <= (hoverRating || rating) ? (
                                    <HiStar />
                                ) : (
                                    <HiOutlineStar />
                                )}
                            </span>
                        ))}
                        {rating > 0 && (
                            <span
                                style={{
                                    marginLeft: '8px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    alignSelf: 'center',
                                }}
                            >
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* Comments */}
                <div className="input-group">
                    <label htmlFor="fb-comments">
                        Anything else you'd like to share? (optional)
                    </label>
                    <textarea
                        id="fb-comments"
                        className="input"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Tell us more… we're all ears! 👂"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                    style={{ width: '100%' }}
                    id="feedback-submit-btn"
                >
                    {loading ? (
                        <>
                            <div className="spinner" />
                            Submitting…
                        </>
                    ) : (
                        '✨ Submit Feedback'
                    )}
                </button>
            </form>
        </div>
    );
}
