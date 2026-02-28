const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;

const getClient = () => {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in .env');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callWithRetry = async (systemPrompt, userPrompt, attempt = 1) => {
    try {
        const client = getClient();
        const model = client.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemPrompt,
        });
        const result = await model.generateContent(userPrompt);
        return result.response.text();
    } catch (err) {
        const isRateLimit =
            err.status === 429 ||
            err.message?.includes('rate_limit') ||
            err.message?.includes('RESOURCE_EXHAUSTED');
        if (isRateLimit && attempt === 1) {
            console.warn('[llmService] Rate limited — retrying in 5s...');
            await sleep(5000);
            return callWithRetry(systemPrompt, userPrompt, 2);
        }
        throw err;
    }
};


const generateHint = async ({
    assignmentTitle,
    assignmentDescription,
    userQuery,
    expectedConcepts = [],
    tables = [],
}) => {
    try {
        const systemPrompt = `You are an expert SQL tutor helping a student learn SQL.
Your role is STRICTLY to provide conceptual guidance and hints — NEVER write complete SQL queries or give the full solution.

Rules you MUST follow:
1. NEVER write a complete SQL query or show the full answer.
2. NEVER complete or fix the student's existing query directly.
3. DO explain concepts, SQL clauses, or thinking approaches.
4. DO point out what SQL concept or clause they might be missing.
5. DO ask leading questions to guide their thinking.
6. Keep your response concise (3-6 sentences max).
7. Be encouraging and educational in tone.`;

        const userPrompt = `Assignment: "${assignmentTitle}"

Description: ${assignmentDescription}

Available tables: ${tables.join(', ')}

SQL concepts this assignment tests: ${expectedConcepts.join(', ')}

Student's current query attempt:
\`\`\`sql
${userQuery || '(No query written yet)'}
\`\`\`

Please provide a helpful hint to guide this student without giving away the answer.`;

        return await callWithRetry(systemPrompt, userPrompt);

    } catch (err) {
        console.error('[llmService] Gemini error:', err.status, err.message);
        const isQuotaExhausted =
            err.message?.includes('free_tier') ||
            err.message?.includes('quota') ||
            err.message?.includes('exceeded your current quota');
        if (isQuotaExhausted) {
            throw new Error('Gemini API free-tier quota exceeded. Please enable billing at https://ai.dev/rate-limit or use a different API key.');
        }
        if (err.status === 429 || err.message?.includes('RESOURCE_EXHAUSTED')) {
            throw new Error('AI hints are temporarily rate-limited. Please wait a moment and try again.');
        }
        if (err.status === 400 && err.message?.includes('API_KEY_INVALID')) {
            throw new Error('Invalid Gemini API key. Please check GEMINI_API_KEY in the .env file.');
        }
        if (err.status === 403) {
            throw new Error('Gemini API access denied. Please check your API key permissions.');
        }
        throw new Error(`Hint generation failed: ${err.message}`);
    }
};

module.exports = { generateHint };
