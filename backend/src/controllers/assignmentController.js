const Assignment = require('../models/Assignment');
const QueryAttempt = require('../models/QueryAttempt');
const { executeQuery, getTablePreview } = require('../services/queryService');
const { generateHint } = require('../services/llmService');

const listAssignments = async (req, res) => {
    const assignments = await Assignment.find(
        {},
        'title description difficulty tables createdAt'
    ).sort({ difficulty: 1, createdAt: 1 });

    res.json({ success: true, data: assignments });
};

const getAssignment = async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const tableData = await Promise.allSettled(
        assignment.tables.map(async (tableName) => {
            const preview = await getTablePreview(tableName);
            const schemaEntry = assignment.schemaInfo.find((s) => s.tableName === tableName);
            return {
                tableName,
                columns: schemaEntry ? schemaEntry.columns : preview.columns.map((c) => ({ name: c, dataType: 'unknown' })),
                previewRows: preview.rows,
                previewColumns: preview.columns,
            };
        })
    );

    const tables = tableData
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

    res.json({
        success: true,
        data: {
            _id: assignment._id,
            title: assignment.title,
            description: assignment.description,
            difficulty: assignment.difficulty,
            tables: assignment.tables,
            schemaInfo: assignment.schemaInfo,
            tableData: tables,
        },
    });
};

const executeAssignmentQuery = async (req, res) => {
    const { query, sessionId } = req.body;

    if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required.' });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    let attempt;
    let result;

    try {
        result = await executeQuery(query, assignment.tables);

        attempt = await QueryAttempt.create({
            assignmentId: assignment._id,
            sessionId,
            query,
            success: true,
            rowCount: result.rowCount,
        });

        res.json({
            success: true,
            data: {
                columns: result.columns,
                rows: result.rows,
                rowCount: result.rowCount,
                attemptId: attempt._id,
            },
        });
    } catch (err) {
        await QueryAttempt.create({
            assignmentId: assignment._id,
            sessionId,
            query,
            success: false,
            errorMessage: err.message,
        }).catch(() => { });

        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || 'Query execution failed.',
            isQueryError: statusCode === 400,
        });
    }
};

const getHint = async (req, res) => {
    const { query } = req.body;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    try {
        const hint = await generateHint({
            assignmentTitle: assignment.title,
            assignmentDescription: assignment.description,
            userQuery: query || '',
            expectedConcepts: assignment.expectedConcepts,
            tables: assignment.tables,
        });

        res.json({ success: true, hint });
    } catch (err) {
        const isQuota = err.message?.includes('quota exceeded');
        const isRateLimit = err.message?.includes('rate-limited');
        const statusCode = isQuota || isRateLimit ? 503 : 500;
        res.status(statusCode).json({ success: false, message: err.message });
    }
};

const getAttempts = async (req, res) => {
    const { sessionId } = req.query;
    const filter = { assignmentId: req.params.id };
    if (sessionId) filter.sessionId = sessionId;

    const attempts = await QueryAttempt.find(filter)
        .sort({ createdAt: -1 })
        .limit(20)
        .select('query success rowCount errorMessage createdAt');

    res.json({ success: true, data: attempts });
};

module.exports = { listAssignments, getAssignment, executeAssignmentQuery, getHint, getAttempts };
