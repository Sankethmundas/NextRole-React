import axios from "axios";

const API_URL = "http://localhost:5000/api/cover-letters";

const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const saveCoverLetter = async (formData) => {
    const response = await axios.post(API_URL, { formData }, getConfig());
    return response.data;
};

const getCoverLetter = async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
};

export { saveCoverLetter, getCoverLetter };
