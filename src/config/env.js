import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({
    path: path.join(dirname, "../../.env")
});

const env = {
    server:{
        port:Number(process.env.PORT)
    },
    db:{
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        timeZone: process.env.DB_TIMEZONE
    },
    jwt:{
        accessToken:process.env.ACCESS_TOKEN
    }
};

export default env;


