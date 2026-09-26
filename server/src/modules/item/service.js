import Item from './models/item.js';
import Photo from './models/photo.js';
import deleteFile from '../../utils/deleteFile.js';
import throwError from '../../utils/throwError.js';
import { Op } from 'sequelize';
import bwip from 'bwip-js';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';

/**
 * Add Item and generate a barcode for it
 *
 * @param {Object} Item
 * @param {string} Item.name
 * @param {string | null} Item.description
 * @param {number} Item.price
 * @returns {Promise<Object>} The created Item
 */
export async function addItem({ name, description = null, price }) {
    let filepath;
    try {
        const { code, pngBuffer } = await generateBarcode();

        const barcodeDir = path.join(process.cwd(), 'storage', 'barcodes');
        await fs.mkdir(barcodeDir, { recursive: true });
        const filename = `${name}.${Date.now()}.png`;
        filepath = path.join(barcodeDir, filename);
        await fs.writeFile(filepath, pngBuffer);

        const item = await Item.create({
            barcode: code,
            barcodePath: filepath,
            name,
            description,
            price,
        });

        return {
            id: item.id,
            barcodePath: item.barcodePath,
            name: item.name,
            description: item.description,
            price: item.price,
        };
    } catch (err) {
        if (filepath) {
            await deleteFile(filepath);
        }
        throw err;
    }
}

/**
 * Retrieve list of items
 *
 * @param {Object} options - Query paramaters
 * @returns {Promise<Object>} - Paginated list of items
 */

export async function getItems(options = {}) {
    const { page = 1, limit = 10, search, minPrice, maxPrice } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
        where.name = {
            [Op.like]: `%${search}%`,
        };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) {
            where.price[Op.gte] = minPrice;
        }
        if (maxPrice !== undefined) {
            where.price[Op.lte] = maxPrice;
        }
    }

    const items = await Item.findAndCountAll({
        where,
        attributes: ['id', 'name', 'price'],
        limit,
        offset,
    });

    return {
        items: items.rows,
        pagination: {
            page,
            limit,
            totalItems: items.count,
            totalPage: Math.ceil(items.count / limit),
        },
    };
}

/**
 * Retrieve item data by scanning its barcode
 *
 * @param {string} barcode - Barcode value
 * @returns {Promise<Object>} - Item data
 */

export async function scanBarcode(barcode) {
    const item = await Item.findOne({
        where: { barcode },
        attributes: ['id', 'name', 'description', 'price', 'barcodePath'],
        include: [
            {
                model: Photo,
                attributes: ['id', 'path'],
            },
        ],
    });
    if (!item) throwError('Item not found', 404);

    return item;
}

/**
 * Upload item photos
 *
 * @param {string} itemId
 * @param {Object[]} files - Uploaded photos files
 * @returns {Promise<Object>} - Uploaded photos IDs and paths
 */

export async function uploadPhotos(itemId, files) {
    try {
        const item = await Item.findByPk(itemId);
        if (!item) throwError('Item not found', 404);
        if (!files || files.length === 0) throwError('Files are not added', 400);

        const photos = await Photo.bulkCreate(
            files.map((file) => ({
                itemId,
                path: file.path,
            }))
        );

        return {
            photos: photos.map((photo) => ({
                id: photo.id,
                path: photo.path,
            })),
        };
    } catch (err) {
        if (files) {
            for (const file of files) {
                await deleteFile(file.path);
            }
        }
        throw err;
    }
}

/**
 * Regenerate item barcode
 *
 * @param {string} itemId
 * @returns {Promise<Object>} - Generated barcode path
 */
export async function regenerateBarcode(itemId) {
    let filepath;
    try {
        const item = await Item.findByPk(itemId);
        if (!item) throwError('Item not found', 404);

        const { code, pngBuffer } = await generateBarcode();
        const filename = `${item.name}.${Date.now()}.png`;
        filepath = path.join(process.cwd(), 'storage', 'barcodes', filename);
        await fs.writeFile(filepath, pngBuffer);

        const oldFilepath = item.barcodePath;

        await item.update({
            barcode: code,
            barcodePath: filepath,
        });

        if (oldFilepath) await deleteFile(oldFilepath);

        return {
            barcodePath: item.barcodePath,
        };
    } catch (err) {
        if (filepath) {
            await deleteFile(filepath);
        }
        throw err;
    }
}

/**
 * Delete item photo
 *
 * @param {string} photoId
 * @returns {Primise<void>}
 */
export async function deletePhoto(photoId) {
    const photo = await Photo.findByPk(photoId);
    if (!photo) throwError('Photo not found', 404);

    await photo.destroy();
    await deleteFile(photo.path);
}

/**
 * Update item data
 *
 * @param {string} itemId
 * @param {Object} data - Item data to update
 * @returns {Promise<Object>} - Updated item data
 */
export async function updateItem(itemId, data) {
    if (!data || Object.keys(data).length === 0) throwError('No data is added', 400);

    const item = await Item.findByPk(itemId);
    if (!item) throwError('Item not found', 404);

    const updatedData = {};
    if (data.name !== undefined) {
        updatedData.name = data.name;
    }
    if (data.description !== undefined) {
        updatedData.description = data.description;
    }
    if (data.price !== undefined) {
        updatedData.price = data.price;
    }
    await item.update(updatedData);

    return {
        name: item.name,
        description: item.description,
        price: item.price,
    };
}

/**
 * Delete item
 *
 * @param {string} itemId
 * @returns {Promise<void>}  
 */
export async function deleteItem(itemId) {
    const item = await Item.findByPk(itemId);
    if (!item) throwError('Item not found', 404);

    const photos = await Photo.findAll({
        where: { itemId },
    });

    await item.destroy();

    await deleteFile(item.barcodePath);

    if (photos.length !== 0) {
        for (const photo of photos) {
            await deleteFile(photo.path);
        }
    }
}

/**
 * Retrieve item data
 *
 * @param {string} itemId
 * @returns {Promise<Object>} - Item data
 */
export async function getItem(itemId) {
    const item = await Item.findByPk(itemId, {
        attributes: ['id', 'name', 'description', 'price', 'barcodePath'],
        include: [
            {
                model: Photo,
                attributes: ['id', 'path'],
            },
        ],
    });

    if (!item) throwError('Item not found', 404);

    return item;
}

// ---------- Helpers -------------

/**
 * Generate a barcode
 *
 * @returns {Object} - Generated barcode and PNG buffer
 */
async function generateBarcode() {
    const code = crypto.randomBytes(5).toString('hex');
    const pngBuffer = await bwip.toBuffer({
        bcid: 'code128',
        text: code,
        includetext: true,
        textxalign: 'center',
        textyalign: 'below',
        paddingwidth: 10,
        paddingheight: 10,
        backgroundcolor: 'ffffff',
    });

    return {
        code,
        pngBuffer,
    };
}
