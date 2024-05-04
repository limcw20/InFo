-- Type: status_enum

-- DROP TYPE IF EXISTS public.status_enum;

CREATE TYPE public.status_enum AS ENUM
    ('online', 'offline');

ALTER TYPE public.status_enum
    OWNER TO postgres;
