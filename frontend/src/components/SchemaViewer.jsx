import React, { useState } from 'react';
import './SchemaViewer.scss';

const TypeBadge = ({ type }) => {
    const color = {
        integer: '#58a6ff',
        numeric: '#bc8cff',
        varchar: '#3fb950',
        date: '#f0883e',
        boolean: '#d29922',
        text: '#3fb950',
        unknown: '#57606a',
    }[type?.toLowerCase()] || '#57606a';

    return (
        <span className="type-badge" style={{ color }}>
            {type || '?'}
        </span>
    );
};

const SchemaViewer = ({ tableData }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [viewMode, setViewMode] = useState('schema');

    if (!tableData || tableData.length === 0) {
        return (
            <div className="schema-viewer schema-viewer--empty">
                <p>No table data available</p>
            </div>
        );
    }

    const currentTable = tableData[activeTab];

    return (
        <div className="schema-viewer">
            {/* Table Tabs */}
            <div className="schema-viewer__tabs">
                {tableData.map((table, i) => (
                    <button
                        key={table.tableName}
                        id={`schema-tab-${table.tableName}`}
                        className={`schema-viewer__tab ${activeTab === i ? 'schema-viewer__tab--active' : ''}`}
                        onClick={() => setActiveTab(i)}
                        title={table.tableName}
                    >
                        <span className="schema-viewer__tab-icon">⊞</span>
                        {table.tableName}
                    </button>
                ))}
            </div>

            {/* View Mode Toggle */}
            <div className="schema-viewer__mode-toggle">
                <button
                    className={`schema-viewer__mode-btn ${viewMode === 'schema' ? 'schema-viewer__mode-btn--active' : ''}`}
                    onClick={() => setViewMode('schema')}
                    id="schema-view-schema"
                >
                    Schema
                </button>
                <button
                    className={`schema-viewer__mode-btn ${viewMode === 'data' ? 'schema-viewer__mode-btn--active' : ''}`}
                    onClick={() => setViewMode('data')}
                    id="schema-view-data"
                >
                    Preview Data
                </button>
            </div>

            {/* Content */}
            <div className="schema-viewer__content">
                {viewMode === 'schema' ? (
                    <div className="schema-viewer__schema">
                        <table className="schema-viewer__table">
                            <thead>
                                <tr>
                                    <th>Column</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTable.columns.map((col) => (
                                    <tr key={col.name}>
                                        <td className="schema-viewer__col-name">{col.name}</td>
                                        <td><TypeBadge type={col.dataType} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="schema-viewer__preview">
                        {currentTable.previewRows?.length > 0 ? (
                            <div className="schema-viewer__data-scroll">
                                <table className="schema-viewer__data-table">
                                    <thead>
                                        <tr>
                                            {currentTable.previewColumns?.map((col) => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTable.previewRows.map((row, i) => (
                                            <tr key={i}>
                                                {currentTable.previewColumns?.map((col) => (
                                                    <td key={col}>
                                                        {row[col] === null ? (
                                                            <span className="schema-viewer__null">NULL</span>
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
                        ) : (
                            <p className="schema-viewer__no-data">No preview data</p>
                        )}
                        <p className="schema-viewer__preview-note">Showing up to 10 rows</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchemaViewer;
