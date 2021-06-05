# FiveringsDB - Node Edition (aka EmeraldDB)

## Prerequisites:
To run the application you need:
* Node version 14.15.1 or higher
* A local Postgres database

## Set Up:

### Install yarn globally
``` npm install yarn -g ```


### Install react-scripts globally
``` npm install react-scripts -g```

### Install backend packages
```yarn install```

### Install frontend packages
```cd client```
```yarn install```

### Check out the fiveringsdb-data repo from Github
Check out https://github.com/fatihi/fiveringsdb-data and save it somewhere on your computer.

### Copy Environment File
Copy '.env.template' from the root of the project and paste it exactly there as '.env'
Adjust the environment variables to use your local Postgres database and point to the 'json' directory of your fiveringsdb-data repo
If you want to access Admin features (such as importing data) as well as the deckbuilder, you will need an Auth0 instance that you can authenticate with. Insert your Client ID and Auth0 Domain in the .env file 

## Start the application
1. To migrate your database to the latest schema, run ```yarn migrate:latest```
2. In the project root, run ```yarn start:server:dev``` to start the backend on port 8080
3. In the 'client' folder, run ```yarn start``` to start the frontend on port 3000

## How to Import Data
1. Log into the application once to create your user in the database (requires Auth0 setup)
2. In the 'roles' column of the 'users' table, enter ```data_admin``` for your user and save those changes
3. You should be able to access the Admin page of the application now, where you can use the Import Data button to read json files from the fiveringsdb-data repo
4. Reload the page to see the imported cards, packs, cycles, etc...


