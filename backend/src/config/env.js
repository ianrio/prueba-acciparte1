import 'dotenv/config';

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Variable de entorno obligatoria no definida: ${name}`);
    }
    return value;
}

export const env = {
    port:        Number(process.env.PORT || 3001),
    corsOrigin:  process.env.CORS_ORIGIN || 'http://localhost:5173',
    jwtSecret:   required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    db: {
        host:     process.env.PGHOST     || 'localhost',
        port:     Number(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE || 'acciparte',
        user:     process.env.PGUSER     || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
    },
};

