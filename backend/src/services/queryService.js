
const { pgPool } = require('../config/db');


const FORBIDDEN_PATTERNS = [
    /\b(DROP|CREATE|ALTER|TRUNCATE|INSERT|UPDATE|DELETE|GRANT|REVOKE|EXEC|EXECUTE|COPY|VACUUM|ANALYZE)\b/i,
    /;\s*\S/,  
];

/**
 * Validates a SQL query string for safety.
 * @param {string} query
 * @returns {{ valid: boolean, reason?: string }}
 */
const validateQuery = (query) => {
    if (!query || typeof query !== 'string') {
        return { valid: false, reason: 'Query must be a non-empty string.' };
    }

    const stripped = query
        .split('\n')
        .map((line) => {
            const commentIdx = line.indexOf('--');
            return commentIdx >= 0 ? line.slice(0, commentIdx) : line;
        })
        .join('\n');

    const trimmed = stripped.trim();

    if (!trimmed) {
        return { valid: false, reason: 'Please write a SQL query before executing.' };
    }

    if (!trimmed.toUpperCase().startsWith('SELECT')) {
        return { valid: false, reason: 'Only SELECT statements are permitted in the sandbox.' };
    }

    for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { valid: false, reason: 'Query contains forbidden operations. Only read-only SELECT queries are allowed.' };
        }
    }

    if (trimmed.length > 5000) {
        return { valid: false, reason: 'Query is too long. Please keep queries under 5000 characters.' };
    }

    return { valid: true };
};

/**
 * Executes a validated SELECT query against the PostgreSQL sandbox.
 * @param {string} query
 * @param {string[]} allowedTables 
 * @returns {{ columns: string[], rows: object[], rowCount: number }}
 */
const executeQuery = async (query, allowedTables = []) => {
    const validation = validateQuery(query);
    if (!validation.valid) {
        const err = new Error(validation.reason);
        err.statusCode = 400;
        throw err;
    }

   
    if (allowedTables.length > 0) {
        const queryLower = query.toLowerCase();
        const tables = [...allowedTables];
        const usesAllowedTable = tables.some((table) => {
            const t = table.toLowerCase();
            return new RegExp(`\\b${t}\\b`).test(queryLower);
        });
        if (!usesAllowedTable) {
            const err = new Error(
                `This assignment only allows querying these tables: ${tables.join(', ')}`
            );
            err.statusCode = 400;
            throw err;
        }
    }

    const client = await pgPool.connect();
    try {
        await client.query('SET statement_timeout = 10000');
        const result = await client.query(query);

        const columns = result.fields.map((f) => f.name);
        const rows = result.rows;

        return {
            columns,
            rows,
            rowCount: result.rowCount,
        };
    } finally {
        client.release();
    }
};

/**
 * Fetches preview rows for a given table (used by schemaViewer).
 * @param {string} tableName
 * @returns {{ columns: string[], rows: object[] }}
 */
const getTablePreview = async (tableName) => { 
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        const err = new Error('Invalid table name.');
        err.statusCode = 400;
        throw err;
    }

    const client = await pgPool.connect();
    try {
        await client.query('SET statement_timeout = 5000');
        const result = await client.query(`SELECT * FROM ${tableName} LIMIT 10`);
        return {
            columns: result.fields.map((f) => f.name),
            rows: result.rows,
        };
    } finally {
        client.release();
    }
};

module.exports = { validateQuery, executeQuery, getTablePreview };
