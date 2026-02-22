import { useEffect, useState } from 'react';
import { analyticsApi } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export default function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [sentiment, setSentiment] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryRes, sentimentRes, timelineRes] = await Promise.all([
                analyticsApi.summary(),
                analyticsApi.sentiment(),
                analyticsApi.ratingsOverTime(),
            ]);
            setSummary(summaryRes);
            setSentiment(sentimentRes);
            setTimeline(timelineRes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="page-header">
                    <h1>📊 Analytics Dashboard</h1>
                    <p>Loading analytics data...</p>
                </div>
                <div className="stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card stat-card">
                            <div className="skeleton" style={{ width: '60px', height: '40px', margin: '0 auto 8px' }} />
                            <div className="skeleton" style={{ width: '100px', height: '16px', margin: '0 auto' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="page-header">
                    <h1>📊 Analytics Dashboard</h1>
                </div>
                <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--danger)' }}>⚠️ {error}</p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>
                        You may need admin privileges to view analytics.
                    </p>
                </div>
            </div>
        );
    }

    const sentimentData = summary?.by_sentiment || {};
    const categoryData = summary?.by_category || {};

    const pieData = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: [
                    sentimentData.positive || 0,
                    sentimentData.neutral || 0,
                    sentimentData.negative || 0,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(108, 99, 255, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(108, 99, 255, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const barData = {
        labels: Object.keys(categoryData).map(
            (k) => k.charAt(0).toUpperCase() + k.slice(1)
        ),
        datasets: [
            {
                label: 'Responses',
                data: Object.values(categoryData).map((v) => v.count),
                backgroundColor: 'rgba(108, 99, 255, 0.6)',
                borderColor: 'rgba(108, 99, 255, 1)',
                borderWidth: 1,
                borderRadius: 8,
            },
            {
                label: 'Avg Rating',
                data: Object.values(categoryData).map((v) => v.average_rating),
                backgroundColor: 'rgba(0, 217, 255, 0.6)',
                borderColor: 'rgba(0, 217, 255, 1)',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const timelineData = timeline?.timeline || [];
    const lineData = {
        labels: timelineData.map((t) => t.date),
        datasets: [
            {
                label: 'Avg Rating',
                data: timelineData.map((t) => t.average_rating),
                borderColor: 'rgba(108, 99, 255, 1)',
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(108, 99, 255, 1)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#A0A0B8', font: { family: 'Inter' } },
            },
        },
        scales: {
            x: {
                ticks: { color: '#6B6B80' },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
            y: {
                ticks: { color: '#6B6B80' },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
        },
    };

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1>📊 Analytics Dashboard</h1>
                <p>Overview of feedback and engagement metrics</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="glass-card stat-card">
                    <div className="stat-value">{summary?.total_responses || 0}</div>
                    <div className="stat-label">Total Responses</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-value">{summary?.average_rating || 0}</div>
                    <div className="stat-label">Average Rating</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-value">{sentimentData.positive || 0}</div>
                    <div className="stat-label">Positive Reviews</div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-value">{Object.keys(categoryData).length}</div>
                    <div className="stat-label">Categories</div>
                </div>
            </div>

            {/* Charts */}
            <div className="chart-grid">
                <div className="glass-card chart-card">
                    <h3>Sentiment Distribution</h3>
                    <div style={{ height: '280px', display: 'flex', justifyContent: 'center' }}>
                        <Pie
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: { color: '#A0A0B8', font: { family: 'Inter' }, padding: 16 },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card chart-card">
                    <h3>Responses by Category</h3>
                    <div style={{ height: '280px' }}>
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {timelineData.length > 0 && (
                <div className="glass-card chart-card" style={{ marginBottom: '24px' }}>
                    <h3>Ratings Over Time</h3>
                    <div style={{ height: '250px' }}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            )}

            {/* Recent Feedback */}
            <div className="glass-card recent-feedback">
                <h3>Recent Feedback</h3>
                {(summary?.recent_feedback || []).length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No feedback submitted yet.
                    </p>
                ) : (
                    (summary?.recent_feedback || []).map((fb) => (
                        <div key={fb.id} className="feedback-item">
                            <div className="fb-header">
                                <span className="fb-subject">{fb.subject}</span>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <span className={`badge badge-${fb.sentiment === 'positive' ? 'success' : fb.sentiment === 'negative' ? 'danger' : 'primary'}`}>
                                        {fb.sentiment}
                                    </span>
                                    <span className="badge badge-warning">{'⭐'.repeat(fb.rating)}</span>
                                </div>
                            </div>
                            {fb.comments && (
                                <p className="fb-comment">{fb.comments}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
