const { generateTestcaseWithGPT } = require('../models/testcaseModel');

exports.createTestcase = async (description) => {
    try {
        console.log("serv");
        
        // Call the model to generate the Solution based on the given inputs
        const Solution = await generateTestcaseWithGPT(description);
        
        
        return Solution;
    } catch (error) {
        throw new Error(`Error generating Solution ${error}`);
    }
};
