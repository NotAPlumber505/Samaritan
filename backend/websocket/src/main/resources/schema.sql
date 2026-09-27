  CREATE TABLE IF NOT EXISTS emergencies (
      id             BIGSERIAL PRIMARY KEY,
      owner_user_id  BIGINT           NOT NULL,
      latitude       DOUBLE PRECISION NOT NULL,
      longitude      DOUBLE PRECISION NOT NULL,
      created_at     TIMESTAMPTZ      NOT NULL DEFAULT now()
  );