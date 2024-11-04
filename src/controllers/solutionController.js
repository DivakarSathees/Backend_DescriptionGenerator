const { createSolution } = require('../services/solutionService');

exports.generateSolution = async (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ error: 'description is required' });
    }

    try {
        const Solution = await createSolution(description);
        res.status(200).json({ Solution });
    } catch (error) {
        res.status(500).json({ error: `Failed to generate Solution ${error}` });
    }
};
