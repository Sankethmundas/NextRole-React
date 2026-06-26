import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";
import { registerUser } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = formData;

        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            toast.error("Please fill all fields.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {

            const response = await registerUser({
                name,
                email,
                password
            });

            toast.success(response.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration failed."
            );

        }
    };

    const handleGoogleRegister = () => {
        toast.info("Google authentication will be connected in backend integration.");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Your Account</h1>
                    <p>
                        Join NextRole and start building resumes, tracking jobs,
                        and improving your applications.
                    </p>
                </div>

                <button
                    className="google-auth-btn"
                    onClick={handleGoogleRegister}
                >
                    <FcGoogle className="google-icon" />
                    Continue with Google
                </button>

                <div className="auth-divider">
                    <span>or register with email</span>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="auth-input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Create Account
                    </button>
                </form>

                <p className="auth-terms">
                    By registering, you agree to NextRole’s{" "}
                    <span>Terms of Service</span> and{" "}
                    <span>Privacy Policy</span>.
                </p>

                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;