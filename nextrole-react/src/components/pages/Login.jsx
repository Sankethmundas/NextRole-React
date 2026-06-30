import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";
import { loginUser } from "../../services/authService";

function Login() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email.trim() || !password.trim()) {
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

        try {

            const response = await loginUser({
                email,
                password
            });

            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            toast.success(response.message);

            setFormData({
                email: "",
                password: ""
            });

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login failed."
            );

        }
    };

    const handleGoogleLogin = () => {
        toast.info("Google authentication will be connected in backend integration.");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>
                        Login to continue building resumes, tracking applications,
                        and improving your job search with NextRole.
                    </p>
                </div>

                <button
                    className="google-auth-btn"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle className="google-icon" />
                    Continue with Google
                </button>

                <div className="auth-divider">
                    <span>or login with email</span>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
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
                        <div className="password-label-row">
                            <label>Password</label>
                            <button
                                type="button"
                                className="forgot-password-btn"
                                onClick={() =>
                                    toast.info("Forgot password flow can be added later.")
                                }
                            >
                                Forgot Password?
                            </button>
                        </div>

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

                    <button type="submit" className="auth-btn">
                        Login
                    </button>
                </form>

                <p className="auth-footer-text">
                    Don’t have an account?{" "}
                    <Link to="/register">Create one here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;