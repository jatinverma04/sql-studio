import React from 'react';
import './ResultsTable.scss';

const ResultsTable = ({ columns, rows, rowCount, loading, error, executed }) => {
    if (loading) {
        return (
            <div className="results-table results-table--loading">
                <div className="results-table__spinner">
                    <div className="spinner" />
                    <span>Executing query...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-table results-table--error">
                <div className="results-table__error-header">
                    <span className="results-table__error-icon">⛔</span>
                    <span className="results-table__error-title">Query Error</span>
                </div>
                <pre className="results-table__error-msg">{error}</pre>
            </div>
        );
    }

    if (!executed) {
        return (
            <div className="results-table results-table--empty">
                <div className="results-table__placeholder">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect x="4" y="10" width="40" height="6" rx="2" fill="currentColor" opacity="0.2" />
                        <rect x="4" y="20" width="40" height="4" rx="1" fill="currentColor" opacity="0.15" />
                        <rect x="4" y="28" width="30" height="4" rx="1" fill="currentColor" opacity="0.1" />
                        <rect x="4" y="36" width="36" height="4" rx="1" fill="currentColor" opacity="0.08" />
                    </svg>
                    <p>Results will appear here</p>
                    <span>Write a query and click <strong>Execute Query</strong> to see results</span>
                </div>
            </div>
        );
    }

    if (rows.length === 0) {
        return (
            <div className="results-table results-table--empty">
                <div className="results-table__placeholder">
                    <span style={{ fontSize: '2rem' }}>📭</span>
                    <p>Query returned 0 rows</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-table">
            <div className="results-table__meta">
                <span className="results-table__row-count">
                    ✓ {rowCount} row{rowCount !== 1 ? 's' : ''} returned
                </span>
                <span className="results-table__col-count">
                    {columns.length} column{columns.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="results-table__scroll">
                <table className="results-table__table">
                    <thead>
                        <tr>
                            <th className="results-table__row-num">#</th>
                            {columns.map((col) => (
                                <th key={col} className="results-table__th">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="results-table__tr">
                                <td className="results-table__row-num results-table__row-num--body">{i + 1}</td>
                                {columns.map((col) => (
                                    <td key={col} className="results-table__td">
                                        {row[col] === null ? (
                                            <span className="results-table__null">NULL</span>
                                        ) : typeof row[col] === 'boolean' ? (
                                            <span className={`results-table__bool results-table__bool--${row[col]}`}>
                                                {String(row[col])}
                                            </span>
                                        ) : (
                                            String(row[col])
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsTable;
