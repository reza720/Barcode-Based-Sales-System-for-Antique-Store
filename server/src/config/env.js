import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.join(process.cwd(), '.env'),
});

const env = {
    server: {
        port: Number(process.env.PORT),
    },
    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        timeZone: process.env.DB_TIMEZONE,
    },
};

export default env;
