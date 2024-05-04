-- Table: public.user_settings

-- DROP TABLE IF EXISTS public.user_settings;

CREATE TABLE IF NOT EXISTS public.user_settings
(
    user_settings_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    category character varying(24) COLLATE pg_catalog."default",
    sub_category character varying(24) COLLATE pg_catalog."default",
    CONSTRAINT user_settings_pkey PRIMARY KEY (user_settings_id),
    CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_settings
    OWNER to postgres;