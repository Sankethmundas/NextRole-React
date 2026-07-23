import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/jobs`;

const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};


const createJob = async (jobData) => {

    const response = await axios.post(
        API_URL,
        jobData,
        getConfig()
    );

    return response.data;

};

const getJobs = async () => {

    const response = await axios.get(
        API_URL,
        getConfig()
    );

    return response.data;
}

const updateJob = async (id, jobData) => {

    const response = await axios.put(
        `${API_URL}/${id}`,
        jobData,
        getConfig()
    );

    return response.data;

};

const deleteJob = async (id) => {

    const response = await axios.delete(
        `${API_URL}/${id}`,
        getConfig()
    );

    return response.data;

};

export {
    createJob,
    getJobs,
    updateJob,
    deleteJob
};