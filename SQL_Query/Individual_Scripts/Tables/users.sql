-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    username character varying(24) COLLATE pg_catalog."default",
    user_password character varying(255) COLLATE pg_catalog."default",
    nickname character varying(24) COLLATE pg_catalog."default",
    first_name character varying(50) COLLATE pg_catalog."default",
    last_name character varying(50) COLLATE pg_catalog."default",
    gender gender_enum,
    account_status status_enum,
    last_online timestamp with time zone,
    post_count integer,
    profile_picture character varying(255) COLLATE pg_catalog."default",
    is_admin boolean DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;