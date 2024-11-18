// const { downloadService } = require("../services/downloadService");
// const path = require('path');
// exports.downloadController = async (req, res) => {
//     const fileName = req.query.fileName;
//     const folderPath = path.join(__dirname, "../OutputSolution/", "dotnetapp");
//     const localZipPath = path.join(__dirname, "demo.zip");
    
//     if (!fileName) {
//         return res.status(400).json({ error: 'fileName is required' });
//     }
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
//     res.setHeader("Content-Type", "application/zip");
    

//     try {
//         const downloadedZip = await downloadService(fileName, folderPath, localZipPath);
//         res.status(200).json({ downloadedZip });
//     } catch (error) {
//         res.status(500).json({ error: `Failed to generate Solution ${error}` });
//     }
// };


// controllers/downloadController.js
const path = require('path');
const downloadService = require('../services/downloadService');

exports.downloadController = async (req, res) => {
    const fileName = req.query.fileName;
    // const folderPath = path.join(__dirname, "../../OutputSolution/", "dotnetapp");
    const folderPath = path.join("/opt/render/project/src/OutputSolution/", "dotnetapp");
    // const localZipPath = path.join(__dirname, "../demo.zip");
    
    // Validate the fileName parameter
    if (!fileName) {
        return res.status(400).json({ error: 'fileName is required' });
    }

    try {
        // Pass 'res' to the service to handle streaming
        await downloadService(fileName, folderPath, res);
    } catch (error) {
        res.status(500).json({ error: `Failed to generate Solution: ${error.message}` });
    }
};
