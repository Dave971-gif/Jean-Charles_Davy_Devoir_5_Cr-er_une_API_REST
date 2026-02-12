///... PORT-PLAISANCE-ADMIN (Backend) ...\\\

|-- INFO --|

This project is a Management System for a Marina (Port de Plaisance). It's a full-stack administration tool with a complete CRUD (Create, Read, Update, Delete) system.
Built with:

Node.js & Express for the server logic.

MongoDB & Mongoose for the database management.

EJS (Embedded JavaScript) for dynamic HTML rendering.

JWT (JSON Web Token) & Cookies for secure authentication.

Bcrypt for secure password hashing.

Swagger for documentation.

|-- PREREQUISITES AND LAUNCH --|

Open the folder in VS Code.

Open the terminal and type:
cd app
npx nodemon app.js

Then click on launch server

You will be redirected on the index page, where you can create an account or connect one.
There you can use the following one, used for the test :
mail: test@port.fr
password: 123

|-- DOCUMENTATION --|

The project follows the MVC (Model-View-Controller) architecture.
All the business logic in the controllers folder is documented using JSDoc. Each function specifies its parameters, the associated HTTP route, and the access level (Public or Private).

|-- STYLE --|

It wasn't requested in this instructions, but I wanted to put some style in this site, in the respect of the domain, using colors to representate it.

|-- PLUS --|

This homework was a major challenge for me on the Backend side. Managing the relationships between Catways and Reservations, while securing access for Agents (Users), helped me understand how a server actually works, even if I still have difficulties to code this, I hope I will get better in the future on this part.
It was a long process, but really pleasant to build. As always, I put a lot of heart into this project. I used AI as a "peer-programmer" to help me understand complex bugs (like the headers already sent errors or EJS compilation issues), and the Helps from VSCodes to correct errors, which helped me learn so much more about data flow.
I'm not a pro yet, but I always do what I gotta do, and I'm proud of the result.