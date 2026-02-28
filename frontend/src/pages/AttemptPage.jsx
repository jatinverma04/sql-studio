import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assignmentsApi } from '../services/api';
import SqlEditor from '../components/SqlEditor';
import ResultsTable from '../components/ResultsTable';
import SchemaViewer from '../components/SchemaViewer';
import HintPanel from '../components/HintPanel';
import './AttemptPage.scss';

// Set up simple session ID
const getSessionId = () => {
    let sid = sessionStorage.getItem('ciphersql_session');
    if (!sid) {
        sid = Math.random().toString(36).slice(2);
        sessionStorage.setItem('ciphersql_session', sid);
    }
    return sid;
};

const AttemptPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Assignment State
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assignmentError, setAssignmentError] = useState(null);

    // Query State
    const [query, setQuery] = useState('-- Write your SQL query here\nSELECT ');
    const [executing, setExecuting] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const [queryError, setQueryError] = useState(null);
    const [executed, setExecuted] = useState(false);

    // UI state
    const [activePanel, setActivePanel] = useState('question');
    const [rightPanel, setRightPanel] = useState('results');

    // History
    const [attempts, setAttempts] = useState([]);

    const sessionId = getSessionId();

    // Fetch assignment
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await assignmentsApi.get(id);
                setAssignment(res.data);
            } catch (err) {
                setAssignmentError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    // Execute SQL
    const executeQuery = useCallback(async () => {
        if (executing || !query.trim()) return;
        setExecuting(true);
        setQueryError(null);
        setQueryResult(null);
        setExecuted(false);

        try {
            const res = await assignmentsApi.execute(id, query, sessionId);
            setQueryResult(res.data);
            setExecuted(true);
        } catch (err) {
            setQueryError(err.message);
            setExecuted(true);
        } finally {
            setExecuting(false);
        }
    }, [id, query, sessionId, executing]);

    // Fetch recent attempts
    const loadAttempts = useCallback(async () => {
        try {
            const res = await assignmentsApi.attempts(id, sessionId);
            setAttempts(res.data || []);
        } catch (_) { }
    }, [id, sessionId]);

    useEffect(() => {
        if (rightPanel === 'history') {
            loadAttempts();
        }
    }, [rightPanel, loadAttempts]);

    if (loading) {
        return (
            <div className="attempt-page attempt-page--loading">
                <div className="attempt-page__loader">
                    <div className="spinner" style={{ fontSize: '2rem', color: 'var(--amber)' }} />
                    <p>Loading assignment...</p>
                </div>
            </div>
        );
    }

    if (assignmentError) {
        return (
            <div className="attempt-page attempt-page--error">
                <div className="container">
                    <h2>Failed to load assignment</h2>
                    <p>{assignmentError}</p>
                    <Link to="/" className="btn btn--secondary">← Back to Assignments</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="attempt-page">
            {/* Topbar */}
            <div className="attempt-page__topbar">
                <div className="attempt-page__topbar-left">
                    <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => navigate('/')}
                        id="back-btn"
                    >
                        ←
                    </button>
                    <div className="attempt-page__title-section">
                        <h1 className="attempt-page__title">{assignment.title}</h1>
                        <span className={`badge badge--${assignment.difficulty.toLowerCase()}`}>
                            {assignment.difficulty}
                        </span>
                    </div>
                </div>
                <div className="attempt-page__topbar-right">
                    <button
                        id="execute-query-btn"
                        className="btn btn--primary btn--sm"
                        onClick={executeQuery}
                        disabled={executing}
                    >
                        {executing ? (
                            <><span className="spinner" />
                                <span className="attempt-page__execute-label--full">Running...</span>
                            </>
                        ) : (
                            <>
                                ▶
                                <span className="attempt-page__execute-label--short">Run</span>
                                <span className="attempt-page__execute-label--full">Execute Query</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Workspace */}
            <div className="attempt-page__workspace">

                {/* Left panel */}
                <aside className="attempt-page__left">
                    {/* Panel tabs */}
                    <div className="panel-tabs">
                        <button
                            id="tab-question"
                            className={`panel-tab ${activePanel === 'question' ? 'panel-tab--active' : ''}`}
                            onClick={() => setActivePanel('question')}
                        >
                            📋 Question
                        </button>
                        <button
                            id="tab-schema"
                            className={`panel-tab ${activePanel === 'schema' ? 'panel-tab--active' : ''}`}
                            onClick={() => setActivePanel('schema')}
                        >
                            🗃️ Schema
                        </button>
                    </div>

                    <div className="panel-content">
                        {activePanel === 'question' ? (
                            <div className="question-panel">
                                <div className="question-panel__description">
                                    {assignment.description}
                                </div>
                                <div className="question-panel__meta">
                                    <div className="question-panel__meta-item">
                                        <span className="question-panel__meta-label">Tables Available</span>
                                        <div className="question-panel__tables">
                                            {assignment.tables.map((t) => (
                                                <span key={t} className="table-name-chip">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="question-panel__tips">
                                    <div className="question-panel__tip-header">💡 Tips</div>
                                    <ul>
                                        <li>Only <strong>SELECT</strong> statements are allowed</li>
                                        <li>Click <strong>Schema</strong> to explore tables</li>
                                        <li>Use <strong>AI Hint</strong> if you get stuck</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="schema-panel">
                                <SchemaViewer tableData={assignment.tableData} />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Center panel */}
                <main className="attempt-page__center">
                    <div className="attempt-page__editor">
                        <SqlEditor
                            value={query}
                            onChange={setQuery}
                            onExecute={executeQuery}
                            disabled={executing}
                        />
                    </div>

                    {/* Result tabs */}
                    <div className="attempt-page__results-section">
                        <div className="panel-tabs panel-tabs--inline">
                            <button
                                id="tab-results"
                                className={`panel-tab ${rightPanel === 'results' ? 'panel-tab--active' : ''}`}
                                onClick={() => setRightPanel('results')}
                            >
                                📊 Results
                            </button>
                            <button
                                id="tab-history"
                                className={`panel-tab ${rightPanel === 'history' ? 'panel-tab--active' : ''}`}
                                onClick={() => setRightPanel('history')}
                            >
                                🕒 History
                            </button>
                            {/* Mobile hint tab */}
                            <button
                                id="tab-hint"
                                className={`panel-tab panel-tab--hint-mobile ${rightPanel === 'hint' ? 'panel-tab--active' : ''}`}
                                onClick={() => setRightPanel('hint')}
                            >
                                ✦ AI Hint
                            </button>
                        </div>

                        <div className="attempt-page__results-body">
                            {rightPanel === 'results' && (
                                <ResultsTable
                                    columns={queryResult?.columns}
                                    rows={queryResult?.rows}
                                    rowCount={queryResult?.rowCount}
                                    loading={executing}
                                    error={queryError}
                                    executed={executed}
                                />
                            )}
                            {rightPanel === 'history' && (
                                <div className="attempt-history">
                                    {attempts.length === 0 ? (
                                        <p className="attempt-history__empty">No attempts yet in this session.</p>
                                    ) : (
                                        attempts.map((a) => (
                                            <div
                                                key={a._id}
                                                className={`attempt-item attempt-item--${a.success ? 'success' : 'fail'}`}
                                                onClick={() => {
                                                    setQuery(a.query);
                                                    setRightPanel('results');
                                                }}
                                                title="Click to load this query"
                                            >
                                                <div className="attempt-item__header">
                                                    <span className="attempt-item__status">
                                                        {a.success ? '✓' : '✗'}
                                                    </span>
                                                    <span className="attempt-item__time">
                                                        {new Date(a.createdAt).toLocaleTimeString()}
                                                    </span>
                                                    {a.success && (
                                                        <span className="attempt-item__rows">{a.rowCount} rows</span>
                                                    )}
                                                </div>
                                                <pre className="attempt-item__query">{a.query}</pre>
                                                {a.errorMessage && (
                                                    <p className="attempt-item__error">{a.errorMessage}</p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            {/* Inline hint for mobile */}
                            {rightPanel === 'hint' && (
                                <div className="hint-inline">
                                    <HintPanel assignmentId={id} currentQuery={query} />
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Desktop hint panel */}
                <aside className="attempt-page__right">
                    <HintPanel assignmentId={id} currentQuery={query} />
                </aside>

            </div>
        </div>
    );
};

export default AttemptPage;
