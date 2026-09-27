CREATE TABLE IF NOT EXISTS emergencies (
    id              BIGSERIAL PRIMARY KEY,
    owner_user_id   BIGINT           NOT NULL,
    requested_at    TIMESTAMPTZ      NOT NULL DEFAULT now(),
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    requires_911    BOOLEAN,
    emergency_type  TEXT,
    self_emergency  TEXT,
    description     TEXT
);

-- Bring an older version of the table up to date (safe to run every startup)
ALTER TABLE emergencies ADD COLUMN IF NOT EXISTS requested_at   TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE emergencies ADD COLUMN IF NOT EXISTS requires_911   BOOLEAN;
ALTER TABLE emergencies ADD COLUMN IF NOT EXISTS emergency_type TEXT;
ALTER TABLE emergencies ADD COLUMN IF NOT EXISTS self_emergency TEXT;
ALTER TABLE emergencies ADD COLUMN IF NOT EXISTS description    TEXT;
ALTER TABLE emergencies ALTER COLUMN latitude  DROP NOT NULL;
ALTER TABLE emergencies ALTER COLUMN longitude DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_emergencies_lat_lng ON emergencies (latitude, longitude);
