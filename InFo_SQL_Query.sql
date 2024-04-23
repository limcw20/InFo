-- Select specific tables for quick reference

SELECT * FROM users

SELECT * FROM user_settings

SELECT users.*, user_settings.category, user_settings.sub_category FROM users
LEFT JOIN user_settings ON users.user_id = user_settings.user_id;

SELECT * FROM post

SELECT * FROM chat_settings

SELECT * FROM response

SELECT * FROM chatroom

SELECT * FROM chat_user

SELECT * FROM chat_list


-- Insert & delete test to ensure trigger function and delete cascade works

INSERT INTO users (username) VALUES ('chicken');

DELETE FROM users WHERE username = 'chicken';

Insert INTO post (user_id, post_title) VALUES ('0e56a60b-ae66-4cb4-84cc-9486f39199f1', 'hello');

DELETE FROM post WHERE post_id = '4d59722e-ce7d-4ab6-9c49-a6e6dd3527a8';

INSERT INTO chat_user (user_id, chatroom_id, is_superuser) VALUES ('0e56a60b-ae66-4cb4-84cc-9486f39199f1', 'f73cc075-8a20-48ac-9fc8-c00605598c36', 'TRUE')

INSERT INTO response (response_desc, user_id, chatroom_id) VALUES ('alibaba!!!!', '0e56a60b-ae66-4cb4-84cc-9486f39199f1', 'f73cc075-8a20-48ac-9fc8-c00605598c36')

INSERT INTO chat_list (user_id, chatroom_id) VALUES ('0e56a60b-ae66-4cb4-84cc-9486f39199f1', 'f73cc075-8a20-48ac-9fc8-c00605598c36')


SELECT * FROM chat_user WHERE user_id = '0e56a60b-ae66-4cb4-84cc-9486f39199f1' AND chatroom_id = 'f73cc075-8a20-48ac-9fc8-c00605598c36';


-- ** EXECUTE SCRIPT FROM THIS LINE ONWARDS **

-- Enable extensions for UUID

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define custom ENUM types

CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE status_enum AS ENUM ('online', 'offline');



-- TABLES


-- Create Users Table

CREATE TABLE users (
	user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username VARCHAR(24),
	user_password VARCHAR(24),
	nickname VARCHAR(24),
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	gender gender_enum,
	account_status status_enum,
	last_online TIMESTAMP WITH TIME ZONE,
	post_count INT,
	profile_picture BYTEA
);

-- CREATE user_settings Table

CREATE TABLE user_settings(
	user_id UUID PRIMARY KEY,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	category VARCHAR(24) DEFAULT 'none',
	sub_category VARCHAR(24) DEFAULT 'none'
	
);


-- Create post Table, reference to be inserted later on

CREATE TABLE post (
	post_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID,
	chat_settings_id UUID,
	post_title VARCHAR(30),
	post_desc VARCHAR(1000),
	post_img BYTEA,
    post_date DATE
);


-- Create chat_settings Table, reference to be inserted later on

CREATE TABLE chat_settings(
	chat_settings_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID,
	chatroom_id UUID,
	post_is_public BOOL DEFAULT FALSE,
	post_is_locked BOOL DEFAULT FALSE
);


-- Create response Table, reference to be inserted later on
CREATE TABLE response(
	response_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID,
	chatroom_id UUID,
	response_desc VARCHAR(1000),
	response_date DATE,
	response_img BYTEA
);


-- Create chatroom Table
CREATE TABLE chatroom (
    chatroom_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID,
    post_id UUID,
    FOREIGN KEY (response_id) REFERENCES response(response_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);


-- create chat_user Table

CREATE TABLE chat_user (
    user_id UUID,
    chatroom_id UUID,
    is_superuser BOOL,
    PRIMARY KEY (user_id, chatroom_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (chatroom_id) REFERENCES chatroom(chatroom_id)
);

-- create chat_list Table

CREATE TABLE chat_list (
	chat_list_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatroom_id UUID,
    user_id UUID,
    FOREIGN KEY (chatroom_id) REFERENCES chatroom(chatroom_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- FKs THAT REQUIRE ORDER
-- Create references
ALTER TABLE post
ADD CONSTRAINT user_id
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE post
ADD CONSTRAINT chat_settings_id
FOREIGN KEY (chat_settings_id) REFERENCES chat_settings(chat_settings_id) ON DELETE CASCADE;

ALTER TABLE chat_settings
ADD CONSTRAINT user_id_chatroom_id
FOREIGN KEY (user_id, chatroom_id) REFERENCES chat_user(user_id, chatroom_id) ON DELETE CASCADE;

ALTER TABLE response
ADD CONSTRAINT user_id_chatroom_id
FOREIGN KEY (user_id, chatroom_id) REFERENCES chat_user(user_id, chatroom_id) ON DELETE CASCADE;



-- ALL TRIGGERS BELOW

-- Create trigger function to insert into user_settings table after a new row is inserted into users table
CREATE OR REPLACE FUNCTION insert_user_settings_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id) VALUES (NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on the users table to execute the trigger function after insert
CREATE TRIGGER insert_user_settings_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_user_settings_trigger_function();



--



-- Create trigger function to insert into chat_settings table after a new row is inserted into chat_user table
CREATE OR REPLACE FUNCTION insert_chat_settings_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO chat_settings (user_id, chatroom_id) VALUES (NEW.user_id, NEW.chatroom_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on the chat_user table to execute the trigger function after insert
CREATE TRIGGER insert_chat_settings_trigger
AFTER INSERT ON chat_user
FOR EACH ROW
WHEN (NEW.is_superuser = TRUE) -- if the user is a superuser then insert
EXECUTE FUNCTION insert_chat_settings_trigger_function();


--


-- Create trigger function to insert into response table after a new row is inserted into chat_user table
CREATE OR REPLACE FUNCTION insert_response_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO response (user_id, chatroom_id) VALUES (NEW.user_id, NEW.chatroom_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on the chat_user table to execute the trigger function after insert
CREATE TRIGGER insert_response_trigger
AFTER INSERT ON chat_user
FOR EACH ROW
EXECUTE FUNCTION insert_response_trigger_function();


--

-- Create trigger into chatroom table
CREATE OR REPLACE FUNCTION insert_chatroom_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO chatroom (post_id) VALUES (NEW.post_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on the post table to execute the trigger function after insert
CREATE TRIGGER insert_chatroom_trigger
AFTER INSERT ON post
FOR EACH ROW
EXECUTE FUNCTION insert_chatroom_trigger_function();




-- Create trigger on chat_list to only allow viewing chatrooms if user_id matches
CREATE OR REPLACE FUNCTION insert_chat_list_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM chat_user WHERE user_id = NEW.user_id AND chatroom_id = NEW.chatroom_id
    ) THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'User is not authorized to view this chatroom.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to execute 
CREATE TRIGGER insert_chat_list_trigger
BEFORE INSERT ON chat_list
FOR EACH ROW
EXECUTE FUNCTION insert_chat_list_trigger_function();

--


-- Check if the user is authorized to join the chatroom

CREATE OR REPLACE FUNCTION check_user_authorization_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM chat_user WHERE user_id = NEW.user_id AND chatroom_id = NEW.chatroom_id
    ) THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'User is not authorized to join the chatroom';
    END IF;
END;
$$ LANGUAGE plpgsql;