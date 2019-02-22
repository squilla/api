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
- getting user/artist objects
- updating a user/artists info
- deleting a user/artist 
### User Objects Contain
- _id
- firstName 
- lastName
- email
- password
- isArist
- favoriteArtist - array of favorited artists
- favoritedArt - array of liked art
###
**If isArtist is true user is an artist and also has:**
- nickname
- bio
- art
- favorites - users who favorited artist
### Get all users
returns all user and artist objects in an array
###
**Example Request:**

    GET "/api/users"


### Get Single User 
returns a single user object
###
**Example Request:**

    GET "/api/users/:id" // :id is equal to the users _id

### Update User/Artist Info
This route updates a users info, this also includes artists. 
###
**Example Request:**

    PATCH "/api/users/:id"  // id is equal to the users _id
### Delete User/Artist
This route deletes a user or artist from database
###
**Example Request:**

    DELETE "/api/users/:id" // id is equal to user _id

## Artists
**NOTE** Creating, updating and deleting artists is done in the users routes
###
Artists are a subset of user. Artist routes handle the following:
- Returing all artist objects (Artist objects were shown in the users section)
- returning single artist object
### Get all Artists 
returns an array of all artist objects
###
**Example Request:**

    GET "/api/artists"
### Get single artist
Returns single artist object
###
**Example Request:**

    GET "/api/artists/:id" // id equal to artists _id 
  