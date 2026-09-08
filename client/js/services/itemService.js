import * as api from "./api.js";

const Item_URL = "/items";

// get Items
export function getItems(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `${Item_URL}?${queryString}` : Item_URL;

    return api.get(endpoint);
}

// create Item
export function createItem(itemData) {
    return api.post(Item_URL, itemData);
}

// Scan Item
export function scan(barcode) {
    return api.post(`${Item_URL}/scan`, barcode);
}

// upload photos
export function upload(itemId, files) {
    const formData = new FormData();

    for(const file of files){
        formData.append("photos", file);
    }

    return api.upload(`${Item_URL}/${itemId}/photos`, formData);
};

// Generate barcode
export function regenerateBarcode(itemId) {
    return api.post(`${Item_URL}/${itemId}/barcode`);
}

// delete photo
export function deletePhoto(photoId){
    return api.del(`${Item_URL}/photos/${photoId}`);
}

// update Item
export function updateItem(itemId, data){
    return api.patch(`${Item_URL}/${itemId}`, data);
}

// delete Item
export function deleteItem(itemId){
    return api.del(`${Item_URL}/${itemId}`);
}

// get Item
export function getItem(itemId){
    return api.get(`${Item_URL}/${itemId}`);
}