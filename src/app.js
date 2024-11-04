const express = require('express');
const descriptionRoutes = require('./routes/descriptionRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const testcasesRoutes = require('./routes/testcasesRoutes');
require('dotenv').config();
const cors = require('cors');


const app = express();
app.use(cors({ origin: 'https://forntend-weightagesplit-1.onrender.com' }));



app.use(express.json());

app.use('/api/descriptions', descriptionRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/testcases', testcasesRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// import OpenAI from "openai";
// import Groq from "groq-sdk";
// // const { OpenAI} = require('openai');

// const openai = new OpenAI({
//     apiKey: "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",

// });
// const grop = new Groq({
//     apiKey: "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",

// });
// // console.log(openai);

// const prompt = `
//     Generate a problem description in the following format for a intermediate webapi project using ASP.NET Core (Take the below problem description only for your reference):
//     dont give the below same project
//     Develop a WEB API Project for Book Store Management

// Problem Statement: 

// Develop a WEB API project for a book store management system using ASP.NET Core. The API will provide services for managing books and authors with complete CRD operations. Your task is to design and implement the API based on the given requirements, focusing on action methods, controllers, endpoints, and appropriate status codes. Make sure to implement validation and exception handling for erroneous input, especially in cases of missing data or invalid book price.

// Models:

// Author.cs:

// AuthorId: An integer representing the unique identifier for each author (auto incremented)..
// Name: A string representing the name of the author.
// Biography: A string containing a brief biography of the author.
// Books(ICollection<Book>): 
// A collection of Book entities associated with the author. This is a one-to-many relationship where one author can have multiple books. It is Optional.
// This property is marked with [JsonIgnore] to prevent circular references during JSON serialization.


// Book.cs:

// BookId: An integer representing the unique identifier for each book (auto incremented)..
// Title: A string representing the title of the book.
// Genre: A string indicating the genre of the book.
// Price: A decimal representing the price of the book.
// AuthorId: An integer representing the foreign key linking to the Author entity. This establishes a many-to-one relationship where multiple books can be associated with one author.
// Author(Author): 
// A reference to the Author entity associated with the book. It is Optional.
// This property is marked with [JsonIgnore] to prevent circular references during JSON serialization.


// Using ApplicationDbContext for Author and Book Management. ApplicationDbContext must be present inside the Data folder. 

// 	Namespace - dotnetapp.Data



// The ApplicationDbContext class acts as the primary interface between the application and the database, managing CRD (Create, Read, Delete) operations for Author entities and (Create, Read, Delete) operations for Book entities. This context class defines the database schema through its DbSet properties and manages the one-to-many relationship between Author and Book entities using the Fluent API.



// DbSet Properties:

// DbSet<Author> Authors: 
// Represents a collection of Author entities stored in the Authors table. Each Author can have multiple associated Book entries, defining the one-to-many relationship between Author and Book (i.e., one author can write many books).
// DbSet<Book> Books: 
// Represents the Books table in the database. Each Book is associated with a single Author, establishing the many-to-one relationship between Book and Author using the AuthorId foreign key.
// OnDelete(DeleteBehavior.Cascade): This is where the deletion behavior is configured. Cascade delete means that when an Author entity is deleted, all associated Book entities will also be automatically deleted from the database.


// Implement the logic in the controller:

// Controllers: Namespace: dotnetapp.Controllers

// AuthorController

// CreateAuthor([FromBody] Author author): 
// Adds a new author to the database. 
// Make a POST request to /api/Author with the author data in the request body.
// Upon successful creation, it returns a 201 Created with the location of the newly created author.
// Return Type: Task<ActionResult>
// SearchAuthorByName(string name): 
// Retrieves an author by their name. 
// Make a GET request to /api/Author/Search?name={authorName}.
// If the author is not found, it returns a 404 Not Found. 
// If found, it returns a 200 OK with the author details.
// Return Type: Task<ActionResult>
// BookController

// CreateBook([FromBody] Book book):
// Adds a new book to the database. 
// Make a POST request to /api/Book with the book data in the request body.
// If the AuthorId is not provided, it returns a 400 Bad Request with an error message. 
// If the book's Price is less than or equal to 0, it throws a custom PriceException.
// Upon successful creation, it returns a 201 Created with the location of the newly created book. 
// Return Type: Task<ActionResult>
// GetBooks():
// Retrieves a list of all books along with their associated author ids. 
// Make a GET request to /api/Book.
// If no books are found, it returns a 204 No Content. 
// Otherwise, it returns a 200 OK with a list of books and their related author ids.
// Return Type: Task<ActionResult>
// GetBook(int id):
// Retrieves a single book by its BookId along with its associated author id. 
// Make a GET request to /api/Book/{id}.
// If the book is not found, it returns a 404 Not Found. 
// If found, it returns a 200 OK with the book and its related author id.
// Return Type: Task<ActionResult>
// DeleteBook(int id):
// Deletes the book identified by id. 
// Make a DELETE request to /api/Book/{id}.
// If the book is not found, it returns a 404 Not Found. 
// Upon successful deletion, it returns 204 No Content.
// Return Type: Task<ActionResult>


// Exceptions:

// The PriceException is a custom class located in the dotnetapp.Exceptions folder.
// It is thrown when the Price of a book is less than or equal to 0. The exception provides the following message when triggered: "Price cannot be 0 or negative."


// Endpoints:

// Authors:

// POST /api/Author - Create a new author.
// GET/api/Author/Search?name={authorName} - Retrieve an author by their name.
// Books:

// GET /api/Book - Retrieve a list of all books, including their associated author ids.
// GET /api/Book/{id} - Retrieve a specific book by its ID, including its associated author id.
// POST /api/Book - Create a new book. Requires an AuthorId.
// DELETE /api/Book/{id} - Delete a book by its ID.


// Status Codes and Error Handling:

// 204 No Content: Returned when no records are found for books or authors.

// 200 OK: Returned when records are successfully retrieved.

// 201 Created: Returned when a new book or author is successfully created.

// 400 Bad Request: Returned when there are validation errors or mismatched IDs during update/create.

// 404 Not Found: Returned when a book or author is not found during retrieval or deletion.



// Note:

// Use swagger/index to view the API output screen in 8080 port.
// Don't delete any files in the project environment.


// Commands to Run the Project:

// cd dotnetapp
// Select the dotnet project folder

// dotnet restore
// This command will restore all the required packages to run the application.

// dotnet run
// To run the application in port 8080 (The settings preloaded click 8080 Port to View)

// dotnet build
// To build and check for errors

// dotnet clean
// If the same error persists clean the project and build again



// For Entity Framework Core:

// To use

// Entity Framework :

// Install EF:

// dotnet new tool-manifest

// dotnet tool install --local dotnet-ef --version 6.0.6

// --Then use dotnet dotnet-ef instead of dotnet-ef.

//  dotnet dotnet-ef

// --To check the EF installed or not

// dotnet dotnet-ef migrations add "InitialSetup"

// --command to setup initial creating of tables mentioned iin DBContext

// dotnet dotnet-ef database update

// --command to update the database

// Note:

// Use the below sample connection string to connect the MsSql Server

//  private string connectionString = "User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False";


//     `;

// const completion = await grop.chat.completions.create({
//     model: "llama3-8b-8192",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: prompt,
//         },
//     ],
// });

// console.log(completion.choices[0].message);