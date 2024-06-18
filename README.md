![image](https://github.com/limcw20/InFo/assets/157563230/b3b7ac5b-d957-4dce-8548-b3e56106df2e)# InFo
## Project Description
#### A change of approach in internet forum where users matchmake into discussion rooms to actively discuss their interests.

## Feature Goals
- A host user can create a post to start a discussion. This discussion will randomly appear on other users' discovery page.
- Users are able to choose to participate or pass on the discussion. If they pass, another discussion created from other host users will show up, and the cycle repeats.
- If the user participates, they will be brought into a chatroom to proceed discussion with the host user, along with other participating users.
- The host user also has authority to kick other users, set post visibility to public or just within participants, and lock/unlock posts. (WIP)


## Technologies
- PERN Stack (PostgreSQL, Express.js, React.js, Node.js)
- CSS
- Postman
- Cloudinary (image upload widget)

## Wireframe

#### Envisioned App on Discovery Page
![WF1](https://github.com/limcw20/InFo/assets/157563230/393c8991-a6e1-4032-b4ac-6d0968d16051)



#### Envisioned App on List of Chatroom Page
![WF2](https://github.com/limcw20/InFo/assets/157563230/675e0788-9278-48fc-a46b-9263ec8ded25)



#### Envisioned App on Chatroom Page
![WF3](https://github.com/limcw20/InFo/assets/157563230/fba245a5-d7f6-4e86-b650-f8ca0b7702fb)


## Entity Relationship Diagram
![GA Capstone Project](https://github.com/limcw20/InFo/assets/157563230/97d0486a-5cc3-4d96-b0f0-855a6106e9fd)


## Current State of the App

### As of now, the app functions well as intended. However, a rework of the look will be implemented, along with some extra features.

##### Users will need to register before being able to access the contents of the app. Some basic information is needed when registering. However, users will only need their username and password to login.
![image](https://github.com/limcw20/InFo/assets/157563230/62822546-7531-474a-9e88-966fcf1d07e7)
![image](https://github.com/limcw20/InFo/assets/157563230/f53897d3-20cb-4764-9e6b-034ec027a01a)
![image](https://github.com/limcw20/InFo/assets/157563230/d83eb6db-794f-4c7a-9308-f92f939b6e9e)



###### After login, the user will be directed to a list of chatroom the user is involved in. (Empty when account is just created as user has not participated in any)
![image](https://github.com/limcw20/InFo/assets/157563230/71aa9c56-2c31-4902-b443-47944d3c60f7)


###### On the Post InFo page, user will be able to initiate a discussion as such:
![image](https://github.com/limcw20/InFo/assets/157563230/8bae5207-7bad-4acf-a22e-202837b8214d)


###### The user can explore randomized posts initiated by others and decide whether to join in the discussion or not.

![image](https://github.com/limcw20/InFo/assets/157563230/99988551-173a-402c-8824-9fd0aaaf2876)


###### Upon joining, users can respond to the post like an internet forum. They can only delete their own comments. As the host of the post, they can kick other users or even delete the entire post itself.
![image](https://github.com/limcw20/InFo/assets/157563230/1a4fd1e2-b37c-4df7-9eac-f4c3c27ad909)
![image](https://github.com/limcw20/InFo/assets/157563230/0c1b3241-a221-4e17-99e5-59c7eb1a6b44)


###### Lastly, on the settings page, the user is able to edit basic information and add their top categories (for future features).
![image](https://github.com/limcw20/InFo/assets/157563230/81b75f6b-f000-46cf-bf40-ee9c643f3752)








## Getting Started

### Backend Setup

1. Run `npm init -y` to initialize the project and create a package.json file
2. Run `npm i -D nodemon` to allow automatic restart for development purposes
3. Install all the packages and dependencies `npm i dotenv express express-validator express-rate-limit jsonwebtoken bcrypt uuid cors helmet pg`
4. Create your .env file with the following variables:

```
DB_USER=
DB_HOST=
DATABASE=
PASSWORD=
PORT=

ACCESS_SECRET=
REFRESH_SECRET=

        
```

##### On Pgadmin4, you may use the SQL query file "InFo_SQL_Query" to execute the script from line 38 onwards. This will create all extensions, custom types, and tables in order.
![pgadmin1](https://github.com/limcw20/InFo/assets/157563230/ae141eda-6ed9-4f6b-9787-a74309aa259f)

##### Also, you may set a user to an admin on the query as such:

```
UPDATE users
SET is_admin = true
WHERE username = 'youradminusernamehere';
```
##### In the event that you do not use Pgadmin, individual script files have been created for you to execute them.

### Frontend Setup

1. Run `npm i` to install all the dependencies
2. Run `npm i vite` to install vite
3. Run `npm i react-router-dom` to install react-router-dom
4. Run `npm i jwt-decode` to install jwt-decode
5. Create your .env file with the following variables:

`VITE_SERVER=http://localhost:5001`

# Next Steps

- Rework on outlook with CSS/Frameworks
- Include chat settings feature (post visibility & max capacity)
- Add search feature and only show posts with post visibility to public
- Include user(host) renders such as "last online","status:online/offline", "top categories" shown on discover.




