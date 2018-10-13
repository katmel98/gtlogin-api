# gtlogin-api

## Description

GTLogin API is part of an effort to create a framework that allow, in a simple manner, to create quickly a simple login service.

The effort is build upon three simple packages:

(1) GTLogin API: a simple but complete authentication/registration/authorization REAT API. (created)
(2) GTLogin: a simple frontend to allow users authenticate and register into the database. (In process ...)
(3) GTAdmin: an administrative backoffice to allow users: (In process ...)
    a. User's CRUD and management
    b. Groups CRUD and management
    c. Roles CRUD and management
    d. Permission CRUD and management

## Installation

In order to install the GTLogin API, follow the next steps:

* git clone https://geddeontech@bitbucket.org/geddeontech/gtlogin-api.git
* cd gtlogin-api
* npm install

## Running the app

At this moment, we are not provinding 'production' environment. You can use/modify the present code to achieve 'production' state, meanwhile, you can use it in development mode to test all functionality and create your own version.

```bash
# development
$ npm run start:dev

```

The framework runs on :3000 port, you can modify it in the configuration file.

## Structure 

The most important directory is `src`, there live all framework's code.

```
gtlogin-api
+-- src
|   +-- auth
|   |   +-- dto
|   |   |   +-- login-user.dto.ts
|   |   |   +-- refresh-token.dto.ts
|   |   |   +-- reject-token.dto.ts
|   |   +-- interfaces
|   |   |   +-- jwt-payload.interface.ts
|   |   +-- passport
|   |   |   +-- http.strategy.ts
|   |   |   +-- jwt.strategy.ts
|   |   +-- auth.controller.ts
|   |   +-- auth.module.ts
|   |   +-- auth.service.ts
|   +-- common
|   |   +-- decorators
|   |   |   +-- roles.decorators.ts
|   |   +-- guards
|   |   |   +-- roles.guard.ts
|   |   +-- middlewares
|   |   |   +-- headers.middleware.ts
|   |   |   +-- logger.middleware.ts
|   |   +-- pipes
|   |   |   +-- generate-id.pipe.ts
|   +-- config
|   |   +-- config.ts
|   |   +- dev.config.ts
|   +-- groups
|   |   +-- dto
|   |   |   +-- create-group.dto.ts
|   |   |   +-- groups.dto.ts
|   |   |   +-- update-group.dto.ts
|   |   +-- interfaces
|   |   |   +-- group.interface.ts
|   |   +-- schemas
|   |   |   +-- group.schema.ts
|   |   +-- groups.controller.ts
|   |   +-- groups.module.ts
|   |   +-- groups.service.ts
|   +-- permissions
|   |   +-- dto
|   |   |   +-- create-permissions.dto.ts
|   |   |   +-- rule.dto.ts
|   |   |   +-- rules.dto.ts
|   |   |   +-- update-permission.dto.ts
|   |   +-- interfaces
|   |   |   +-- permission.interface.ts
|   |   |   +-- rule.interface.ts
|   |   +-- schemas
|   |   |   +-- permission.schema.ts
|   |   +-- permissions.controller.ts
|   |   +-- permissions.module.ts
|   |   +-- permissions.service.ts
|   +-- roles
|   |   +-- dto
|   |   |   +-- create-role.dto.ts
|   |   |   +-- permissions.dto.ts
|   |   |   +-- roles.dto.ts
|   |   |   +-- update-role.dto.ts
|   |   |   +-- user-roles.dto.ts
|   |   +-- interfaces
|   |   |   +-- role.interface.ts
|   |   +-- schemas
|   |   |   +-- role.schema.ts
|   |   +-- roles.controller.ts
|   |   +-- roles.module.ts
|   |   +-- roles.service.ts
|   +-- users
|   |   +-- dto
|   |   |   +-- create-user.dto.ts
|   |   |   +-- tokens.dto.ts
|   |   |   +-- update-user.dto.ts
|   |   +-- interfaces
|   |   |   +-- user.interface.ts
|   |   |   +-- token.interface.ts
|   |   +-- schemas
|   |   |   +-- token.schema.ts
|   |   |   +-- user.schema.ts
|   |   +-- users.controller.ts
|   |   +-- users.module.ts
|   |   +-- users.service.ts
|   +-- app.controller.ts
|   +-- app.module.ts
|   +-- app.service.ts
|   +-- main.hmr.ts
|   +-- main.ts
```

## Dependencies

GTLogin API used following dependencies (check package.json for a complete list):

### Framework and Libraries

* NestJS (https://docs.nestjs.com/)
* Mongoose (https://mongoosejs.com/docs/)
* Swagger (https://swagger.io/)

### Database

#### NoSql Database
MongoDB (https://www.mongodb.com/)

## License

MIT
