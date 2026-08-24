import Item from "./models/item.js";
import Photo from "./models/photo.js";
import deleteFile from "../../utils/deleteFile.js";
import throwErrror from "../../utils/throwError.js";
import { Model, Op } from "sequelize";
import bwip from "bwip-js";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import { describe, it } from "node:test";

// add item
// input: name, description, price
// Generate Barcode 
// Create Item table
// if DB fails delete the barcode
// return id, barcodePath, name, description, price
export async function addItem({name, description, price}) {
    let filepath;
    try{
        const {code, pngBuffer} = await generateBarcode();

        const barcodeDir = path.join(process.cwd(), "storage", "barcodes");
        await fs.mkdir(barcodeDir, {recursive: true});
        const filename = `${name}.${Date.now()}.png`;
        filepath = path.join(barcodeDir, filename);
        await fs.writeFile(filepath, pngBuffer);

        const item = await Item.create({
            barcode: code,
            barcodePath: filepath,
            name,
            description,
            price
        });

        return {
            id: item.id,
            barcodePath: item.barcodePath,
            name: item.name,
            description: item.description,
            price: item.price
        }
    }
    catch(err){
        if(filepath){
            await deleteFile(filepath);
        }
        throw err;
    }
};

// upload photos
// input: itemId, photos
// If item exist
// If photos exist
// Create Bulk photo model
// if DB fails delete the photos
// return: item data + photos paths
export async function upload(itemId, files) {
    try{
        const item = await Item.findByPk(itemId);
        if(!item) throwErrror("Item not found", 404);
        if(!files || files.length === 0) throwErrror("Files are not added", 400);

        const photos = await Photo.bulkCreate(
            files.map(file => ({
                itemId,
                path: file.path
            }))
        );

        return {
            id: item.id,
            name: item.name,
            photos: photos.map(photo => ({
                id: photo.id,
                path: photo.path
            }))
        }
    }
    catch(err){
        if(files){
            for (const file of files){
                await deleteFile(file.path);
            }
        }
        throw err;
    }
};

// update item
// input: itemId, data
// if item exist
// Update in db the item model
// return: item data
export async function update(itemId, data) {
    if(!data || Object.keys(data).length === 0) throwErrror("No data is added", 400);

    const item = await Item.findByPk(itemId);
    if(!item) throwErrror("Item not found", 404);

    const updatedData = {};
    if(data.name !== undefined){
        updatedData.name = data.name
    }
    if(data.description !== undefined){
        updatedData.description = data.description
    }
    if(data.price !== undefined){
        updatedData.price = data.price
    }
    await item.update(updatedData);

    return{
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price
    }
};

// Delete a photo
// input: itemId, photoId
// if item exist
// if photo exist
// delete photo model
// delet photo in storage
export async function deletePhoto(itemId, photoId) {
    const photo = await Photo.findOne({
        where:{
            id: photoId,
            itemId
        }
    });

    if(!photo) throwErrror("Photo not found", 404);

    await photo.destroy();
    await deleteFile(photo.path);
}

// Delete an Item
// input: itemId
// if Item exist
// delete item model
// Delete the photos in storage
export async function deleteItem(itemId){
    const item = await Item.findByPk(itemId);
    if(!item) throwErrror("Item not found", 404);

    const photos = await Photo.findAll({
        where:{itemId}
    });
    
    await item.destroy();
    
    await deleteFile(item.barcodePath);

    if(photos.length !== 0){
        for(const photo of photos){
            await deleteFile(photo.path);
        }
    }
};

// Scan
// input: barcode Code
// if Item exist
// return: item data 
export async function scan(barcode) {
    console.log("barcode received");
    console.log("barcode type:", typeof barcode);
    const item = await Item.findOne({
        where: {barcode},
    });
    console.log("item searched");
    if(!item) throwErrror("Item not found", 404);
    console.log("item found");
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price
    }
}

// Get an Item
// input: itemId
// if item exist
// return: item data + photos paths
export async function getItem(itemId) {
    const item = await Item.findByPk(itemId,{
        attributes:[
            "id",
            "name",
            "description",
            "price"
        ],
        include:[
            {
                model: Photo,
                attributes:[
                    "path"
                ]
            }
        ]
    });

    if(!item) throwErrror("Item not found", 404);

    return item;
};

// get item collection
// support: pagaintaion
// suport: Search by (name)
// support: Filter by price range 
// input: options(page, limit, search, minPrice, maxPrice)
// destructure the options
// Create where (search and filter), offset
// fetch rows and count
// return: rows, pagination metadata
export async function getItems(options = {}) {
    const {
        page = 1,
        limit = 10,
        search,
        minPrice,
        maxPrice
    } = options;

    const offset = (page -1) * limit;
    const where = {};
    
    if(search){
        where.name = {
            [Op.like]: `%${search}%`
        };
    };
    
    if(minPrice !== undefined || maxPrice !== undefined){
        where.price = {};
        if(minPrice !== undefined){
            where.price[Op.gte] = minPrice;
        }
        if(maxPrice !== undefined){
            where.price[Op.lte] = maxPrice;
        }
    }

    const items = await Item.findAndCountAll({
        where,
        attributes:[
            "id",
            "name",
            "description",
            "price"
        ],
        include:[
            {
                model: Photo,
                attributes:[
                    "path"
                ]
            }
        ],
        limit,
        offset,
        distinct: true
    });

    return {
        items: items.rows,
        pagination:{
            page,
            limit,
            totalItems: items.count,
            totalPage: Math.ceil(items.count/limit)
        }
    }
};


// ---------- Helpers -------------
// generate Barcode
async function generateBarcode(){
    const code = crypto.randomBytes(5).toString("hex");
    const pngBuffer = await bwip.toBuffer({
        bcid:"code128",
        text: code,
        includetext: true,
        textxalign:"center",
        textyalign:"below",
        paddingwidth: 10,
        paddingheight: 10,
        backgroundcolor: "ffffff",
    });

    return {
        code,
        pngBuffer
    }
};

