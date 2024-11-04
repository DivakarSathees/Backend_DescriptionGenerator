// const openai = require('../../config/gptConfig');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Groq = require("groq-sdk");

const AdmZip = require('adm-zip');

const grop = new Groq({
    apiKey: process.env.GROQ_API_KEY,

});

exports.generatesolutionJsonWithGPT = async (solution) => {

    
//     let prompt = `convert the solution in json string structure like below example & filecontent should be in single line string no need of multiple lines & split by double slash r & n
//     [
//      { "folderName": "Controllers", "fileName": "demo.cs", "filecontent": "\\r\\nusing Microsoft.AspNetCore.Builder;\\r\\nusing Microsoft.AspNetCore.Hosting;\\r\\nusing Microsoft.AspNetCore.Mvc;\\r\\nusing Microsoft.Extensions.Configuration;\\r\\nusing Microsoft.Extensions.DependencyInjection;\\r\\nusing dotnetapp.Data;\\r\\nusing Microsoft.EntityFrameworkCore;"},
//      { "folderName": "Project1", "fileName": "style.css", "filecontent": "body { \\r\\n font-family: Arial; \\r\\n}" },
//      { "folderName": "Project2", "fileName": "main.js", "filecontent": "console.log('Hello, Project 2');" }
//     ]    
//   there should be \\r\\n before each line in "filecontent" property
//     `;
let prompt = `convert the solution in json string structure like below example & give full code in the filecontent
each filecontent value should be placed in a single line with properly escaped double quotes.
     [
      { "folderName": "Controllers", "fileName": "demo.cs", "filecontent": "\\r\\nusing Microsoft.AspNetCore.Builder;\\r\\nusing Microsoft.AspNetCore.Hosting;\\r\\nusing Microsoft.AspNetCore.Mvc;\\r\\nusing Microsoft.Extensions.Configuration;\\r\\nusing Microsoft.Extensions.DependencyInjection;\\r\\nusing dotnetapp.Data;\\r\\nusing Microsoft.EntityFrameworkCore;"},
      { "folderName": "Models", "fileName": "style.css", "filecontent": "body { \\r\\n font-family: Arial; \\r\\n}" },
      { "folderName": "Data", "fileName": "main.js", "filecontent": "console.log('Hello, Project 2');" }
     ]    
   there should be \\r\\n before each line in "filecontent" property
     `;

    try {
        // Call OpenAI GPT-3 or GPT-4 API with the generated prompt
        const response = await grop.chat.completions.create({
            model: 'llama3-8b-8192',  // or 'gpt-4' if using GPT-4
            // prompt: prompt,
            messages: [
                        { role: "system", content: solution },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
            max_tokens: 6000,
            temperature: 1,
            // "top_p": 1,
            // "stream": true,
            // "stop": null
        });

        const inputString = response.choices[0].message.content;
        console.log('inr '+inputString);
        
        const jsonMatch = inputString.match(/(\[.*\])/s);
        console.log("asd "+jsonMatch[0]);
        
        let jsonResponse;
        try{
            // console.log("match "+ jsonMatch);
            
        jsonResponse = JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }


        // Iterate through the JSON array and print folder names
        
        
let jsonData;
if (jsonResponse) {
    try {

        if (solution.toLowerCase().includes('java')) {
            console.log('ready to create folder');
        jsonResponse.forEach(fileData => {
            const { folderName, fileName, filecontent } = fileData;
            const zipFilePath = path.join(__dirname, "../../", 'springapp.zip'); // Update this to your zip file location

            // Initialize adm-zip
            const zip = new AdmZip(zipFilePath);

            // Extract the zip to a specific folder
            const extractedFolderPath1 = path.join(__dirname,"../../", 'springapp'); // Extracting to 'extracted' folder
            zip.extractAllTo(extractedFolderPath1, true); // Extract all files to 'extractedFolderPath'
            console.log(`Files extracted to: ${extractedFolderPath1}`);

            const extractedFolderPath = path.join(__dirname, "../../springapp/springapp/src/main/java/com/examly/springapp", folderName); // Goes 2 levels up

            // Ensure the extracted folder exists, if not, create it
            if (!fs.existsSync(extractedFolderPath)) {
                fs.mkdirSync(extractedFolderPath, { recursive: true });
                console.log(`Folder created: ${extractedFolderPath}`);
            }

            // Create the file inside the extracted folder
            const filePath = path.join(extractedFolderPath, fileName);
            fs.writeFileSync(filePath, filecontent);
            console.log(`File created: ${filePath}`);
        });

        } else if(solution.toLowerCase().includes('dotnet')) {
        console.log('ready to create folder');
        jsonResponse.forEach(fileData => {
            const { folderName, fileName, filecontent } = fileData;
            const zipFilePath = path.join(__dirname, "../../", 'dotnetapp.zip'); // Update this to your zip file location

            // Initialize adm-zip
            const zip = new AdmZip(zipFilePath);

            // Extract the zip to a specific folder
            const extractedFolderPath1 = path.join(__dirname,"../../OutputSolution/", 'dotnetapp'); // Extracting to 'extracted' folder
            // if (fs.existsSync(extractedFolderPath1)) {
            //     fs.rmSync(extractedFolderPath1, { recursive: true, force: true });
            //     console.log(`Existing folder deleted: ${extractedFolderPath1}`);
            //   }
            zip.extractAllTo(extractedFolderPath1, true); // Extract all files to 'extractedFolderPath'
            console.log(`Files extracted to: ${extractedFolderPath1}`);

            const extractedFolderPath = path.join(__dirname, "../../OutputSolution/dotnetapp/dotnetapp", folderName); // Goes 2 levels up

            // Ensure the extracted folder exists, if not, create it
            if (!fs.existsSync(extractedFolderPath)) {
                fs.mkdirSync(extractedFolderPath, { recursive: true });
                console.log(`Folder created: ${extractedFolderPath}`);
            }

            // Create the file inside the extracted folder
            const filePath = path.join(extractedFolderPath, fileName);
            fs.writeFileSync(filePath, filecontent);
            console.log(`File created: ${filePath}`);
        });
    }


        
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
} else {
    console.log("No JSON found in the string.");
}
          
        
        
        return jsonResponse;
    } catch (error) {
        throw new Error('Error with GPT model text generation', error);
    }
};
