const fs = require('fs');
const path = require('path');
const { generatesolutionJsonWithGPT } = require('../models/jsonModel');

exports.createFolderStructure = async (Solution) => {
    try {      
        // console.log(Solution);
        const JSONSolution = await generatesolutionJsonWithGPT(Solution);
        
        return JSONSolution;
    } catch (error) {
        throw new Error(`Error generating Solution ${error}`);
    }
};
