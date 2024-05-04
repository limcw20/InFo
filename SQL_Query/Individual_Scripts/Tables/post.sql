-- Table: public.post

-- DROP TABLE IF EXISTS public.post;

CREATE TABLE IF NOT EXISTS public.post
(
    post_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    chat_settings_id uuid,
    post_title character varying(30) COLLATE pg_catalog."default",
    post_desc character varying(1000) COLLATE pg_catalog."default",
    post_img character varying(255) COLLATE pg_catalog."default",
    post_date date,
    category character varying(24) COLLATE pg_catalog."default",
    sub_category character varying(24) COLLATE pg_catalog."default",
    CONSTRAINT post_pkey PRIMARY KEY (post_id),
    CONSTRAINT chat_settings_id FOREIGN KEY (chat_settings_id)
        REFERENCES public.chat_settings (chat_settings_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.post
    OWNER to postgres;