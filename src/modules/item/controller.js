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

// delete a photo
// req: itemId and photoId from params
// res: status, json(success, message)

// delete an item
// req: itemId from params
// res: status, json(success, message)

// scan item
// req: code from body
// res: status, json(success, message, returned data)

// get an item
// req: itemId from params
// res: status, json(success, message, returned data)

// get Items
// req: options from query
// res: status, json(success, message, returned data)