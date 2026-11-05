import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Home.css";
import FeatureCard from "../Feature-card";
import features from "../../data/features";
import {
    FaRocket,
    FaCheckCircle,
    FaMagic,
    FaArrowRight,
    FaShieldAlt,
    FaBolt
} from "react-icons/fa";

function Home() {
    const homeRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance timeline
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(".hero-badge", {
                y: -20,
                opacity: 0,
                duration: 0.6
            })
                .from(
                    ".hero-title",
                    {
                        y: 35,
                        opacity: 0,
                        duration: 0.8
                    },
                    "-=0.3"
                )
                .from(
                    ".hero-text",
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.7
                    },
                    "-=0.4"
                )
                .from(
                    ".hero-cta-btn",
                    {
                        scale: 0.9,
                        opacity: 0,
                        stagger: 0.15,
                        duration: 0.5
                    },
                    "-=0.3"
                )
                .from(
                    ".hero-stat-pill",
                    {
                        y: 20,
                        opacity: 0,
                        stagger: 0.1,
                        duration: 0.5
                    },
                    "-=0.2"
                );

            // Floating gentle hover on hero badge
            gsap.to(".hero-floating-badge", {
                y: -6,
                repeat: -1,
                yoyo: true,
                duration: 2.4,
                ease: "sine.inOut"
            });

            // Features section stagger
            gsap.from(".feature-card-col", {
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.3
            });

            // How it works steps stagger
            gsap.from(".step-box-wrapper", {
                y: 30,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: "power2.out",
                delay: 0.5
            });

            // CTA bottom banner scale & glow
            gsap.from(".cta-section-box", {
                scale: 0.94,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.6
            });
        }, homeRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={homeRef} className="home-wrapper">
            {/* Hero Section */}
            <section className="container hero-container">
                <div className="hero">
                    <div className="hero-badge hero-floating-badge mb-3">
                        <FaBolt className="text-warning me-1" /> Next-Gen Career Suite 2.0
                    </div>

                    <h1 className="hero-title display-4 fw-bold">
                        The Smarter Way to Manage Your Career Journey.
                    </h1>

                    <p className="hero-text">
                        Create ATS-tailored resumes for any job description, pinpoint missing technical skills,
                        and organize your entire job application pipeline in one streamlined platform.
                    </p>

                    <div className="hero-cta-group mt-4">
                        <Link to="/resume-builder" className="btn btn-primary btn-lg hero-cta-btn me-3">
                            <FaMagic className="me-2" /> Build Resume
                        </Link>

                        <Link to="/ats-checker" className="btn btn-outline-light btn-lg hero-cta-btn">
                            <FaShieldAlt className="me-2" /> Real ATS Checker
                        </Link>
                    </div>

                    {/* Quick highlights / stats pills */}
                    <div className="hero-stats-row mt-5">
                        <div className="hero-stat-pill">
                            <FaRocket className="text-primary me-2" /> 100% Free & Open
                        </div>
                        <div className="hero-stat-pill">
                            <FaCheckCircle className="text-success me-2" /> Live JD Tailoring
                        </div>
                        <div className="hero-stat-pill">
                            <FaBolt className="text-warning me-2" /> Instant PDF Export
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-5">
                <div className="text-center mb-5">
                    <span className="section-eyebrow">Comprehensive Tools</span>
                    <h2 className="features-title mt-2">
                        Everything You Need To Land Your Next Role
                    </h2>
                    <p className="text-muted max-w-600 mx-auto">
                        Engineered specifically for tech candidates, software engineers, and ambitious job seekers.
                    </p>
                </div>

                <div className="row g-4">
                    {features.map((feature, index) => (
                        <div className="col-md-6 col-lg-4 feature-card-col" key={index}>
                            <FeatureCard
                                title={feature.title}
                                description={feature.description}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* How NextRole Works Section */}
            <section className="container py-5">
                <div className="text-center mb-5">
                    <span className="section-eyebrow">Seamless Workflow</span>
                    <h2 className="mt-2 fw-bold">How NextRole Works</h2>
                    <p className="text-muted">A clear, 4-step path from job search to signed offer.</p>
                </div>

                <div className="row text-center g-4">
                    <div className="col-md-6 col-lg-3 step-box-wrapper">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h4>Upload or Build</h4>
                            <p className="text-muted small">
                                Upload your existing resume or craft one using our interactive real-time editor.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 step-box-wrapper">
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h4>Analyze with ATS</h4>
                            <p className="text-muted small">
                                Paste the target job description to uncover missing skills and optimize your score.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 step-box-wrapper">
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h4>Track Applications</h4>
                            <p className="text-muted small">
                                Organize your active interviews, follow-ups, and offer pipelines effortlessly.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3 step-box-wrapper">
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h4>Get Hired</h4>
                            <p className="text-muted small">
                                Stand out to recruiters, pass ATS screeners, and land interview callbacks.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action Section */}
            <section className="container py-5">
                <div className="cta-section-box text-center">
                    <h2 className="display-6 fw-bold mb-3">
                        Ready To Land Your Next Role?
                    </h2>

                    <p className="cta-subtext mb-4">
                        Join forward-thinking candidates using NextRole to optimize resumes, pass recruiter filters,
                        and accelerate their hiring timeline.
                    </p>

                    <Link to="/register" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow-sm">
                        Get Started Free <FaArrowRight className="ms-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
