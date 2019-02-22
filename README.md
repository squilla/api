# Squilla API 
This is the official api for Squilla App


# Features
Squilla backend currently has the following features:
- Users
  - Artists (as a subset of users)
- Art
- Authentication

## Authentication
Authentication routes handle the following:
- Sign up handles the creation of a user/artist 
- Signing in a user
- signing out a user
### Sign Up
The sign up route creates a user/artist and issues a jwt token.
###
**The Request Must Contain:**
- *firstName* - string
- *lastName* - string
- *email* - string
- *password*  - string
- *isArtist* - bool
**If isArtist is true, User also becomes an artist and requires the following:**
- *nickname* - the artists art name
- *bio* - short bio about artist 
###
**Example Request:**


    POST "/api/auth/sign-up"

### Sign In
Sign in checks if inputted credentials match user and returns a JWT token.
### 
**Request Body must contain:**
- *email* 
- *password*
###
**Example Request:**

    POST "/api/auth/sign-in"

### Sign Out
Removes a users cookie, signing a user out.
###
**Example Request:**

    GET "/api/auth/sign-out"

## Users
**Note** that creating users is done in the sign-up route and is not handled here
###
The user routes handle:
- getting user objects
- updating a user/artists info
- deleting a user/artist 
### Index 
returns all user and artist objects in an array
###
**Example Request:**

    GET "/api/users"

