-- Type: gender_enum

-- DROP TYPE IF EXISTS public.gender_enum;

CREATE TYPE public.gender_enum AS ENUM
    ('male', 'female', 'other', 'Male', 'Female', 'Other', 'Others');

ALTER TYPE public.gender_enum
    OWNER TO postgres;
