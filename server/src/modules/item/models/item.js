import sequelize from "../../../config/sequelize.js";
import { DataTypes } from "sequelize";    
    
const Item = sequelize.define("Item", {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    barcode:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    barcodePath:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price:{
        type:DataTypes.DECIMAL(9, 2),
        allowNull: false
    }
}, {
    timestamps: true
});

export default Item;

 