CREATE TABLE users (
    -- This sets the data type strictly to BIGINT (long) but tells
    -- PostgreSQL to auto-generate the value sequentially.
                       user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       ecdsa_public_key TEXT NOT NULL,
                       is_samaritan BOOLEAN NOT NULL DEFAULT FALSE,
                       push_token VARCHAR(255)
);
