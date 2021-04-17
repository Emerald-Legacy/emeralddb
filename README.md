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

## Start the application
1. To migrate your database to the latest schema, run ```yarn migrate:latest```
2. In the project root, run ```yarn start:all:dev```
3. The backend now starts on port 8080 while the frontend is started on port 3000. Hot reloading is enabled for both.

