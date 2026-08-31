import sequelize from "../../../config/sequelize.js";
import { DataTypes } from "sequelize"; 
import Item from "./item.js";

const Photo = sequelize.define("Photo", {
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    itemId:{
        type:DataTypes.UUID,
        allowNull: false
    },
    path:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},{
    timestamps: true
});

Item.hasMany(Photo, {foreignKey: "itemId", onDelete: "CASCADE"});
Photo.belongsTo(Item, {foreignKey: "itemId"});

export default Photo;