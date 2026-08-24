import * as itemService from "./service.js";

// add Item
// req: from body
// res: status, json(success, message, returned data)
export async function addItem(req, res, next) {
    try{
        const item = await itemService.addItem(req.body);
        res.status(201).json({
            success: true,
            message: "Item added",
            item
        });
    }
    catch(err){
        next(err);
    }
}

// upload photos
// req: itemId from params, photos from file
// res: status, json(success, message, returned data)
export async function upload(req, res, next){
    try{
        const data = await itemService.upload(
            req.params.itemId, 
            req.files);

        res.status(200).json({
            success: true, 
            message: "Photos uploaded",
            data
        });
    }
    catch(err){
        next(err);
    }
}

// update item
// req: ItemId from params, data from body
// res: status, json(success, message, returned data)
export async function update(req, res, next) {
    try{
        const item = await itemService.update(
            req.params.itemId, 
            req.body);
        res.status(200).json({
            success: true,
            message: "Item updated",
            item
        });
    }   
    catch(err){
        next(err);
    }
}

// delete a photo
// req: itemId and photoId from params
// res: status, json(success, message)
export async function deletePhoto(req, res, next) {
    try{
        await itemService.deletePhoto(req.params.itemId, req.params.photoId);
        res.status(200).json({
            success: true,
            message: "Photo Deleted"
        });
    }
    catch(err){
        next(err);
    }
};

// delete an item
// req: itemId from params
// res: status, json(success, message)
export async function deleteItem(req, res, next) {
    try{
        await itemService.deleteItem(req.params.itemId);
        res.status(200).json({
            success: true, 
            message: "Item deleted"
        });
    }
    catch(err){
        next(err);
    }
};

// scan item
// req: code from body
// res: status, json(success, message, returned data)
export async function scan(req, res, next) {
    try{
        const item = await itemService.scan(req.body.barcode);
        res.status(200).json({
            success: true,
            message: "Item fetched",
            item
        });
    }
    catch(err){
        next(err);
    }
};

// get an item
// req: itemId from params
// res: status, json(success, message, returned data)
export async function getItem(req, res, next) {
    try{
        const item = await itemService.getItem(req.params.itemId);
        res.status(200).json({
            success: true,
            message: "Item fetched",
            item
        });
    }
    catch(err){
        next(err);
    }
};

// get Items
// req: options from query
// res: status, json(success, message, returned data)
export async function getItems(req, res, next) {
    try{
        const items = await itemService.getItems(req.query);
        res.status(200).json({
            success: true,
            message: "Items fetched",
            items
        })
    }
    catch(err){
        next(err);
    }
}