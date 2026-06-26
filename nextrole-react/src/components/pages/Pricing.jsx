import "./Pricing.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Pricing() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [waitlistData, setWaitlistData] = useState({
        name: "",
        email: "",
        note: ""
    });

    const plans = [
        {
            name: "Free",
            price: "₹0",
            duration: "/month",
            description: "For students and beginners starting their job hunt.",
            features: [
                "1 Resume Template",
                "Basic Resume Builder",
                "Save 1 Resume",
                "Basic Job Tracker",
                "2 ATS Checks per Week",
                "Basic Cover Letter Generator",
                "PDF Resume Export",
                "Email Support"
            ],
            buttonText: "Get Started",
            popular: false
        },
        {
            name: "Pro",
            price: "₹299",
            duration: "/month",
            description: "For serious applicants who want to optimize every application.",
            features: [
                "Unlimited Resume Builds",
                "5 Premium Resume Templates",
                "Unlimited Resume Downloads",
                "Unlimited ATS Checks",
                "Advanced ATS Suggestions",
                "Unlimited Cover Letter Generation",
                "Save Multiple Cover Letters",
                "Job Tracker Dashboard + Filters",
                "Application Analytics",
                "Priority Email Support"
            ],
            buttonText: "Choose Pro",
            popular: true
        },
        {
            name: "Career+",
            price: "₹599",
            duration: "/month",
            description: "For ambitious candidates who want premium AI-powered career support.",
            features: [
                "Everything in Pro",
                "AI Resume Improvement Suggestions",
                "AI Cover Letter Enhancements",
                "Advanced ATS Insights",
                "Role-Based Resume Optimization",
                "Job-Specific Keyword Recommendations",
                "Interview Question Generator",
                "Mock Interview Prep Suggestions",
                "Resume Version History",
                "Premium Career Dashboard",
                "Early Access to New AI Tools",
                "Priority Premium Support"
            ],
            buttonText: "Go Career+",
            popular: false
        }
    ];

    const handlePlanClick = (planName) => {
        if (planName === "Free") {
            navigate("/register");
        } else {
            setSelectedPlan(planName);
            setWaitlistData({
                name: "",
                email: "",
                note: ""
            });
            setShowModal(true);
        }
    };

    const handleWaitlistChange = (e) => {
        setWaitlistData({
            ...waitlistData,
            [e.target.name]: e.target.value
        });
    };

    const handleWaitlistSubmit = (e) => {
        e.preventDefault();

        if (!waitlistData.name.trim() || !waitlistData.email.trim()) {
            toast.error("Please enter your name and email.");
            return;
        }

        toast.success(`You've joined the ${selectedPlan} waitlist!`);

        setWaitlistData({
            name: "",
            email: "",
            note: ""
        });

        setShowModal(false);
    };

    return (
        <div className="pricing-page container py-5">
            {/* Hero */}
            <div className="pricing-hero text-center mb-5">
                <h1>Choose the Right Plan for Your Career Growth</h1>
                <p>
                    Build stronger resumes, track applications, generate cover letters,
                    and improve your ATS score with NextRole.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="row g-4">
                {plans.map((plan, index) => (
                    <div className="col-lg-4 col-md-6" key={index}>
                        <div className={`pricing-card ${plan.popular ? "popular-card" : ""}`}>
                            {plan.popular && (
                                <div className="popular-badge">
                                    Most Popular
                                </div>
                            )}

                            <h2>{plan.name}</h2>
                            <p className="plan-description">
                                {plan.description}
                            </p>

                            <div className="plan-price">
                                <span className="price">{plan.price}</span>
                                <span className="duration">{plan.duration}</span>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>

                            <button
                                className="pricing-btn"
                                onClick={() => handlePlanClick(plan.name)}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="pricing-faq mt-5">
                <h2 className="text-center mb-4">Frequently Asked Questions</h2>

                <div className="faq-item">
                    <h4>Is there a free plan?</h4>
                    <p>
                        Yes. NextRole offers a free plan for students and beginners
                        to build resumes, generate cover letters, and track applications.
                    </p>
                </div>

                <div className="faq-item">
                    <h4>Can I upgrade later?</h4>
                    <p>
                        Absolutely. You can start with the Free plan and upgrade
                        to Pro or Career+ whenever you need advanced features.
                    </p>
                </div>

                <div className="faq-item">
                    <h4>Does NextRole support ATS-friendly resumes?</h4>
                    <p>
                        Yes. Our resume builder and ATS checker are designed to help
                        you create resumes that align better with recruiter systems.
                    </p>
                </div>

                <div className="faq-item">
                    <h4>Will more AI features be added in the future?</h4>
                    <p>
                        Yes. We plan to add smarter resume suggestions, advanced ATS insights,
                        and interview preparation tools in future updates.
                    </p>
                </div>
            </div>

            {/* Coming Soon Modal */}
            {showModal && (
                <div className="pricing-modal-overlay">
                    <div className="pricing-modal">
                        <h2>Join the {selectedPlan} Waitlist 🚀</h2>
                        <p>
                            Premium plans are launching soon. Enter your details and we’ll
                            notify you when the <strong>{selectedPlan}</strong> plan goes live.
                        </p>

                        <form onSubmit={handleWaitlistSubmit} className="waitlist-form">
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={waitlistData.name}
                                    onChange={handleWaitlistChange}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={waitlistData.email}
                                    onChange={handleWaitlistChange}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Why are you interested? (Optional)
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="note"
                                    value={waitlistData.note}
                                    onChange={handleWaitlistChange}
                                    placeholder="Tell us what premium feature you’d love to use..."
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="close-modal-btn secondary-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="close-modal-btn"
                                >
                                    Notify Me
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pricing;