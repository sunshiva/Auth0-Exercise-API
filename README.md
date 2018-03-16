# Auth0 Exercise Node.js API

## Overview

This document explains the implementation steps to configure Node.js API application to interact with the [Auth0 Exercise Demo Application](https://github.com/sunshiva/Auth0-Exercise-APP).

## Implementation

This folder includes the API implementation using Node.js and the [Express](http://expressjs.com/) framework.

## Prerequisites

* Auth0 account
* [Node Package Manager (NPM)](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/)

## Setup

### Dashboard

You will need to create an API using the Auth0 Dashboard called `CRUD Service` with the unique identifier `crud-api` (this is later used in the `audience` parameter of your Authorization URL). 
If you don't yet have an Auth0 account, [sign up](https://auth0.com/signup) for free.

The API needs two namespaced scopes:

* `read:customers`
* `create:customers`
* `delete:customers`

Also need to 

- Switch `Skip User Consent off` for the Organize Resource Server in Auth0 Dashboard
- Switch on `Allow Online Access` for the Organise Resource Server in Auth0 Dashboard

Rename the `.env.example` file to `.env`. Once you have renamed the file you should set the following values in this file:

- `{DOMAIN}`: Set this to the value of your Auth0 Domain. You can retrieve it from the *Settings* of your Client at the [Auth0 Dashboard](https://manage.auth0.com/#/clients).
- `{API_IDENTIFIER}`: Set this to the value of your API Identifier. You can retrieve it from the *Settings* of your API at the [Auth0 Dashboard](https://manage.auth0.com/#/apis).

## Deploy & Run

Open a terminal and navigate to the folder in which this README.md is (`/timesheets-api/node`). Install the required packages for the Node.js API by running:

```
npm i
```

Once the packages are installed, you can then run the server:

```
node server
```

