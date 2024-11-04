const { generateDescriptionWithGPT } = require('../models/descriptionModel');

exports.createDescription = async (projectType, complexity, technology, relationship, entityCount, operations, topic) => {
    try {
        console.log("serv");
        
        // Call the model to generate the description based on the given inputs
        const description = await generateDescriptionWithGPT(projectType, complexity, technology, relationship, entityCount, operations, topic);
        // console.log(description);
        
        return description;
    } catch (error) {
        throw new Error(`Error generating description ${error}`);
    }
};
