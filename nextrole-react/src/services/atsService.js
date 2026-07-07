import axios from "axios";

const API_URL = "http://localhost:5000/api/ats";

const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const saveAtsResult = async (payload) => {
    const response = await axios.post(API_URL, payload, getConfig());
    return response.data;
};

const getAtsResults = async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
};

export { saveAtsResult, getAtsResults };
