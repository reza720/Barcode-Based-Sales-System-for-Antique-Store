import sequelize from "../../../config/sequelize.js";
import { DataTypes } from "sequelize";

const Sale = sequelize.define("Sale", {
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    customerName:{
        type:DataTypes.STRING,
        allowNull: false
    },
    customerPhone:{
        type:DataTypes.STRING,
        allowNull: true
    },
    date: {
        type:DataTypes.DATEONLY,
        allowNull: false
    }
},{
    timestamps: true
});

export default Sale;