Code Climate Badge

[![Maintainability](https://api.codeclimate.com/v1/badges/a7102654cee73af9a6e2/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/booked-up-be/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/a7102654cee73af9a6e2/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/booked-up-be/test_coverage)

#  Booked Up

You can find the deployed project at [BookedUp.net](https://bookedup.net).

# Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/booked-up-fe/blob/master/README.md) for details on the fronend of our project and contributors to the BookedUp project.

# API Documentation

Backend delpoyed on Heroku. https://bookedup-pt9.herokuapp.com/ <br>

Getting started

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

🚫This is just an example. Replace this with your data model

#### 2️⃣ ORGANIZATIONS

---

```
{
  id: UUID
  name: STRING
  industry: STRING
  paid: BOOLEAN
  customer_id: STRING
  subscription_id: STRING
}
```

#### USERS

---

```
{
  id: UUID
  organization_id: UUID foreign key in ORGANIZATIONS table
  first_name: STRING
  last_name: STRING
  role: STRING [ 'owner', 'supervisor', 'employee' ]
  email: STRING
  phone: STRING
  cal_visit: BOOLEAN
  emp_visit: BOOLEAN
  emailpref: BOOLEAN
  phonepref: BOOLEAN
}
```

## 2️⃣ Actions

🚫 This is an example, replace this with the actions that pertain to your backend

`getOrgs()` -> Returns all organizations

`getOrg(orgId)` -> Returns a single organization by ID

`addOrg(org)` -> Returns the created org

`updateOrg(orgId)` -> Update an organization by ID

`deleteOrg(orgId)` -> Delete an organization by ID
<br>
<br>
<br>
`getUsers(orgId)` -> if no param all users

`getUser(userId)` -> Returns a single user by user ID

`addUser(user object)` --> Creates a new user and returns that user. Also creates 7 availabilities defaulted to hours of operation for their organization.

`updateUser(userId, changes object)` -> Updates a single user by ID.

`deleteUser(userId)` -> deletes everything dependent on the user

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

🚫 These are just examples, replace them with the specifics for your app
    
    *  STAGING_DB - optional development db for using functionality not available in SQLite
    *  NODE_ENV - set to "development" until ready for "production"
    *  JWT_SECRET - you can generate this by using a python shell and running import random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;*(-*=+)') for i in range(50)])
    *  SENDGRID_API_KEY - this is generated in your Sendgrid account
    *  stripe_secret - this is generated in the Stripe dashboard
    
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
