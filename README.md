# Employee Tracker

## Project Description
This CLI application uses Node and MySQL to allow a user to view and manage departments, roles, and employees in a company.

## Tools Used to Create This Project
* JavaScript ES5 and ES6
* Node.js
* MySQL
* npm
    * inquirer for command line prompts
    * console.table for formatted printing of MySQL data
    * chalk for colored console.log notifications
    * figlet for header and footer text ascii art

## Installation

### Project Setup
* Clone the repository to your computer
* In the directory where the project is saved, make sure any required dependencies are installed. As necessary for your system and setup:
    * Install Node.js from their website
    * Initialize npm
        * type `npm init` in your command line
    * Type `npm install` in yor command line to install the packages as noted in the package.json file

### Database Setup
* Install MySQL from their website and follow the set up instructions
* Add MySQL to the system Environmental Variables
* Type `mysql -u root -p` in the command line in the project directory and press enter. Enter your password. 
* Type `source db/schema.sql` and press enter, then type `source db/seeds.sql` and press enter to create the database and seed it with data.
* In the db/database.js file of the project, enter your password into the password line as a string so Node.js will be able to connect to the database.

## Usage
* From the command line in the project directory, type `node index` to start the application.
* Make your selections from the menu and respond to the prompts to see how the database can be viewed and changed through the CLI application.

## Video Walkthrough
A video walkthrough of the application functionality is available [here](#).

