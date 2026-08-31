const API_URL = "http://localhost:3000/api";

async function getItems(options = {}) {
    const params = new URLSearchParams();

    if(options.page) params.append("page", options.page);
    if(options.limit) params.append("limit", options.limit);
    if(options.search) params.append("search", options.search);
    if(options.minPrice) params.append("minPrice", options.minPrice);
    if(options.maxPrice) params.append("maxPrice", options.maxPrice);

    const response = await fetch(`${API_URL}/items?${params.toString()}`);
    if(!response.ok){
        throw new Error("Items not fetched");
    }

    return response.json();
}

export default getItems;