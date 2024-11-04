// const openai = require('../../config/gptConfig');
require('dotenv').config();
const Groq = require("groq-sdk");

const grop = new Groq({
    apiKey: process.env.GROQ_API_KEY,

});

exports.generateSolutionWithGPT = async (description) => {

    // console.log(description);
    
    let prompt = `generate complete solution for this problem statement in the following JSON array format & give only solution no need of any extra text:
    [
  {
    "folderName": "dotnetapp/Controllers",
    "fileName": "indexController.cs",
    "filecontent": "<html><body><h1>Project 1</h1></body></html>"
  },
  {
    "folderName": "dotnetapp/Models",
    "fileName": "style.cs",
    "filecontent": "body { font-family: Arial; }"
  },
  {
    "folderName": "dotnetapp/Data",
    "fileName": "dbcontext.cs",
    "filecontent": "console.log('Hello, Project 2');"
  }
  ]    
    `;

    // if(description.toLowerCase().includes('webapi') || description.toLowerCase().includes('web api')|| description.toLowerCase().includes('dotnet') || description.toLowerCase().includes('asp')){
    //   prompt += `give as per dotnet 6.0, that is no need of startup.cs, give in program.cs`
    // }

    try {
        // Call OpenAI GPT-3 or GPT-4 API with the generated prompt
        const response = await grop.chat.completions.create({
            model: 'llama3-8b-8192',  // or 'gpt-4' if using GPT-4
            // prompt: prompt,
            messages: [
                        { role: "system", content: description },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
            // max_tokens: 2720,
            // temperature: 1,
            // "top_p": 1,
            // "stream": true,
            // "stop": null
        });

        inputString = response.choices[0].message.content;
        // console.log(inputString);
        
//         const jsonMatch = inputString.match(/(\[.*\])/s);
// let jsonData;
// if (jsonMatch) {
//     try {
//         const jsonString = jsonMatch[1]; // The matched JSON string
//         console.log(jsonString);
        
//         jsonData = JSON.parse(jsonString); // Parse the JSON string
//         console.log(jsonData); // Output the parsed JSON
//     } catch (error) {
//         console.error("Error parsing JSON:", error);
//     }
// } else {
//     console.log("No JSON found in the string.");
// }
          
        
        
        return response.choices[0].message;
    } catch (error) {
        throw new Error('Error with GPT model text generation');
    }
};
