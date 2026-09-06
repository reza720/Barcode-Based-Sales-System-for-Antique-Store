import * as api from "./api.js";

const Item_URL = "/items";

// get Items
async function getItems(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `${ITEM_URL}?${queryString}` : ITEM_URL;

    return api.get(endpoint);
}

// create Item
async function createItem(itemData) {
    return api.post(Item_URL, itemData);
}

// Scan Item
async function scan(barcode) {
    return api.post(`${Item_URL}/scan`, barcode);
}

// upload photos
async function upload(itemId, files) {
    const formData = new FormData();

    for(const file of files){
        formData.append("photos", file);
    }

    return api.upload(`${Item_URL}/${itemId}/photos`, formData);
};
