import { Sequelize } from "sequelize";
import env from "./env.js";

const sequelize = new Sequelize(
    env.db.name,
    env.db.user,
    env.db.password,{
        host: env.db.host,
        dialect: "mysql",
        logging: false,
        timezone: env.db.timeZone
    }
);

export default sequelize;