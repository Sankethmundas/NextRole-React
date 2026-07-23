import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/auth`;

const registerUser = async(userData) => {
    
    const response = await axios.post(
        `${API_URL}/register`,
        userData
    )

    return response.data;
}

const loginUser = async (userData) => {

    const response = await axios.post(
        `${API_URL}/login`,
        userData
    );

    return response.data;
};

const googleLoginUser = async (credential) => {
    const response = await axios.post(
        `${API_URL}/google`,
        { credential }
    );
    return response.data;
};

export { registerUser, loginUser, googleLoginUser };