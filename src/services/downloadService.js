// const path = require('path');
// const archiver = require("archiver");
// const fs = require("fs");
// exports.downloadService = async (fileName, folderPath, localZipPath) => {
//     try {
//         console.log(fileName);
        
//         if (!fs.existsSync(folderPath)) {
//             res.status(404).send({ error: "Folder not found" });
//             return;
//         }
    
//         // Set headers for the response
//         res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
//         res.setHeader("Content-Type", "application/zip");
    
//         // Create a write stream for the local zip file
//         const output = fs.createWriteStream(localZipPath);
    
//         // Create a zip stream
//         const archive = archiver("zip", { zlib: { level: 9 } });
    
//         // Handle archive errors
//         archive.on("error", (err) => {
//             console.error("Error creating archive:", err);
//             res.status(500).send({ error: "Failed to create zip archive" });
//         });
    
//         // Save the archive locally
//         archive.pipe(output);
    
//         // Also pipe the archive to the response
//         archive.pipe(res);
    
//         // Append the folder to the archive
//         archive.directory(folderPath, false);
    
//         // Finalize the archive
//         archive.finalize();
    
//         // Log once the file is written locally
//         output.on("close", () => {
//             console.log(`Local ZIP created at: ${localZipPath}`);
//         });        
        
        
//         return "File downloaded";
//     } catch (error) {
//         throw new Error(`Error generating Solution ${error}`);
//     }
// };

const fs = require('fs');
const archiver = require('archiver');

const downloadService = async (fileName, folderPath, res) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(`File Name: ${fileName}`);
            console.log(`Folder Path: ${folderPath}`);
            // console.log(`Local Zip Path: ${localZipPath}`);

            // Check if the folder exists
            if (!fs.existsSync(folderPath)) {
                res.status(404).send({ error: "Folder not found" });
                return reject(new Error("Folder not found"));
            }

            // Set headers for the response
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
            res.setHeader("Content-Type", "application/zip");

            // const output = fs.createWriteStream(localZipPath);

            // Create a zip archive
            const archive = archiver("zip", { zlib: { level: 9 } });

            // Handle archive errors
            archive.on("error", (err) => {
                console.error("Error creating archive:", err);
                res.status(500).send({ error: "Failed to create zip archive" });
                return reject(err);
            });

            // Pipe the archive data to both the response and the local file
            archive.pipe(res);
            archive.pipe(output);

            // Append the folder to the archive
            archive.directory(folderPath, false);

            // Finalize the archive (finish zipping)
            archive.finalize();

            // Resolve the promise once the local file is fully written
            output.on("close", () => {
                // console.log(`Local ZIP created at: ${localZipPath}`);
                resolve("File downloaded and saved locally.");
            });

            // Handle write stream errors
            output.on("error", (err) => {
                console.error("Error writing local zip file:", err);
                reject(err);
            });

        } catch (error) {
            console.error("Error in downloadService:", error);
            reject(error);
        }
    });
};

module.exports = downloadService;
