-- Table: public.chat_user

-- DROP TABLE IF EXISTS public.chat_user;

CREATE TABLE IF NOT EXISTS public.chat_user
(
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    is_superuser boolean,
    CONSTRAINT chat_user_pkey PRIMARY KEY (user_id, post_id),
    CONSTRAINT chat_user_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.post (post_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT chat_user_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT post_id FOREIGN KEY (post_id)
        REFERENCES public.post (post_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat_user
    OWNER to postgres;