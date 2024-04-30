-- Select specific tables for quick reference

UPDATE users
SET is_admin = true
WHERE username = 'edmund';

SELECT * FROM users

SELECT * FROM user_settings

SELECT * FROM post
WHERE post_id = '1bbb00e3-3b70-461a-9cbc-ceef0b983f78'

SELECT * FROM chat_user

SELECT * FROM chat_settings

SELECT * FROM response
WHERE post_id = '1bbb00e3-3b70-461a-9cbc-ceef0b983f78'


-- DROP TABLES FOR TESTING



DROP TABLE chat_settings CASCADE;

DROP TABLE chat_user CASCADE;

DROP TABLE post CASCADE;

DROP TABLE response CASCADE;

DROP TABLE user_settings CASCADE;

DROP TABLE users CASCADE;

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
	username VARCHAR(24) UNIQUE,
	user_password VARCHAR(255),
	nickname VARCHAR(24),
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	gender gender_enum,
	account_status status_enum,
	last_online TIMESTAMP WITH TIME ZONE,
	post_count INT,
	profile_picture BYTEA,
	is_admin BOOLEAN DEFAULT FALSE
);

-- CREATE user_settings Table

CREATE TABLE user_settings(
	user_settings_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID,
	category VARCHAR(24),
	sub_category VARCHAR(24),
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
	
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
	post_is_public BOOL DEFAULT FALSE,
	post_is_locked BOOL DEFAULT FALSE
);


-- Create response Table, reference to be inserted later on
CREATE TABLE response(
	response_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID,
	post_id UUID,
	response_desc VARCHAR(1000),
	response_date TIMESTAMP ,
	response_img BYTEA
);




-- create chat_user Table

CREATE TABLE chat_user (
    user_id UUID,
    post_id UUID,
    is_superuser BOOL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);


-- FKs THAT REQUIRE ORDER
-- Create references
ALTER TABLE post
ADD CONSTRAINT user_id
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

ALTER TABLE post
ADD CONSTRAINT chat_settings_id
FOREIGN KEY (chat_settings_id) REFERENCES chat_settings(chat_settings_id) ON DELETE CASCADE;

ALTER TABLE response
ADD CONSTRAINT user_id_post_id
FOREIGN KEY (user_id, post_id) REFERENCES chat_user(user_id, post_id) ON DELETE CASCADE;

ALTER TABLE chat_user
ADD CONSTRAINT post_id
FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE;


