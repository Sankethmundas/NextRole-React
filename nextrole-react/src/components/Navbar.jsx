import { Link } from "react-router-dom"
import "./Navbar.css"
import { useState } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
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
                <li>
                    <Link 
                        to="/pricing"
                        onClick={() => setMenuOpen(false)}    
                    >
                        Pricing
                    </Link>
                </li>

                <li>
                    <Link 
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                    >
                        <button>Sign Up</button>
                    </Link>
                </li>

                <li>
                    <Link 
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                    >
                        <button>Sign In</button>
                    </Link>
                </li>

            </ul>
        </nav>
    )
}


export default Navbar;