import * as itemService from "./service.js";

// add Item
// req: from body
// res: status, json(success, message, returned data)
export async function addItem(req, res) {
    const item = await itemService.addItem(req.body);
    res.status(201).json({
        success: true,
        message: "Item added",
        item
    });
};

// get Items
// req: options from query
// res: status, json(success, message, returned data)
export async function getItems(req, res) {
    const items = await itemService.getItems(req.query);
    
    res.status(200).json({
        success: true,
        message: "Items fetched",
        items
    });
};

// scan item
// req: code from body
// res: status, json(success, message, returned data)
export async function scanBarcode(req, res) {
    const item = await itemService.scanBarcode(req.body.barcode);
    
    res.status(200).json({
        success: true,
        message: "Item fetched",
        item
    });
};

// upload photos
// req: itemId from params, photos from file
// res: status, json(success, message, returned data)
export async function uploadPhotos(req, res){
    const data = await itemService.uploadPhotos(
        req.params.itemId, 
        req.files);

    res.status(200).json({
        success: true, 
        message: "Photos uploaded",
        data
    });
};

// regenerate barcode
// input: itemId from params
export async function generateBarcode(req, res) {
    const barcodePath = await itemService.generateBarcode(req.params.itemId);

    res.status(200).json({
        success: true,
        message: "New barcode generated",
        barcodePath
    });
};

// delete a photo
// req: itemId and photoId from params
// res: status, json(success, message)
export async function deletePhoto(req, res) {
    await itemService.deletePhoto(req.params.photoId);
    
    res.status(200).json({
        success: true,
        message: "Photo Deleted"
    });
};

// update item
// req: ItemId from params, data from body
// res: status, json(success, message, returned data)
export async function updateItem(req, res) {
    const item = await itemService.update(
        req.params.itemId, 
        req.body);

    res.status(200).json({
        success: true,
        message: "Item updated",
        item
    });
}

// delete an item
// req: itemId from params
// res: status, json(success, message)
export async function deleteItem(req, res) {
    await itemService.deleteItem(req.params.itemId);
    res.status(200).json({
        success: true, 
        message: "Item deleted"
    });
};

// get an item
// req: itemId from params
// res: status, json(success, message, returned data)
export async function getItem(req, res) {
    const item = await itemService.getItem(req.params.itemId);

    res.status(200).json({
        success: true,
        message: "Item fetched",
        item
    });
};

