import Sale from "./models/sale.js";
import SaleItem from "./models/saleItem.js";
import sequelize from "../../config/sequelize.js";
import throwError from "../../utils/throwError.js";
import Item from "../item/models/item.js";
import { TICK_CHAR } from "sequelize/lib/utils";

// Create sale
// input: saleData not item added initailly
// destructure the data
// return: sale data
export async function createSale({customerName, customerPhone}) {
    const sale = await Sale.create({
        customerName,
        customerPhone
    });

    return {
        saleId: sale.id,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        saleDate: sale.date
    }
}

// get sales
// input: options
// queries: search by customerName, itemName
//          sort by date (defualt)
//          pagination
//          
// return: rows + paginaton data

// get Sale
// input: saleId
// if sale exist
// get items if exist 
// return sale data, items data, total
export async function getSale(saleId) {
    const sale = await Sale.findByPk(saleId,{
        include:[
            {
                model: SaleItem,
                include:[
                    {
                        model: Item,
                        attributes:[
                            "id",
                            "name",
                            "description",
                            "price"
                        ]
                    }
                ]
            }
        ]
    });
    if(!sale) throwError("Sale not found", 404);

    const items = sale.SaleItems.map(saleItem => saleItem.Item);
    const total = items.reduce((sum, item) => sum + Number(item.price),0);
    
    return {
        saleId: sale.id,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        saleDate: sale.date,
        items,
        total
    }
};

// update Sale
// input: saleId, data
// if saleexist
// onyl update the sale data
// return: sale data, items data, total
export async function updateSale(saleId, data) {
    const sale = await Sale.findByPk(saleId);
    if(!sale) throwError("Sale not found", 404);

    if(!data) throwError("No data is provided", 400);
    const {
        customerName,
        customerPhone
    } = data;

    const updatedData = {};
    if(customerName !== undefined){
        updatedData.customerName = customerName;
    }
    if(customerPhone !== undefined){
        updatedData.customerPhone = customerPhone;
    }

    await sale.update(updatedData);

    return {
        saleId: sale.id,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        saleDate: sale.date
    }
};

// delete sale
// input: saleId
// if sale exist
// return: nothing
export async function deleteSale(saleId) {
    const sale = await Sale.findByPk(saleId);
    if(!sale) throwError("Sale not found", 404);

    await sale.destroy();
}

// add Item to sale
// input: saleId, items
// if sale exist
// if items in that sale eixst
// if item already sold
// Create the saleItem
// return:  added item

export async function addItemToSale(saleId, itemId) {
    if (!itemId) {
        throwError("Item ID is required", 400);
    }

    const sale = await Sale.findByPk(saleId);
    if (!sale) {
        throwError("Sale not found", 404);
    }

    const item = await Item.findByPk(itemId);
    if (!item) {
        throwError("Item not found", 404);
    }

    await isItemSold(itemId);

    const saleItem = await SaleItem.create({
        itemId,
        saleId
    });

    return {
        itemId: saleItem.itemId,
        saleId: saleItem.saleId
    };
}

async function isItemSold(itemId) {
    const saleItem = await SaleItem.findOne({
        where: {
            itemId
        }
    });

    if (saleItem) {
        throwError(`Item with ID ${itemId} is already sold`, 400);
    }
}

// delete Item of sale
// input: saleId, ItemId
// if sale exist
// if item exist
// delete sale item
// return: nothing
export async function deleteItemOfSale(saleId, itemId) {
    const saleItem = await SaleItem.findOne({
        where:{
            saleId,
            itemId
        }
    });

    if(!saleItem) throwError("Item is not added to sale", 404);

    await saleItem.destroy()
};

