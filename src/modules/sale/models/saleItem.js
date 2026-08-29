import sequelize from "../../../config/sequelize.js";
import { DataTypes, UUIDV4 } from "sequelize";
import Item from "../../item/models/item.js";
import Sale from "./sale.js";

const SaleItem = sequelize.define("SaleItem", {
    id:{
        type:DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    itemId:{
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    saleId:{
        type:DataTypes.UUID,
        allowNull: true
    }
},{
    timestamps: true
});

Item.hasOne(SaleItem, {foreignKey: "itemId", onDelete:"CASCADE"});
SaleItem.belongsTo(Item, {foreignKey: "itemId"});

Sale.hasMany(SaleItem, {foreignKey: "saleId", onDelete: "CASCADE"});
SaleItem.belongsTo(Sale, {foreignKey: "saleId"});

export default SaleItem;