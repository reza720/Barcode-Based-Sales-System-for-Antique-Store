const API_URL = "http://localhost:3000/api";

// Base HTTP Request Handler
async function request(endpoint, options = {}) {
    const response  = await fetch(`${API_URL}${endpoint}`, options);

    if(!response.ok){
        throw new Error("Request failed");
    }

    let data = await response.json();
    return data;
}

// HTTP Method Helpers
// get
export async function get(endpoint) {
    return request(endpoint);
}

// post
export async function post(endpoint, data) {
    return request(endpoint, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json" 
        },
        body: JSON.stringify(data)
    });
};

// put
export async function put(endpoint, data) {
    return request(endpoint, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    });
};

// patch
export async function patch(endpoint, data) {
    return request(endpoint, {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        ...(data !== undefined && {
            body: JSON.stringify(data)
        })
    });
};

// delete
export async function del(endpoint) {
    return request(endpoint, {
        method: "DELETE"
    });
};

// upload
export async function upload(endpoint, formData) {
    return request(endpoint,{
        method: "POST",
        body: formData
    });
};








