Code Climate Badge

[![Maintainability](https://api.codeclimate.com/v1/badges/a7102654cee73af9a6e2/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/booked-up-be/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/a7102654cee73af9a6e2/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/booked-up-be/test_coverage)

#  Booked Up

You can find the deployed project at [BookedUp.net](https://bookedup.net).

# Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/booked-up-fe/blob/master/README.md) for details on the fronend of our project and contributors to the BookedUp project.

# API Documentation

Backend delpoyed on Heroku. https://bookedup-pt9.herokuapp.com/ <br>

#### Getting Started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm run server** to start the local server
- **npm test** to start server using testing environment

# Node.js

We chose this framework because

-    Familiarity. 
-    Integration with PostgreSQL.
-    Very wide library selection with very active communities and support. 
-    Performance and scalability.

# Endpoints

Postman was used for local and deployed enpoint testing. It also creates great endpoint documentation!

[Postman Enpoint Documentation](https://documenter.getpostman.com/view/10085035/SzmcbzVS?version=latest)

#### Register/Login Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| POST   | `/auth/register       ` | all users      | Registration page. Confirmation email sent to registered email. Must be verified.
| POST   | `/auth/login          ` | all users      | Login page.                                  |

#### Administrator Routes (see Postman docs for more routes)

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| POST   | `/auth/admin/register`  | admin users    | Admin users register with email, verification link sent to registered email. Must be verified.
| POST   | `/auth/admin/login`     | admin users    | Admin login page.                            |

#### User Routes (see Postman docs for more routes)

| Method | Endpoint                | Access Control      | Description                                        |
| ------ | ----------------------- | ------------------- | -------------------------------------------------- |
| GET    | `/users`                | all users           | Returns info for the logged in user.               |
| GET    | `/users/:id`            | all users           | Returns info for a single user.                    |
| GET    | `/users/:userId`        | owners, supervisors | Returns info for a single user.                    |

#### Author Content / Content Library (see Postman docs for more routes)

| Method | Endpoint                | Access Control      | Description                                        |
| ------ | ----------------------- | ------------------- | -------------------------------------------------- |
| POST   | `/author-content`       | all users           | Create author content.                             |
| GET    | `/content-library`      | all users           | Returns info for all works.                        |
| GET    | `/content-library/:id`  | all users           | Returns info for single work.                      |

# Data Model

#### USERS

---

```
{
  "user_type": string [fan, author, agent], not nullable
  "first_name": string, not nullable
  "last_name": string, not nullable
  "display_name": string, not nullable
  "password": string, not nullable
  "email": string, not nullable, unique
  "city": string
  "state": string
  "country": string
  "avatar_url": string
  "email_verification": boolean, default to true
  "password_reset:" boolean, defaut to false
  "created_at": timestamp
}
```

#### Admin

---

```
{
  "user_type": string [admin], not nullable
  "first_name": string, not nullable
  "last_name": string, not nullable
  "password": string, not nullable
  "email": string, not nullable
  "email_verification": boolean, default to true
  "password_reset:" boolean, defaut to false
  "created_at": timestamp
}
```

#### Agent

---

```
{
  "agent_type": string
  "agency_name": string
  "agency_address": string
  "agency_phone_number": string
  "agency_email": string
  "user_id": integer, references id in user table
}
```

#### Author Content

---

```
{
  "title": string
  "content_url": string
  "created_at": timestamp
  "last_updated": timestamp
  "user_id": integer, references id in user table
}
```

#### Content Library 

---

```
{
  "user_id": integer, not nullable, references id in user table
  "author_content_id": integer, not nullable, references id in author_content table
}
```

## Actions

Basic actions used in this project. For specific actions, see respective models. 

`get()` -> Returns all users, author works, messages

`find()` -> Returns all users, author works, messages

`findById(id)` -> Returns a single user/work/message by ID

`add()` -> Adds user, work, message

`update(id)` -> Update a user, work, message by ID

`delete(id)` -> Delete a user, work , message by ID


## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

Create a .env file that includes the following:

    *  JWT_SECRET - set for local auth testing
    *  DB_ENV - production
    *  DATABASE_URL - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  DATABASE_URL_DEV - for local testing of endpoint
    *  DATABASE_URL_TEST - for local testing of endpoint
    *  MAILGUN_API_KEY - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  MAILGUN_DOMAIN - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  EMAILADDRESS='bookedup.pt9@gmail.com'
    *  COOKIE_SECRET - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  SESSION_SECRET - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  CLOUDINARY_API - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  CLOUDINARY_SECRET - can get from Heroku deployed backend ("settings" --> "Config Vars")
    *  CLOUDINARY_NAME - can get from Heroku deployed backend ("settings" --> "Config Vars")
    
## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

 **If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**
 - Check first to see if your issue has already been reported.
 - Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
 - Create a live example of the problem.
 - Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes,  where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).
