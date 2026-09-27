CREATE TABLE IF NOT EXISTS samaritan_locations (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS samaritan_locations_updated_at_idx
    ON samaritan_locations (updated_at DESC);
CREATE INDEX IF NOT EXISTS samaritan_locations_coordinates_idx
    ON samaritan_locations (latitude, longitude);