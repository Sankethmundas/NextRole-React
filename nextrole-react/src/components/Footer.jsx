
import "./Footer.css"
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {

    return (

        <footer className="text-center py-4 border-top">

            <p>
                © 2026 NextRole. All rights reserved.
            </p>

            <p>
                Built by Sanketh Kumar
            </p>

            <a
                href="https://github.com/Sankethmundas"
                target="_blank"
                rel="noreferrer"
            >
                <FaGithub/>
            </a>

            {" | "}

            <a
                href="https://www.linkedin.com/in/sankethkumar14/"
                target="_blank"
                rel="noreferrer"
            >
                <FaLinkedin/>
            </a>

        </footer>

    );

}

export default Footer;