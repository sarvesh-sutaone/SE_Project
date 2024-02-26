# Welcome to the readme section.

**First things first**

1) Run client:
    -> cd client
    -> npm run start

2) Run server:
    -> cd server
    -> npm run start

Server Background:

1) Models: MongoDB Schemas
2) Controllers: Business Logic
3) Routes: API Routes


Main File in server:
index.js:

-> We use app.use() methods with isAuthenticated middleware to call the api Routes mentioned.

### To Test Backend:
1) Either install Thunder Client extension or Postman extension on VSCode.
2) If the route does not require authorization:(no isAuthenticated middleware in index.js)
    -> Enter http://localhost:3001/<api-call> (Please check type of request (GET/POST etc))
    -> Hit send
    -> Voila it works

3) If route requires authorization:
    -> ensure frontend server is running
    -> sign in using google
    -> On successful sign in, you will be directed to home page
    -> Open Console (Cntl+Shift+I)
    -> Copy the idToken
    -> To run authorized calls, go to headers section (in Thunder Client / VSCode)
    -> Key: "authorization" (Should be THIS ONLY without quotes and spaces)
    -> Value: Paste the ID token.
    -> Enter the api call route as done previously.
    -> If method is a POST method, enter relevant values in the BODY in JSON Format 
    -> While entering values in JSON Format, please ensure the key is the same as that mentioned in the Model.
    -> Example: if UserModel stores user name as "name", please enter "name":"RandomGibberishStuff", and not
                "user_name":"..." or anything else (Don't try to be oversmart)
    -> If you did everything right:
            --> Voila, it works
    -> If you have any issue with the authentication part, remove the middleware isAuthenticated from index.js 
        for that particular function, and try again.

You have reached the end of Readme section, congrats.

Here's your medal. 🥇
