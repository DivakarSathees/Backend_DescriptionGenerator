const { createDescription } = require('../services/descriptionService');

exports.generateDescription = async (req, res) => {
    const { projectType, complexity, technology, relationship, entityCount, operations, topic } = req.body;

    if (!projectType || !complexity || !technology) {
        return res.status(400).json({ error: 'Project type, complexity, and technology are required' });
    }

    try {
        const description = await createDescription(projectType, complexity, technology, relationship, entityCount, operations, topic);
        res.status(200).json({ description });
    } catch (error) {
        res.status(500).json({ error: `Failed to generate description ${error}` });
    }
};
