import { FaFileAlt, FaBriefcase, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function FeatureCard({ title, description }) {
    const getIcon = () => {
        if (title.toLowerCase().includes("resume")) return <FaFileAlt className="fs-3 text-primary" />;
        if (title.toLowerCase().includes("job")) return <FaBriefcase className="fs-3 text-info" />;
        return <FaCheckCircle className="fs-3 text-success" />;
    };

    const getLink = () => {
        if (title.toLowerCase().includes("resume")) return "/resume-builder";
        if (title.toLowerCase().includes("job")) return "/job-tracker";
        return "/ats-checker";
    };

    return (
        <div className="card feature-card h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                    <div className="feature-icon-wrapper mb-3">
                        {getIcon()}
                    </div>
                    <h3 className="feature-title mb-2">{title}</h3>
                    <p className="feature-desc text-muted mb-4">{description}</p>
                </div>
                <div>
                    <Link to={getLink()} className="feature-link d-inline-flex align-items-center gap-2">
                        Explore tool <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FeatureCard;
