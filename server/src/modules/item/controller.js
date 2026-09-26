import * as itemService from './service.js';

// Add item
export async function addItem(req, res) {
    const item = await itemService.addItem(req.body);
    res.status(201).json({
        success: true,
        message: 'Item added',
        item,
    });
}

// Retrieve items data
export async function getItems(req, res) {
    const items = await itemService.getItems(req.query);

    res.status(200).json({
        success: true,
        message: 'Items fetched',
        items,
    });
}

// Scan item
export async function scanBarcode(req, res) {
    const item = await itemService.scanBarcode(req.body.barcode);

    res.status(200).json({
        success: true,
        message: 'Item fetched',
        item,
    });
}

// Upload the item's photos
export async function uploadPhotos(req, res) {
    const data = await itemService.uploadPhotos(req.params.itemId, req.files);

    res.status(200).json({
        success: true,
        message: 'Photos uploaded',
        data,
    });
}

// Regenerate the item's barcode
export async function regenerateBarcode(req, res) {
    const barcodePath = await itemService.regenerateBarcode(req.params.itemId);

    res.status(200).json({
        success: true,
        message: 'New barcode generated',
        barcodePath,
    });
}

// Delete the item's photo
export async function deletePhoto(req, res) {
    await itemService.deletePhoto(req.params.photoId);

    res.status(200).json({
        success: true,
        message: 'Photo Deleted',
    });
}

// Update the item's data
export async function updateItem(req, res) {
    const item = await itemService.updateItem(req.params.itemId, req.body);

    res.status(200).json({
        success: true,
        message: 'Item updated',
        item,
    });
}

// Delete the item
export async function deleteItem(req, res) {
    await itemService.deleteItem(req.params.itemId);
    res.status(200).json({
        success: true,
        message: 'Item deleted',
    });
}

// Retrieve the item's data
export async function getItem(req, res) {
    const item = await itemService.getItem(req.params.itemId);

    res.status(200).json({
        success: true,
        message: 'Item fetched',
        item,
    });
}
