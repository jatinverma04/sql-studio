const express = require('express');
const router = express.Router();
const {
    listAssignments,
    getAssignment,
    executeAssignmentQuery,
    getHint,
    getAttempts,
} = require('../controllers/assignmentController');

router.get('/', listAssignments);

router.get('/:id', getAssignment);

router.post('/:id/execute', executeAssignmentQuery);

router.post('/:id/hint', getHint);

router.get('/:id/attempts', getAttempts);

module.exports = router;
