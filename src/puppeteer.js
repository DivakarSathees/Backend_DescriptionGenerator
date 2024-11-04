// // const fs = require('fs');
// // const path = require('path');
// // const puppeteer = require('puppeteer');

// // (async () => {
// //   const browser = await puppeteer.launch({ headless: false }); // Set to `true` to run without a visible browser
// //   const page = await browser.newPage();

// //   // Go to the VSCode IDE URL
// //   await page.goto('https://ide-baaeebabdbae318982204ebbcedeaabafive.premiumproject.examly.io/?folder=/home/coder/project/workspace', {
// //     waitUntil: 'networkidle2'
// //   });

// //   // Wait for the file explorer area to be ready for drag-and-drop
// //   await page.waitForSelector('.monaco-scrollable-element', { visible: true }); // Update with the correct selector

// //   // Define the path to the folder you want to upload
// //   const folderPath = path.resolve(__dirname, '../dotnetapp');

// //   // Check if the folder exists
// //   if (!fs.existsSync(folderPath)) {
// //     console.error('Folder does not exist:', folderPath);
// //     return;
// //   }



// //   // Upload the folder by setting files to the file input element
// //   const [fileChooser] = await Promise.all([
// //     page.waitForFileChooser(),
// //     page.click('.monaco-scrollable-element') // Update this selector based on the IDE’s upload button or file input
// //   ]);

// //   // Upload all files within the folder
// //   const files = fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
// //   console.log(files);
// //   await fileChooser.accept(files);

// //   console.log('Folder upload initiated');
// //   await page.waitForTimeout(5000); // Wait for upload to complete (adjust as necessary)

// //   await browser.close();
// // })();
// const puppeteer = require('puppeteer');
// const path = require('path');
// const fs = require('fs').promises;

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false, // Set to true if you don’t need to see the browser
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });
//   const page = await browser.newPage();

//   await page.goto('https://ide-baaeebabdbae318982204ebbcedeaabafive.premiumproject.examly.io/?folder=/home/coder/project/workspace', {
//     waitUntil: 'networkidle2'
//   });

//   console.log("Sleeping for 30 seconds...");
//     await sleep(30000);
//     console.log("Awake after 30 seconds!");

//   // Wait for the target element (the drag-and-drop area) to be available
//   const targetSelector = '.monaco-scrollable-element';
//  const ele = await page.waitForSelector(targetSelector);
// //   await page.click(targetSelector);

//   const element = await page.$(targetSelector);
//   await ele.click({ button: 'right' }); // Right-click
//   await sleep(10000);

//   const targetSelector1 = '.monaco-icon-label.folder-icon.workspace-name-dir-icon.angularapp-name-folder-icon.explorer-item';
//     await page.waitForSelector(targetSelector1);

//     // Click on the angularapp element
//     // await page.click(targetSelector1);
//   await sleep(3000);


//     // Optional: Take a screenshot after the click
//     // await page.screenshot({ path: 'angularapp_click.png' });
//     // console.log('Clicked on angularapp and captured screenshot as angularapp_click.png');

//     const dragAndDrop = async (sourcePath, targetSelector) => {
//         // Resolve the absolute path of the folder
//         const filePath = path.resolve(sourcePath);
//         console.log(filePath);
        
    
//         // Wait for the target element
//         const target = await page.$(targetSelector);
//         const targetBox = await target.boundingBox();
    
//         // Simulate mouse actions for drag-and-drop
//         await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
//         await page.mouse.down(); // Simulate mouse down
//         await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2); // Move mouse
//         await page.mouse.up(); // Simulate mouse up
//         await sleep(3000);

//       };
    
//       // Specify the folder you want to drag and drop
//     //   const folderPath = 'D:/path/to/your/folder'; // Change this to your folder path
    

//   // Directory path for `dotnetapp` folder
//   const folderPath = path.join(__dirname, '../dotnetapp');
//   await dragAndDrop(folderPath, targetSelector);


  
//   // Close the browser after some time for observation
//   setTimeout(async () => {
//     // await browser.close();
//   }, 5000); // Adjust time as needed
// })();


const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dragAndDropFolder = async (folderPath, targetSelector) => {
    // Resolve the absolute path of the folder
    const resolvedFolderPath = path.resolve(folderPath);
    
    // Check if the folder exists
    if (!fs.existsSync(resolvedFolderPath)) {
        throw new Error(`Folder does not exist: ${resolvedFolderPath}`);
    }

    // Launch Puppeteer browser and create a new page
    const browser = await puppeteer.launch({
            headless: false, // Set to true if you don’t need to see the browser
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          });
    const page = await browser.newPage();

    // Navigate to your target URL where the drag-and-drop will happen
  await page.goto('https://ide-baaeebabdbae318982204ebbcedeaabafive.premiumproject.examly.io/?folder=/home/coder/project/workspace', {
    waitUntil: 'networkidle2'
  });
    console.log("Sleeping for 30 seconds...");
    await sleep(30000);
    console.log("Awake after 30 seconds!");

    // Get the target element for dropping
    const target = await page.$(targetSelector);
//  const target = await page.waitForSelector(targetSelector);

    if (!target) {
        throw new Error(`Target element not found: ${targetSelector}`);
    }
    
    const targetElement = await target.evaluateHandle(el => el);
await page.screencast({path: 'exe.png'})
    // Read the contents of the folder
    const files = fs.readdirSync(resolvedFolderPath).map(file => {
        return path.join(resolvedFolderPath, file);
    });

    // Use page.evaluate to run JavaScript in the browser context
    await page.evaluate(async (target, files) => {
        const dataTransfer = new DataTransfer();

        for (const filePath of files) {
            const fileName = filePath.split('/').pop(); // Get file name
            const fileBlob = await fetch(`file://${filePath}`).then(res => res.blob()); // Create Blob from file

            // Create a File object and add it to the DataTransfer
            const file = new File([fileBlob], fileName);
            dataTransfer.items.add(file);

            // Simulate drag start for each file
            const dragStartEvent = new DragEvent('dragstart', { dataTransfer, bubbles: true, cancelable: true });
            target.dispatchEvent(dragStartEvent);

            // Simulate drop event
            const dropEvent = new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true });
            target.dispatchEvent(dropEvent);

            // Simulate drag end event
            const dragEndEvent = new DragEvent('dragend', { dataTransfer, bubbles: true, cancelable: true });
            target.dispatchEvent(dragEndEvent);
        }
    }, targetElement, files);

    // Close the browser
    // await browser.close();
};

// Usage
(async () => {
    const folderPath = path.join(__dirname, '../dotnetapp'); // Change this to your actual folder
    const targetSelector = '.monaco-scrollable-element'; // Change this to your actual target selector
    try {
        await dragAndDropFolder(folderPath, targetSelector);
        console.log('Folder dragged and dropped successfully!');
    } catch (error) {
        console.error('Error during drag and drop:', error.message);
    }
})();
