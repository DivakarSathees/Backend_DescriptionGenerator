// const openai = require('../../config/gptConfig');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Groq = require("groq-sdk");

const AdmZip = require('adm-zip');

const grop = new Groq({
    apiKey: process.env.GROQ_API_KEY,

});

exports.generateTestcaseWithGPT = async (solution) => {

    
//     let prompt = `convert the solution in json string structure like below example & filecontent should be in single line string no need of multiple lines & split by double slash r & n
//     [
//      { "folderName": "Controllers", "fileName": "demo.cs", "filecontent": "\\r\\nusing Microsoft.AspNetCore.Builder;\\r\\nusing Microsoft.AspNetCore.Hosting;\\r\\nusing Microsoft.AspNetCore.Mvc;\\r\\nusing Microsoft.Extensions.Configuration;\\r\\nusing Microsoft.Extensions.DependencyInjection;\\r\\nusing dotnetapp.Data;\\r\\nusing Microsoft.EntityFrameworkCore;"},
//      { "folderName": "Project1", "fileName": "style.css", "filecontent": "body { \\r\\n font-family: Arial; \\r\\n}" },
//      { "folderName": "Project2", "fileName": "main.js", "filecontent": "console.log('Hello, Project 2');" }
//     ]    
//   there should be \\r\\n before each line in "filecontent" property
//     `;
let prompt = `Write 20 nunit testcases in json string structure for the provided solution ${solution} like below example & give full code in the filecontent - use reflextion 
folder name should be TestProject, & fileName should be UnitTest1.cs
     [
      { "folderName": "TestProject", "fileName": "UnitTest1.cs", "filecontent": "\\r\\nusing Microsoft.AspNetCore.Builder;\\r\\nusing Microsoft.AspNetCore.Hosting;\\r\\nusing Microsoft.AspNetCore.Mvc;\\r\\nusing Microsoft.Extensions.Configuration;\\r\\nusing Microsoft.Extensions.DependencyInjection;\\r\\nusing dotnetapp.Data;\\r\\nusing Microsoft.EntityFrameworkCore;"}
     ]    
   there should be \\r\\n before each line in "filecontent" property

   Take this below code only for your reference
   using NUnit.Framework;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using dotnetapp.Exceptions;
using System.Buffers;


namespace dotnetapp.Tests
{
    [TestFixture]
    public class AuthorControllerTests
    {
        private DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private ApplicationDbContext _context;
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://localhost:8080"); // Base URL of your API
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_dbContextOptions);
        }

       private async Task<int> CreateTestCustomerAndGetId()
        {
            var newCustomer = new Customer
            {
                Name = "Test Customer",
                Email = "test@example.com",
                Address = "123 Test Street"
            };

            var json = JsonConvert.SerializeObject(newCustomer);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/Customer", content);
            response.EnsureSuccessStatusCode();

            var createdCustomer = JsonConvert.DeserializeObject<Customer>(await response.Content.ReadAsStringAsync());
            return createdCustomer.CustomerId;
        }


       [Test]
        public async Task CreateCustomer_ReturnsCreatedCustomer()
        {
            // Arrange
            var newCustomer = new Customer
            {
                Name = "Test Customer",
                Email = "test@example.com",
                Address = "123 Test Street"
            };

            var json = JsonConvert.SerializeObject(newCustomer);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _httpClient.PostAsync("api/Customer", content);

            // Assert
            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);

            var responseContent = await response.Content.ReadAsStringAsync();
            var createdCustomer = JsonConvert.DeserializeObject<Customer>(responseContent);

            Assert.IsNotNull(createdCustomer);
            Assert.AreEqual(newCustomer.Name, createdCustomer.Name);
            Assert.AreEqual(newCustomer.Email, createdCustomer.Email);
            Assert.AreEqual(newCustomer.Address, createdCustomer.Address);
        }


       [Test]
        public async Task GetCustomersSortedByName_ReturnsSortedCustomers()
        {
            // Act
            var response = await _httpClient.GetAsync("api/Customer/SortedByName");

            // Assert
            response.EnsureSuccessStatusCode();
            var customers = JsonConvert.DeserializeObject<Customer[]>(await response.Content.ReadAsStringAsync());
            Assert.IsNotNull(customers);
            Assert.AreEqual(customers.OrderBy(c => c.Name).ToList(), customers);
        }

        [Test]
        public async Task CreateOrder_ReturnsCreatedOrder()
        {
            // Arrange
            int customerId = await CreateTestCustomerAndGetId(); // Dynamically create a valid Customer

            var newOrder = new Order
            {
                OrderDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                TotalAmount = 50.99M,
                CustomerId = customerId
            };

            var json = JsonConvert.SerializeObject(newOrder);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _httpClient.PostAsync("api/Order", content);

            // Assert
            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);

            var responseContent = await response.Content.ReadAsStringAsync();
            var createdOrder = JsonConvert.DeserializeObject<Order>(responseContent);

            Assert.IsNotNull(createdOrder);
            Assert.AreEqual(newOrder.OrderDate, createdOrder.OrderDate);
            Assert.AreEqual(newOrder.TotalAmount, createdOrder.TotalAmount);
            // Assert.IsNotNull(createdOrder.Customer);
            Assert.AreEqual(newOrder.CustomerId, createdOrder.CustomerId);
        }

      [Test]
        public async Task GetCustomerById_ReturnsCustomer()
        {
            // Arrange
            int customerId = await CreateTestCustomerAndGetId(); // Create a customer and get its ID

            // Act: Get the customer by ID and verify the response
            var response = await _httpClient.GetAsync($"api/Customer/{customerId}");
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode); // Check if the response is OK

            // Deserialize the customer object from the response
            var customer = JsonConvert.DeserializeObject<Customer>(await response.Content.ReadAsStringAsync());

            // Assert: Customer object should not be null
            Assert.IsNotNull(customer);
        }



        [Test]
        public async Task UpdateOrder_ReturnsNoContent()
        {
            // Arrange
            int customerId = await CreateTestCustomerAndGetId();
            var newOrder = new Order
            {
                OrderDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                TotalAmount = 50.99M,
                CustomerId = customerId
            };

            var json = JsonConvert.SerializeObject(newOrder);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/Order", content);
            var createdOrder = JsonConvert.DeserializeObject<Order>(await response.Content.ReadAsStringAsync());

            var updatedOrder = new Order
            {
                OrderId = createdOrder.OrderId,
                OrderDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd"),
                TotalAmount = 75.99M,
                CustomerId = customerId
            };

            var updateJson = JsonConvert.SerializeObject(updatedOrder);
            var updateContent = new StringContent(updateJson, Encoding.UTF8, "application/json");

            // Act
            var updateResponse = await _httpClient.PutAsync($"api/Order/{createdOrder.OrderId}", updateContent);

            // Assert
            Assert.AreEqual(HttpStatusCode.NoContent, updateResponse.StatusCode);
        }

        [Test]
        public async Task UpdateOrder_InvalidId_ReturnsNotFound()
        {
            // Arrange
            var updatedOrder = new Order
            {
                OrderId = 9999, // Non-existent ID
                OrderDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                TotalAmount = 50.99M
            };

            var json = JsonConvert.SerializeObject(updatedOrder);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _httpClient.PutAsync($"api/Order/{updatedOrder.OrderId}", content);

            // Assert
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }


        [Test]
        public async Task GetOrders_ReturnsListOfOrders()
        {
            // Act
            var response = await _httpClient.GetAsync("api/Order");

            // Assert
            response.EnsureSuccessStatusCode();
            var orders = JsonConvert.DeserializeObject<Order[]>(await response.Content.ReadAsStringAsync());

            Assert.IsNotNull(orders);
            Assert.IsTrue(orders.Length > 0);
            Assert.IsNotNull(orders[0].CustomerId); // Ensure each order has a customer loaded
        }

        [Test]
        public async Task GetCustomerById_InvalidId_ReturnsNotFound()
        {
            // Act
            var response = await _httpClient.GetAsync("api/Customer/999");

            // Assert
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Test]
        public void CustomerModel_HasAllProperties()
        {
            // Arrange
            var customer = new Customer
            {
                CustomerId = 1,
                Name = "Jane Doe",
                Email = "jane.doe@example.com",
                Address = "123 Main St",
                Orders = new List<Order>() // Ensure the Orders collection is properly initialized
            };

            // Act & Assert
            Assert.AreEqual(1, customer.CustomerId, "CustomerId does not match.");
            Assert.AreEqual("Jane Doe", customer.Name, "Name does not match.");
            Assert.AreEqual("jane.doe@example.com", customer.Email, "Email does not match.");
            Assert.AreEqual("123 Main St", customer.Address, "Address does not match.");
            Assert.IsNotNull(customer.Orders, "Orders collection should not be null.");
            Assert.IsInstanceOf<ICollection<Order>>(customer.Orders, "Orders should be of type ICollection<Order>.");
        }


        [Test]
        public void OrderModel_HasAllProperties()
        {
            // Arrange
            var customer = new Customer
            {
                CustomerId = 1,
                Name = "Jane Doe",
                Email = "jane.doe@example.com",
                Address = "123 Main St"
            };

            var order = new Order
            {
                OrderId = 100,
                OrderDate = "2024-09-12",
                TotalAmount = 99.99m,
                CustomerId = 1,
		Customer = customer
            };

            // Act & Assert
            Assert.AreEqual(100, order.OrderId, "OrderId does not match.");
            Assert.AreEqual("2024-09-12", order.OrderDate, "OrderDate does not match.");
            Assert.AreEqual(99.99m, order.TotalAmount, "TotalAmount does not match.");
            Assert.AreEqual(1, order.CustomerId, "CustomerId does not match.");
            Assert.IsNotNull(order.Customer, "Customer should not be null.");
            Assert.AreEqual(customer.Name, order.Customer.Name, "Customer's Name does not match.");
        }


        [Test]
        public void DbContext_HasDbSetProperties()
        {
            // Assert that the context has DbSet properties for Customers and Orders
            Assert.IsNotNull(_context.Customers, "Customers DbSet is not initialized.");
            Assert.IsNotNull(_context.Orders, "Orders DbSet is not initialized.");
        }


        [Test]
        public void CustomerOrder_Relationship_IsConfiguredCorrectly()
        {
            // Check if the Customer to Order relationship is configured as one-to-many
            var model = _context.Model;
            var customerEntity = model.FindEntityType(typeof(Customer));
            var orderEntity = model.FindEntityType(typeof(Order));

            // Assert that the foreign key relationship exists between Order and Customer
            var foreignKey = orderEntity.GetForeignKeys().FirstOrDefault(fk => fk.PrincipalEntityType == customerEntity);

            Assert.IsNotNull(foreignKey, "Foreign key relationship between Order and Customer is not configured.");
            Assert.AreEqual("CustomerId", foreignKey.Properties.First().Name, "Foreign key property name is incorrect.");

            // Check if the cascade delete behavior is set
            Assert.AreEqual(DeleteBehavior.Cascade, foreignKey.DeleteBehavior, "Cascade delete behavior is not set correctly.");
        }


        [Test]
        public async Task CreateOrder_ThrowsAmountException_ForNegativeAmount()
        {
            // Arrange
            var newOrder = new Order
            {
                OrderDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                TotalAmount = -10M,  // Invalid negative amount
                CustomerId = 1
            };

            var json = JsonConvert.SerializeObject(newOrder);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _httpClient.PostAsync("api/Order", content);

            // Assert
            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception

            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.IsTrue(responseContent.Contains("Order amount must be greater than 0."), "Expected error message not found in the response.");
        }

        [Test]
        public async Task CreateOrder_ThrowsAmountException_ForZeroAmount()
        {
            // Arrange
            var newOrder = new Order
            {
                OrderDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                TotalAmount = 0M,  // Invalid zero amount
                CustomerId = 1
            };

            var json = JsonConvert.SerializeObject(newOrder);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _httpClient.PostAsync("api/Order", content);

            // Assert
            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception

            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.IsTrue(responseContent.Contains("Order amount must be greater than 0."), "Expected error message not found in the response.");
        }


        [TearDown]
        public void Cleanup()
        {
            _httpClient.Dispose();
        }
    }
}
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
            max_tokens: 4770,
            temperature: 1,
            // "top_p": 1,
            // "stream": true,
            // "stop": null
        });

        const inputString = response.choices[0].message.content;
        console.log('inr '+inputString);
        
//         const jsonMatch = inputString.match(/(\[.*\])/s);
//         console.log("asd "+jsonMatch[0]);
        
//         let jsonResponse;
//         try{
//             // console.log("match "+ jsonMatch);
            
//         jsonResponse = JSON.parse(jsonMatch[0]);

//         } catch (error) {
//             console.error("Error parsing JSON:", error);
//         }


//         // Iterate through the JSON array and print folder names
        
        
// let jsonData;
// if (jsonResponse) {
//     try {

//         if (solution.toLowerCase().includes('java')) {
//             console.log('ready to create folder');
//         jsonResponse.forEach(fileData => {
//             const { folderName, fileName, filecontent } = fileData;
//             const zipFilePath = path.join(__dirname, "../../", 'springapp.zip'); // Update this to your zip file location

//             // Initialize adm-zip
//             const zip = new AdmZip(zipFilePath);

//             // Extract the zip to a specific folder
//             const extractedFolderPath1 = path.join(__dirname,"../../", 'springapp'); // Extracting to 'extracted' folder
//             zip.extractAllTo(extractedFolderPath1, true); // Extract all files to 'extractedFolderPath'
//             console.log(`Files extracted to: ${extractedFolderPath1}`);

//             const extractedFolderPath = path.join(__dirname, "../../springapp/springapp/src/main/java/com/examly/springapp", folderName); // Goes 2 levels up

//             // Ensure the extracted folder exists, if not, create it
//             if (!fs.existsSync(extractedFolderPath)) {
//                 fs.mkdirSync(extractedFolderPath, { recursive: true });
//                 console.log(`Folder created: ${extractedFolderPath}`);
//             }

//             // Create the file inside the extracted folder
//             const filePath = path.join(extractedFolderPath, fileName);
//             fs.writeFileSync(filePath, filecontent);
//             console.log(`File created: ${filePath}`);
//         });

//         } else if(solution.toLowerCase().includes('dotnet')) {
//         console.log('ready to create nunit');
//         jsonResponse.forEach(fileData => {
//             const { folderName, fileName, filecontent } = fileData;
//             const zipFilePath = path.join(__dirname, "../../", 'dotnetapp.zip'); // Update this to your zip file location

//             // Initialize adm-zip
//             // const zip = new AdmZip(zipFilePath);

//             // // Extract the zip to a specific folder
//             // const extractedFolderPath1 = path.join(__dirname,"../../", 'dotnetapp'); // Extracting to 'extracted' folder
//             // zip.extractAllTo(extractedFolderPath1, true); // Extract all files to 'extractedFolderPath'
//             // console.log(`Files extracted to: ${extractedFolderPath1}`);

//             const extractedFolderPath = path.join(__dirname, "../../dotnetapp/", folderName); // Goes 2 levels up

//             // Ensure the extracted folder exists, if not, create it
//             if (!fs.existsSync(extractedFolderPath)) {
//                 fs.mkdirSync(extractedFolderPath, { recursive: true });
//                 console.log(`Folder created: ${extractedFolderPath}`);
//             }

//             // Create the file inside the extracted folder
//             const filePath = path.join(extractedFolderPath, fileName);
//             fs.writeFileSync(filePath, filecontent);
//             console.log(`File created: ${filePath}`);
//         });
//     }


        
//     } catch (error) {
//         console.error("Error parsing JSON:", error);
//     }
// } else {
//     console.log("No JSON found in the string.");
// }
          
        
        
        return inputString;
    } catch (error) {
        throw new Error('Error with GPT model text generation');
    }
};
