import * as saleService from "./service.js";

// create sale
// input: body
export async function createSale(req, res) {
    const sale = await saleService.createSale(req.body);
    res.status(201).json({
        success: true,
        message: "Sale created",
        sale
    });
};

// get sales
// input: from query

// get sale
// input: from params
export async function getSale(req, res) {
    const sale = await saleService.getSale(req.params.saleId);
    res.status(200).json({
        success: true,
        message: "Saled fetched",
        sale
    });
};

// update sale
// input: from params, from body
export async function updateSale(req, res) {
    const sale = await saleService.updateSale(req.params.saleId, req.body);
    res.status(200).json({
        success: true, 
        message: "Sale updated",
        sale
    });
};

// delete sale
// input: from params
export async function deleteSale(req, res) {
    await saleService.deleteSale(req.params.saleId);
    res.status(200).json({
        success: true,
        message: "Sale deleted"
    });
};

// add new item to sale
// input: from params, from body
export async function addItemToSale(req, res) {
    const newItem = await saleService.addItemToSale(req.params.saleId, req.params.itemId);
    res.status(200).json({
        success: true,
        message: "Item added",
        newItem
    });
}

// delete item from sale
// input: from params, from params
export async function deleteItemOfSale(req, res) {
    await saleService.deleteItemOfSale(req.params.saleId, req.params.itemId);
    res.status(200).json({
        success: true, 
        message: "Item deleted from sale"
    });
};

