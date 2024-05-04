-- Table: public.chat_settings

-- DROP TABLE IF EXISTS public.chat_settings;

CREATE TABLE IF NOT EXISTS public.chat_settings
(
    chat_settings_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    post_is_public boolean DEFAULT false,
    post_is_locked boolean DEFAULT false,
    CONSTRAINT chat_settings_pkey PRIMARY KEY (chat_settings_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat_settings
    OWNER to postgres;