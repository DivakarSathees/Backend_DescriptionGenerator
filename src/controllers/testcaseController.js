const { createTestcase } = require('../services/testcaseService');

exports.generateTestcases = async (req, res) => {
    const { solution } = req.body;

    if (!solution) {
        return res.status(400).json({ error: 'solution is required' });
    }

    try {
        const Solution = await createTestcase(solution);
        res.status(200).json({ Solution });
    } catch (error) {
        res.status(500).json({ error: `Failed to generate Solution ${error}` });
    }
};
