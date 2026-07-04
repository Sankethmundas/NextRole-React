import axios from "axios";
const API_URL = "http://localhost:5000/api/jobs";

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

}

const deleteJob = async (id) => {

}

export {
    createJob,
    getJobs,
    updateJob,
    deleteJob
};