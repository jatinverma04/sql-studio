import React, { useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './SqlEditor.scss';

const SQL_COMPLETION_SUGGESTIONS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT',
    'AS', 'AND', 'OR', 'NOT', 'IN', 'NOT IN', 'EXISTS',
    'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
    'ON', 'USING', 'UNION', 'INTERSECT', 'EXCEPT',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
];

const SqlEditor = ({ value, onChange, onExecute, disabled }) => {
    const handleEditorMount = useCallback((editor, monaco) => {
        monaco.languages.registerCompletionItemProvider('sql', {
            provideCompletionItems: () => ({
                suggestions: SQL_COMPLETION_SUGGESTIONS.map((keyword) => ({
                    label: keyword,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: keyword,
                })),
            }),
        });

        editor.focus();
    }, [onExecute, disabled]);

    return (
        <div className="sql-editor">
            <div className="sql-editor__toolbar">
                <div className="sql-editor__label">
                    <span className="sql-editor__label-dot" />
                    SQL Editor
                </div>

            </div>
            <div className="sql-editor__monaco">
                <MonacoEditor
                    height="100%"
                    language="sql"
                    theme="vs-dark"
                    value={value}
                    onChange={onChange}
                    onMount={handleEditorMount}
                    options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontLigatures: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 8,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: 'line',
                        bracketPairColorization: { enabled: true },
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: { other: true, comments: false, strings: false },
                        padding: { top: 12, bottom: 12 },
                        scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default SqlEditor;
