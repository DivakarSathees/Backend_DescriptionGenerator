// const openai = require('../../config/gptConfig');
require('dotenv').config();
const Groq = require("groq-sdk");

// const { OpenAI} = require('openai');
// const apiKey = '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'

// const openai = new OpenAI({
//   apiKey: "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",
// });

const grop = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

exports.generateDescriptionWithGPT = async (projectType, complexity, technology, relationship, entityCount, operations, topic) => {

    console.log(projectType);
    
let prompt = '';
    
    // Switch statement or if-else to create custom prompts based on projectType and technology
    switch (projectType) {
        case 'WEB API':
            if (technology === 'ASP.NET Core') {
                prompt = `
                Generate a problem description in the following format for a ${complexity} ${projectType} project using ${technology} with ${entityCount} of relationship ${relationship} along with validations & custom exception & there should ${operations} operations on scenarion based topic - ${topic} (Take the below problem description only for your reference):
                dont give the below same project & it is only for you reference. give problem desription as per the above requirement statement
                    Develop a WEB API Project for Book Store Management
                Problem Statement: 
                Develop a WEB API project for a book store management system using ASP.NET Core. The API will provide services for managing books and authors with complete CRD operations. Your task is to design and implement the API based on the given requirements, focusing on action methods, controllers, endpoints, and appropriate status codes. Make sure to implement validation and exception handling for erroneous input, especially in cases of missing data or invalid book price.

                Models:

                Author.cs:

                AuthorId: An integer representing the unique identifier for each author (auto incremented)..
                Name: A string representing the name of the author.
                Biography: A string containing a brief biography of the author.
                Books(ICollection<Book>): 
                A collection of Book entities associated with the author. This is a one-to-many relationship where one author can have multiple books. It is Optional.
                This property is marked with [JsonIgnore] to prevent circular references during JSON serialization.
                Book.cs:
                BookId: An integer representing the unique identifier for each book (auto incremented)..
                Title: A string representing the title of the book.
                Genre: A string indicating the genre of the book.
                Price: A decimal representing the price of the book.
                AuthorId: An integer representing the foreign key linking to the Author entity. This establishes a many-to-one relationship where multiple books can be associated with one author.
                Author(Author): 
                A reference to the Author entity associated with the book. It is Optional.
                This property is marked with [JsonIgnore] to prevent circular references during JSON serialization.

               Using ApplicationDbContext for Author and Book Management. ApplicationDbContext must be present inside the Data folder. 
                    Namespace - dotnetapp.Data

                The ApplicationDbContext class acts as the primary interface between the application and the database, managing CRD (Create, Read, Delete) operations for Author entities and (Create, Read, Delete) operations for Book entities. This context class defines the database schema through its DbSet properties and manages the one-to-many relationship between Author and Book entities using the Fluent API.

                DbSet Properties:
                DbSet<Author> Authors: 
                Represents a collection of Author entities stored in the Authors table. Each Author can have multiple associated Book entries, defining the one-to-many relationship between Author and Book (i.e., one author can write many books).
                DbSet<Book> Books: 
                Represents the Books table in the database. Each Book is associated with a single Author, establishing the many-to-one relationship between Book and Author using the AuthorId foreign key.
                OnDelete(DeleteBehavior.Cascade): This is where the deletion behavior is configured. Cascade delete means that when an Author entity is deleted, all associated Book entities will also be automatically deleted from the database.

                Implement the logic in the controller:
                Controllers: Namespace: dotnetapp.Controllers
                AuthorController
                CreateAuthor([FromBody] Author author): 
                Adds a new author to the database. 
                Make a POST request to /api/Author with the author data in the request body.
                Upon successful creation, it returns a 201 Created with the location of the newly created author.
                Return Type: Task<ActionResult>
                SearchAuthorByName(string name): 
                Retrieves an author by their name. 
                Make a GET request to /api/Author/Search?name={authorName}.
                If the author is not found, it returns a 404 Not Found. 
                If found, it returns a 200 OK with the author details.
                Return Type: Task<ActionResult>
                BookController

                CreateBook([FromBody] Book book):
                Adds a new book to the database. 
                Make a POST request to /api/Book with the book data in the request body.
                If the AuthorId is not provided, it returns a 400 Bad Request with an error message. 
                If the book's Price is less than or equal to 0, it throws a custom PriceException.
                Upon successful creation, it returns a 201 Created with the location of the newly created book. 
                Return Type: Task<ActionResult>
                GetBooks():
                Retrieves a list of all books along with their associated author ids. 
                Make a GET request to /api/Book.
                If no books are found, it returns a 204 No Content. 
                Otherwise, it returns a 200 OK with a list of books and their related author ids.
                Return Type: Task<ActionResult>
                GetBook(int id):
                Retrieves a single book by its BookId along with its associated author id. 
                Make a GET request to /api/Book/{id}.
                If the book is not found, it returns a 404 Not Found. 
                If found, it returns a 200 OK with the book and its related author id.
                Return Type: Task<ActionResult>
                DeleteBook(int id):
                Deletes the book identified by id. 
                Make a DELETE request to /api/Book/{id}.
                If the book is not found, it returns a 404 Not Found. 
                Upon successful deletion, it returns 204 No Content.
                Return Type: Task<ActionResult>


                Exceptions:

                The PriceException is a custom class located in the dotnetapp.Exceptions folder.
                It is thrown when the Price of a book is less than or equal to 0. The exception provides the following message when triggered: "Price cannot be 0 or negative."


                Endpoints:

                Authors:

                POST /api/Author - Create a new author.
                GET/api/Author/Search?name={authorName} - Retrieve an author by their name.
                Books:

                GET /api/Book - Retrieve a list of all books, including their associated author ids.
                GET /api/Book/{id} - Retrieve a specific book by its ID, including its associated author id.
                POST /api/Book - Create a new book. Requires an AuthorId.
                DELETE /api/Book/{id} - Delete a book by its ID.


                Status Codes and Error Handling:

                204 No Content: Returned when no records are found for books or authors.

                200 OK: Returned when records are successfully retrieved.

                201 Created: Returned when a new book or author is successfully created.

                400 Bad Request: Returned when there are validation errors or mismatched IDs during update/create.

                404 Not Found: Returned when a book or author is not found during retrieval or deletion.

                `;
            } else if (technology === 'Node.js') {
                prompt = `
                Generate a problem description for a ${complexity} ${projectType} project using ${technology} with ${entityCount} entities in a ${relationship} relationship. 
                Implement error handling and ${operations} operations like Create, Read, Update, and Delete. Example: Develop a RESTful API for managing movies in a cinema, using MongoDB as the database. 
                Ensure validations like price restrictions and custom error responses for missing or invalid data.
                `;
            } else if (technology === 'Java'){

            }
            break;

        case 'Spring Boot':
            if (technology === 'Java') {
                prompt = `
                Generate a problem description in the following format for a ${complexity} ${projectType} project using ${technology} with ${entityCount} of relationship ${relationship} along with validations & custom exception & there should ${operations} operations on topic ${topic} (Take the below problem description only for your reference):
                dont give the below same project & it is only for you reference. give problem desription as per the above requirement statement
                Create a Spring Boot application with two entities: "Author" and "Book". An author can have multiple books, and many book can belong to only one author.  Implement a one-to-many bidirectional mapping between these entities using SpringBoot JPA. Utilize JPQL for retrieving details and incorporating handling for DuplicateAuthorException.
Functional Requirements:
Create folders named controller, model, repository, exception and service inside the WORKSPACE/springapp/src/main/java/com/examly/springapp.
Inside the controller folder, create classes named "AuthorController” and "BookController".
Inside the model folder,
Create a class named "Author" with the following attributes:
id  - int (auto-generated primary key)
name - String
email - String
phoneNumber - String
address - String
books - List<Book> (OneToMany, mappedBy = "author", JsonManagedReference)
Create another class named "Book" with the following attributes:

id - int(auto-generated primary key)
title - String
genre - String
publicationYear - int
isbn - String
price - double
author - Author (ManyToOne, JsonBackReference)
Implement getters, setters, and constructors for the Author and Book entities.

Inside the repository folder, create interfaces named “AuthorRepository” and  "BookRepository".

Inside the service folder, create interfaces named "AuthorService" and "BookService".

Inside the exception folder, create class named "DuplicateAuthorException".

Also, create classes AuthorServiceImpl and BookServiceImpl and it should implement the AuthorService and BookService.

API ENDPOINTS:

POST - "/author" - Returns response status 201 with author object on successful creation, In case of a DuplicateAuthorException, specifically when the author name already exists, it returns a status of 500 with an appropriate error message as "Author with name {authorName} already exists".

POST - "/book/author/{authorId}" - Returns response status 201 with book object on successfully mapping the book to the authorId or else 500.

GET - "/author/{authorId}" - Returns response status 200 with author object, which includes details of books on successful retrieval or else 404.

GET - "/book/getbyyear/{year}" -  Returns response status 200 with List<Book> object filtered by the publication year upon successful retrieval. If no books are found for the specified year, the endpoint returns a 404 status code. Use the @Query annotation in respective Repository class to get these details.

GET - "/book" -  Returns response status 200 with List<Book> object on successful retrieval or else 404.

PUT - "/book/{bookId}" - Returns response status 200 with updated book object on successful updation or else 404.


                `;
            }
            break;

        case 'MVC':
            if (technology === 'ASP.NET Core') {
                prompt = `
                Generate a problem description for a ${complexity} ${projectType} using ${technology}, involving ${entityCount} entities in a ${relationship} relationship. The project should focus on proper controller actions, model validation, custom exceptions, and ${operations} CRUD operations.
                Example: Create an MVC project for managing student records where one course can have multiple students. Include a DbContext, models for Course and Student, and form validation.
                `;
            } else if (technology === 'Spring Boot') {
                prompt = `
                Generate a problem description for a ${complexity} ${projectType} using ${technology}. The project should involve ${entityCount} entities in a ${relationship} relationship, with ${operations} CRUD operations and validation for fields.
                Example: Develop a Spring Boot MVC project for managing employee records, where departments can have multiple employees. Include service layer and proper input validation.
                `;
            }
            break;

        case 'Console Application':
            if (technology === 'C#') {
                prompt = `
                Generate a problem description for a ${complexity} ${projectType} using ${technology} with ${entityCount} entities in a ${relationship} relationship. Include validation and custom exception handling for ${operations} operations.
                Example: Build a Console Application for managing bank accounts, where each customer can have multiple accounts. Include methods for deposit, withdrawal, and balance checking with validation for negative amounts.
                `;
            } else if (technology === 'Java') {
                prompt = `
                Generate a problem description for a ${complexity} ${projectType} using ${technology}. The project should include ${operations} operations, relationships between ${entityCount} entities, and exception handling.
                Example: Develop a Java Console Application for managing a library system, where one author can have multiple books. Include methods for borrowing and returning books, with custom exceptions for overdue books.
                `;
            }
            break;

        // Add more project types and technologies as needed

        default:
            prompt = `
            Generate a problem description for a ${complexity} ${projectType} project using ${technology} with ${entityCount} entities in a ${relationship} relationship, 
            including ${operations} operations. Provide validation and custom exceptions where applicable.
            `;
    }


    try {
        console.log("try block");
        
        // Call OpenAI GPT-3 or GPT-4 API with the generated prompt
        const response = await grop.chat.completions.create({
            model: 'llama3-8b-8192',  // or 'gpt-4' if using GPT-4
            // prompt: prompt,
            messages: [
                        { role: "system", content: "You are a helpful assistant." },
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
    //     const response = await fetch('https://api.openai.com/v1/chat/completions',{
    //         method: 'POST',
    //               headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${apiKey}`
    //               },
    //               body: JSON.stringify({
    //                 model: "gpt-3.5-turbo-16k", // You can choose the GPT model you prefer
    //     messages: [
    //         prompt
    //     ],
    //     // max_tokens: 1000
    //     }),
    //     timeout: 15000
    // });
    // const completion = await response.json();
    // console.log(completion.choices[0]);
    // console.log(response.choices[0].message);
    
          

        return response.choices[0].message;
    } catch (error) {
        throw new Error('Error with GPT model text generation');
    }
};
