import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentsApi } from '../services/api';
import './AssignmentsPage.scss';

const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 };

const DifficultyIcon = ({ difficulty }) => {
    const icons = { Easy: '◉', Medium: '◈', Hard: '◆' };
    return <span className="assignment-card__diff-icon">{icons[difficulty] || '○'}</span>;
};

const AssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await assignmentsApi.list();
                setAssignments(res.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const filtered = assignments
        .filter((a) => filterDifficulty === 'All' || a.difficulty === filterDifficulty)
        .filter((a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);

    const counts = { All: assignments.length };
    ['Easy', 'Medium', 'Hard'].forEach((d) => {
        counts[d] = assignments.filter((a) => a.difficulty === d).length;
    });

    if (loading) {
        return (
            <div className="assignments-page">
                <div className="assignments-page__header">
                    <div className="container">
                        <h1>SQL Assignments</h1>
                    </div>
                </div>
                <div className="container">
                    <div className="assignments-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="assignment-card assignment-card--skeleton" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assignments-page">
                <div className="container">
                    <div className="assignments-page__error">
                        <div className="assignments-page__error-icon">⚠️</div>
                        <h2>Failed to load assignments</h2>
                        <p>{error}</p>
                        <p className="assignments-page__error-hint">
                            Make sure the backend server is running on{' '}
                            <code>{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</code>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="assignments-page">

            <div className="assignments-page__header">
                <div className="container">
                    <div className="assignments-page__header-content">
                        <div>
                            <h1 className="assignments-page__title">
                                SQL <span className="assignments-page__title-accent">Assignments</span>
                            </h1>
                            <p className="assignments-page__subtitle">
                                Practice SQL against real datasets. Write queries, see results instantly.
                            </p>
                        </div>
                        <div className="assignments-page__stats">
                            <div className="stat">
                                <span className="stat__value">{assignments.length}</span>
                                <span className="stat__label">Total</span>
                            </div>
                            <div className="stat">
                                <span className="stat__value stat__value--easy">{counts.Easy}</span>
                                <span className="stat__label">Easy</span>
                            </div>
                            <div className="stat">
                                <span className="stat__value stat__value--medium">{counts.Medium}</span>
                                <span className="stat__label">Medium</span>
                            </div>
                            <div className="stat">
                                <span className="stat__value stat__value--hard">{counts.Hard}</span>
                                <span className="stat__label">Hard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">

                <div className="assignments-page__controls">
                    <div className="filter-tabs">
                        {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                            <button
                                key={d}
                                id={`filter-${d.toLowerCase()}`}
                                className={`filter-tab filter-tab--${d.toLowerCase()} ${filterDifficulty === d ? 'filter-tab--active' : ''}`}
                                onClick={() => setFilterDifficulty(d)}
                            >
                                {d} <span className="filter-tab__count">{counts[d]}</span>
                            </button>
                        ))}
                    </div>
                    <div className="search-box">
                        <span className="search-box__icon">🔍</span>
                        <input
                            id="search-assignments"
                            type="text"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-box__input"
                        />
                        {searchQuery && (
                            <button
                                className="search-box__clear"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>


                {filtered.length === 0 ? (
                    <div className="assignments-page__empty">
                        <p>No assignments match your filters.</p>
                    </div>
                ) : (
                    <div className="assignments-grid">
                        {filtered.map((assignment) => (
                            <Link
                                key={assignment._id}
                                to={`/assignments/${assignment._id}`}
                                className="assignment-card"
                                id={`assignment-${assignment._id}`}
                            >
                                <div className="assignment-card__top">
                                    <span className={`badge badge--${assignment.difficulty.toLowerCase()}`}>
                                        <DifficultyIcon difficulty={assignment.difficulty} />
                                        {assignment.difficulty}
                                    </span>
                                    <span className="assignment-card__tables">
                                        {assignment.tables?.slice(0, 3).join(' · ')}
                                        {assignment.tables?.length > 3 && ` +${assignment.tables.length - 3}`}
                                    </span>
                                </div>

                                <h2 className="assignment-card__title">{assignment.title}</h2>
                                <p className="assignment-card__description">{assignment.description}</p>

                                <div className="assignment-card__footer">
                                    <span className="assignment-card__cta">
                                        Attempt
                                        <svg className="assignment-card__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentsPage;
