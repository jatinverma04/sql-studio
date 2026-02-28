import React, { useState } from 'react';
import { assignmentsApi } from '../services/api';
import './HintPanel.scss';

const HintPanel = ({ assignmentId, currentQuery }) => {
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hintCount, setHintCount] = useState(0);

    const fetchHint = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        setHint('');
        try {
            const res = await assignmentsApi.hint(assignmentId, currentQuery);
            setHint(res.hint || 'No hint available.');
            setHintCount((c) => c + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hint-panel">
            <div className="hint-panel__header">
                <div className="hint-panel__title">
                    <span className="hint-panel__icon">✦</span>
                    AI Hint

                </div>
                <button
                    id="get-hint-btn"
                    className="btn btn--hint btn--sm"
                    onClick={fetchHint}
                    disabled={loading}
                >
                    {loading ? (
                        <><span className="spinner" /> Thinking...</>
                    ) : (
                        <>{hintCount > 0 ? 'Another Hint' : 'Get Hint'}</>
                    )}
                </button>
            </div>

            <div className="hint-panel__body">
                {loading && (
                    <div className="hint-panel__loading">
                        <div className="hint-panel__dots">
                            <span /><span /><span />
                        </div>
                        <p>Generating a helpful hint...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="hint-panel__error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {hint && !loading && (
                    <div className="hint-panel__hint">
                        <div className="hint-panel__hint-badge">Hint</div>
                        <p className="hint-panel__hint-text">{hint}</p>
                    </div>
                )}

                {!hint && !loading && !error && (
                    <div className="hint-panel__placeholder">
                        <p>Stuck? Click <strong>Get Hint</strong> for a conceptual nudge.</p>
                        <p className="hint-panel__disclaimer">
                            Hints guide your thinking — they won't write the query for you.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HintPanel;
