const { generateSolutionWithGPT } = require('../models/solutionModel');

exports.createSolution = async (description) => {
    try {
        console.log("serv");
        
        // Call the model to generate the Solution based on the given inputs
        const Solution = await generateSolutionWithGPT(description);
        
        
        return Solution;
    } catch (error) {
        throw new Error(`Error generating Solution ${error}`);
    }
};
