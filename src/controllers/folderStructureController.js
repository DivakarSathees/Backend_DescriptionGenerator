const { createFolderStructure } = require("../services/folderStructureService");


exports.generateStructure = async (req, res) => {
    const { solution } = req.body;

    if (!solution) {
        return res.status(400).json({ error: 'solution is required' });
    }

    try {
        // const Solution = await createSolution(description);
        const createStructure = await createFolderStructure(solution);
        console.log("hai"+createStructure);   
        if(createStructure == undefined)   {
        res.status(200).json({ status: "bad attempt" });
        }  else
        res.status(200).json({ createStructure });

    } catch (error) {
        res.status(500).json({ error: `Failed to generate Solution ${error}` });
    }
};
