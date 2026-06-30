import { Link } from "react-router-dom"
import "./Navbar.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const isLoggedIn = !!user;

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setProfileOpen(false);
        setMenuOpen(false);
        navigate("/login");

    };

    return (
        <nav>
            <div className="logo">NextRole</div>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(true)}
            >
                ☰
            </button>

            <ul className={menuOpen ? "nav-links active" : "nav-links"}>

                <div className="mobile-nav-header">
                    <h2>NextRole</h2>

                    <button
                        className="close-menu"
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <li>
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/resume-builder"
                        onClick={() => setMenuOpen(false)}
                    >
                        Resume Builder
                    </Link>
                </li>
                <li>
                    <Link
                        to="/ats-checker"
                        onClick={() => setMenuOpen(false)}
                    >
                        ATS Checker
                    </Link>
                </li>
                <li>
                    <Link
                        to="/cover-letter"
                        onClick={() => setMenuOpen(false)}
                    >
                        Cover Letter Generator
                    </Link>
                </li>
                <li>
                    <Link
                        to="/job-tracker"
                        onClick={() => setMenuOpen(false)}
                    >
                        Job Tracker
                    </Link>
                </li>
                {!isLoggedIn && (
                    <li>
                        <Link
                            to="/pricing"
                            onClick={() => setMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                    </li>
                )}

                {!isLoggedIn && (
                    <li>
                        <Link
                            to="/register"
                            onClick={() => setMenuOpen(false)}
                        >
                            <button>Sign Up</button>
                        </Link>
                    </li>
                )}

                {!isLoggedIn && (
                    <li>
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                        >
                            <button>Sign In</button>
                        </Link>
                    </li>
                )}

                {isLoggedIn && (
                    <li className="profile-menu">

                        <button
                            className="profile-btn"
                            onClick={() =>
                                setProfileOpen(prev => !prev)
                            }
                        >
                            <FaUserCircle />
                        </button>

                        {profileOpen && (

                            <div className="profile-dropdown">

                                <div className="profile-info">

                                    <FaUserCircle className="profile-icon" />

                                    <div>

                                        <h4>{user?.name}</h4>

                                        <p>{user?.email}</p>

                                    </div>

                                </div>

                                <hr />

                                <Link
                                    to="/dashboard"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Dashboard
                                </Link>

                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </div>

                        )}

                    </li>
                )}
            </ul>
        </nav>
    )
}


export default Navbar;