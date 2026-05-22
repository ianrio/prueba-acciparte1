
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS reports, users, tenants CASCADE;


CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(60) NOT NULL UNIQUE
);


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users (tenant_id);


CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    tenant_id UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    first_name VARCHAR(120) NOT NULL,
    last_name VARCHAR(180) NOT NULL,
    place VARCHAR(200) NOT NULL,
    intervention_type VARCHAR(30) NOT NULL CHECK (
        intervention_type IN (
            'medica',
            'tecnica',
            'rescate',
            'logistica',
            'otra'
        )
    )
);

CREATE INDEX idx_reports_tenant_id ON reports (tenant_id);