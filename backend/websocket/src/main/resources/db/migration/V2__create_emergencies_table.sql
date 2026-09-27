CREATE TABLE emergencies (
    -- This sets the data type strictly to BIGINT (long) but tells
    -- PostgreSQL to auto-generate the value sequentially.
                       emergency_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       user_id BIGINT NOT NULL,
                        latitude DOUBLE PRECISION NOT NULL,
                       longitude DOUBLE PRECISION NOT NULL,
                        requires_911 BOOLEAN,
                        emergency_nature TEXT,
                        self_emergency TEXT,
                       description TEXT
);
