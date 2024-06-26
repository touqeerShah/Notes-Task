# To-Do app
You are challenged to do a simple To-Do app, using Node.JS (using Typescript
would be a bonus), where a user logs in, can post a note, can get/view his notes,
and can delete them, etc. No frontend is required (that would be a bonus too). The
idea is to use this app using Postman.

# Project Structure and Stack

## Overview

This application is built using Node.js with Express to create RESTful APIs. MongoDB is used as the primary database to store application data. For user management and authentication, Passport.js is utilized in conjunction with JWT tokens to secure API access.

## Project Divisions

The project is divided into two main parts:

1. **User Management**
2. **Task Management**

---

## User Management

The User Management module handles all operations related to users, including authentication, profile management, and account status.

- **Login**: 
  - Endpoint for user authentication using email and password.
  - Generates a JWT token upon successful authentication.

- **Register User**:
  - Endpoint for creating a new user account.
  - Stores user details in MongoDB.

- **Change Password**:
  - Allows users to update their password.
  - Requires old password verification.
  - Protected by JWT token authentication.

- **Get User Details**:
  - Fetches detailed information about the logged-in user.
  - Protected by JWT token authentication.

- **User Deactivate (Soft Delete)**:
  - Allows users to deactivate their account temporarily.
  - Marks the user account as inactive without deleting data.

- **Delete Account**:
  - Permanently deletes the user account.
  - Removes all associated tasks from the database.

---

## Task Management

The Task Management module covers all operations related to task creation, updates, status changes, and retrieval.

- **Create Task**:
  - Endpoint to create a new task.
  - Associates the task with the authenticated user.

- **Update Task**:
  - Allows users to update task details.
  - Requires task ID and updated data.

- **Filter Tasks**:
  - Provides filtering options based on date, status, and pagination limits.
  - Returns a list of tasks matching the criteria.

- **Get Individual Task Details**:
  - Fetches detailed information about a specific task.
  - Requires task ID.

- **Change Task Status**:
  - Allows changing the status of a task.
  - Status options include Pending, In-Process, and Complete.

- **Delete Task**:
  - Deletes a specified task from the database.
  - Requires task ID.

---

## Technology Stack

- **Backend Framework**: Node.js with Express (Typescript)
- **Database**: MongoDB
- **Authentication**: Passport.js with JWT tokens
- **Data Format**: JSON
- **Testing** : Mock

## Project Structure

```
└── 📁src
    └── app.ts
    └── 📁config
        └── appConfig.ts
        └── dbConfig.ts
    └── 📁controllers
        └── 📁task
            └── task.controller.ts
        └── 📁user
            └── auth.controller.ts
            └── user.controller.ts
    └── index.ts
    └── 📁interfaces
        └── 📁IAppConfig 
            └── index.ts
        └── 📁IDBConfig
            └── index.ts
        └── 📁ISessions
            └── index.ts
        └── 📁ITask
            └── index.ts
        └── 📁IToken
            └── index.ts
        └── 📁IUser
            └── index.ts
    └── 📁middlewares
        └── errorHandler.ts
        └── 📁validators
            └── task.validators.ts
            └── user.validators.ts
    └── 📁models
        └── index.ts
        └── 📁resetToken
            └── index.ts
        └── 📁sessions
            └── index.ts
        └── 📁task
            └── task.model.ts
        └── 📁user
            └── index.d.ts
            └── user.model.ts
    └── 📁passport
        └── index.ts
        └── passport.sessions.config.ts
    └── 📁routes
        └── index.ts
        └── 📁task
            └── index.ts
        └── 📁users
            └── auth.routes.ts
            └── error.routes.ts
            └── user.routes.ts
    └── 📁services
        └── auth.service.ts
        └── db.service.ts
        └── task.service.ts
        └── user.service.ts
    └── 📁tests
        └── 📁controllers
            └── authController.test.ts
            └── userController.test.ts
        └── 📁integration
            └── authIntegration.test.ts
            └── userIntegration.test.ts
        └── 📁services
            └── authService.test.ts
            └── userService.test.ts
    └── 📁utils
        └── constants.ts
        └── date.conveter.ts
        └── logger.ts
```

## Flow of Request 
Following diagram show the flow of API request on Background

![image](./public/task.png)

## API Details 
This table provides a comprehensive overview of all available APIs, including request and response formats, parameters, and potential errors.
| **API Name**      | **Description**                                                                                                            | **Endpoint**                                     | **Request**                                                                                                                                                                                                                                        | **Response**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | **Error**                                                                                                                                                                   |
|-------------------|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| regularRegister   | This API used by user to register in the app and used it wonderful feature                                                 | http://localhost:3000/api/auth/regularRegister   | Body (urlencoded)<br>`username: test1`<br>`email: test1@gmail.com`<br>`password: password123`<br>`firstName: test1`<br>`lastName: user1`<br>`functionName: regularRegister`                                                                      |     {<br>        "message": "User registered",<br>        "error": false,<br>        "user": {<br>            "email": "test4@gmail.com",<br>            "username": "test4",<br>            "firstName": "test4",<br>            "lastName": "test4",<br>            "isActivated": true,<br>            "_id": "667bc6c9ad62b9f147112e74"<br>        }<br>    }                                                                                                                                                                                                                                                                                                                                                                      |     {<br>        "message": "User already exists",<br>        "error": true<br>    }                                                                                         |
| login             | This API used for login user and get JWT token which later user to access other API's                                      | http://localhost:3000/api/auth/login             | Body (urlencoded)<br>`username: test1`<br>`password: password123`                                                                                                                                                                                  |     {<br>        "token": "Bearer TOKEN",<br>        "verified": true,<br>        "message": "successful login",<br>        "session": "PSzH7jKhLdJVj37s64CCtnb6Zy-8HXZB"<br>    }                                                                                                                                                                                                                                                                                                                                                                                                                                                             |     {<br>        "message": "Invalid User Or Password",<br>        "error": true<br>    }<br>    {<br>        "message": "Your Account is Deactivated",<br>        "error": true<br>    }       |
| statusChange      | This API used for soft-deactive account instead of delete everything                                                       | http://localhost:3000/api/user/userAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`functionName: statusChange`<br>`isActivated: false`                                                                                                                |     {<br>        "message": "Success",<br>        "error": false<br>    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |     {<br>        "verified": true,<br>        "message": "Session Expired expired!",<br>        "tokenData": {}<br>    }                                                                |
| deleteMyAccount   | This API used to delete user and it data as well                                                                           | http://localhost:3000/api/user/userAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`functionName: deleteMyAccount`                                                                                                                                     |     {<br>        "message": "Success",<br>        "error": false,<br>        "deleteResult": {<br>            "acknowledged": true,<br>            "deletedCount": 1<br>        }<br>    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |     {<br>        "message": "User not found",<br>        "error": true,<br>        "deleteResult": {<br>            "acknowledged": true,<br>            "deletedCount": 0<br>        }<br>    } |
| createTask        | This API is used to create new task to-do<br><br> Status must be one of "pending", "in-progress", or "completed"           | http://localhost:3000/api/task/taskAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`title: Job Task`<br>`description: Work on Task`<br>`dueDate: 2024-07-24`<br>`functionName: createTask`                                                           |     {<br>        "results": {<br>            "title": "job task",<br>            "description": "work on task",<br>            "createdBy": "667b39b9fcd083459b586612",<br>            "status": "pending",<br>            "dueDate": "2024-07-24T00:00:00.000Z",<br>            "_id": "667bcb918e99bbe41bc381a6",<br>            "createdAt": "2024-06-26T08:04:33.317Z",<br>            "updatedAt": "2024-06-26T08:04:33.317Z",<br>            "__v": 0<br>        },<br>        "message": "Success",<br>        "error": false<br>    }                                                                                                                                         |     {<br>        "error": true,<br>        "message": "invalid token or token expired"<br>    }                                                                                      |
| filterTask        | This API is used to fetch data  notes based on status or date of creations or update                                       | http://localhost:3000/api/task/taskAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`pageNo: 1`<br>`pageLimit: 10`<br>`status: pending`<br>`functionName: filterTask`<br>`startDate: 2024-06-21`<br>`endDate: 2024-06-25`                               |     {<br>        "message": "Tasks filtered successfully",<br>        "error": false,<br>        "results": [<br>            {<br>                "_id": "667b3a1ab2d2b50f8e9d3eba",<br>                "title": "job task",<br>                "description": "work on task",<br>                "createdBy": "667b39b9fcd083459b586612",<br>                "status": "pending",<br>                "dueDate": "2024-07-24T00:00:00.000Z",<br>                "createdAt": "2024-06-25T21:43:54.959Z",<br>                "updatedAt": "2024-06-25T21:43:54.959Z",<br>                "__v": 0<br>            }<br>        ],<br>        "pageTotal": 1,<br>        "currentPage": "1"<br>    } |     {<br>        "error": true,<br>        "message": "invalid token or token expired"<br>    }                                                                                      |
| updateTask        | This API is used to update existing notes/task                                                                             | http://localhost:3000/api/task/taskAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`title: Job Task`<br>`description: Work on Task`<br>`dueDate: 2024-07-29`<br>`functionName: updateTask`<br>`status: pending`<br>`_id: 667b366cb9baa5cc166d6ba9` |     {<br>        "message": "Task updated successfully",<br>        "error": false,<br>        "results": {<br>            "_id": "667b3a1ab2d2b50f8e9d3eba",<br>            "title": "job task",<br>            "description": "work on task",<br>            "createdBy": "667b39b9fcd083459b586612",<br>            "status": "in-progress",<br>            "dueDate": "2024-07-29T00:00:00.000Z",<br>            "createdAt": "2024-06-25T21:43:54.959Z",<br>            "updatedAt": "2024-06-25T21:43:54.959Z",<br>            "__v": 0<br>        },<br>        "pageTotal": 1<br>    }                                                                                           |     {<br>        "message": "Task not found",<br>        "error": true,<br>        "pageTotal": 0<br>    }                                                                              |
| getTaskDetails    | This API is used to get specific details of the task                                                                       | http://localhost:3000/api/task/taskAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`_id: 667b33bed26b9578115b6977`<br>`functionName: getTaskDetails`                                                                                               |     {<br>        "message": "Task details retrieved successfully",<br>        "error": false,<br>        "results": [<br>            {<br>                "_id": "667b3a1ab2d2b50f8e9d3eba",<br>                "title": "job task",<br>                "description": "work on task",<br>                "createdBy": "667b39b9fcd083459b586612",<br>                "status": "in-progress",<br>                "dueDate": "2024-07-29T00:00:00.000Z",<br>                "createdAt": "2024-06-25T21:43:54.959Z",<br>                "updatedAt": "2024-06-25T21:43:54.959Z",<br>                "__v": 0<br>            }<br>        ],<br>        "pageTotal": 1<br>    }                 |     {<br>        "message": "Task not found",<br>        "error": true,<br>        "pageTotal": 0<br>    }                                                                              |
| changeStatus      | This API allows changing the status of a task<br><br>Status must be one of "pending", "in-progress", or "completed"        | http://localhost:3000/api/task/taskAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`_id: 667b366cb9baa5cc166d6ba9`<br>`functionName: changeStatus`<br>`status: in-progress`                                                                        |     {<br>        "message": "Task status changed successfully",<br>        "error": false,<br>        "results": {<br>            "_id": "667b3a1ab2d2b50f8e9d3eba",<br>            "title": "job task",<br>            "description": "work on task",<br>            "createdBy": "667b39b9fcd083459b586612",<br>            "status": "completed",<br>            "dueDate": "2024-07-29T00:00:00.000Z",<br>            "createdAt": "2024-06-25T21:43:54.959Z",<br>            "updatedAt": "2024-06-25T21:43:54.959Z",<br>            "__v": 0<br>        },<br>        "pageTotal": 1<br>    }                                                                                      |     {<br>        "message": "Task not found",<br>        "error": true,<br>        "pageTotal": 0<br>    }                                                                              |
| deleteTask        | This API allows the user to delete the task from to-do list                                                                | http://localhost:3000/api/task/taskAPIRequest    | Request Headers<br>`Authorization: Bearer <token>`<br>**Body (urlencoded)**<br>`_id: 667b33bed26b9578115b6977`<br>`functionName: deleteTask`                                                                                                   |     {<br>        "message": "Success",<br>        "error": false,<br>        "deleteResult": {<br>            "acknowledged": true,<br>            "deletedCount": 1<br>        }<br>    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |     {<br>        "message": "Task not found",<br>        "error": true,<br>        "pageTotal": 0<br>    }                                                                              |





## Run APP
To run the app you need to setup `env` first , following are the step to do that.

### Step one 
Make sure you have following tools install in you machine
- Docker and Docker Compose (in case you have mongodb install in you machine or other mongodb setup is done not need for it ).
- NodeJS 
-
That it make sure you have setup env before run thr applications.



## Step two 
In case you want to run  Database (MongoDb) with Docker then run following command to Run it

```
docker-compose -f compose/docker-compose.yaml up -d 
```
This above command run docker in back ground.


## Step Three
Setup `.env` file please copy `.env-tem` and setup mongodb password you JWT, session secret

```
PORT=3000
NODE_ENV=development
JWT_SECRET = "Token secret 12345679 tast notes "
DEVELOPMENT_SECRET=""
PRODUCTION_SECRET=""
PRODUCTION_SESSIONID="sessionId"

DEV_MONGO_ADDRESS=""
DEV_MONGO_PORT=""
DEV_MONGO_DATABASE=""
DEV_MONGO_PASS=""
DEV_MONGO_USER=""

```

## Step Four (final step)
Run the backend server there are two ways it on your machine.
- Run with docker (which will not effect any depencency and env setup on your machine)
- Run with Local with NPM.

### Run with Docker
Run following command will create image and run application with docker

on root of the folder 
to start
```
docker-compose up -d
```

to  stop
```
docker-compose down
```

### Run with NPM
Run with `NPM` you have to install depencency local 

Run following command first 
```
npm install
```

then to run server 
```
npm run watch-deploy
```
application will run on port `3000`



## Postman
[Postman-Collection](./To-Do-Task.postman_collection.json)

```To used API Import postman API collection and used the wonderful app.```