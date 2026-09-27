import * as saleService from './service.js';

// Create sale
export async function createSale(req, res) {
    const sale = await saleService.createSale(req.body);

    res.status(201).json({
        success: true,
        message: 'Sale created',
        sale,
    });
}

// Retrieve the sales
export async function getSales(req, res) {
    const sales = await saleService.getSales(req.query.search, req.query.page, req.query.limit);

    res.status(200).json({
        success: true,
        message: 'Sales retrieved',
        sales,
    });
}

// Retrieve the sale
export async function getSale(req, res) {
    const sale = await saleService.getSale(req.params.saleId);

    res.status(200).json({
        success: true,
        message: 'Saled fetched',
        sale,
    });
}

// Update the sale
export async function updateSale(req, res) {
    const sale = await saleService.updateSale(req.params.saleId, req.body);

    res.status(200).json({
        success: true,
        message: 'Sale updated',
        sale,
    });
}

// Delete the sale
export async function deleteSale(req, res) {
    await saleService.deleteSale(req.params.saleId);

    res.status(200).json({
        success: true,
        message: 'Sale deleted',
    });
}

// Add the item to the sale
export async function addItemToSale(req, res) {
    const newItem = await saleService.addItemToSale(req.params.saleId, req.params.itemId);

    res.status(200).json({
        success: true,
        message: 'Item added',
        newItem,
    });
}

// Delete the item from the sale
export async function deleteItemOfSale(req, res) {
    await saleService.deleteItemOfSale(req.params.saleId, req.params.itemId);

    res.status(200).json({
        success: true,
        message: 'Item deleted from sale',
    });
}
