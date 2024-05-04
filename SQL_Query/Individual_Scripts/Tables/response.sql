-- Table: public.response

-- DROP TABLE IF EXISTS public.response;

CREATE TABLE IF NOT EXISTS public.response
(
    response_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    post_id uuid,
    response_desc character varying(1000) COLLATE pg_catalog."default",
    response_date timestamp without time zone,
    response_img character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT response_pkey PRIMARY KEY (response_id),
    CONSTRAINT user_id_post_id FOREIGN KEY (user_id, post_id)
        REFERENCES public.chat_user (user_id, post_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.response
    OWNER to postgres;