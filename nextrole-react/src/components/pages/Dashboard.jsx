import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "./Dashboard.css";
import { getJobs } from "../../services/jobService";
import { getResume } from "../../services/resumeService";
import { getAtsResults } from "../../services/atsService";
import {
    FaFileAlt,
    FaBriefcase,
    FaCheckCircle,
    FaArrowRight,
    FaChartBar,
    FaClock,
    FaCheck,
    FaUserCircle
} from "react-icons/fa";

function Dashboard() {
    const dashboardRef = useRef(null);
    const jobCounterRef = useRef(null);
    const resumeCounterRef = useRef(null);
    const atsCounterRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const [jobCount, setJobCount] = useState(0);
    const [hasResume, setHasResume] = useState(false);
    const [atsCount, setAtsCount] = useState(0);

    // Dynamic greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const load = async () => {
            try {
                const jobsRes = await getJobs();
                const total = jobsRes?.count ?? (jobsRes?.jobs?.length ?? 0);
                setJobCount(total);
            } catch (e) {
                console.warn("Failed to load jobs for dashboard", e);
                try {
                    const localJobs = JSON.parse(localStorage.getItem("nextrole_job_applications") || "[]");
                    setJobCount(localJobs.length);
                } catch {}
            }

            try {
                const resumeRes = await getResume();
                setHasResume(!!resumeRes?.resume);
            } catch (e) {
                console.warn("Failed to load resume for dashboard", e);
            }

            try {
                const atsRes = await getAtsResults();
                const count = (atsRes?.atsResults || []).length;
                setAtsCount(count);
            } catch (e) {
                console.warn("Failed to load ATS results for dashboard", e);
            }
        };

        load();
    }, []);

    // GSAP entrance and animated counters
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Hero banner slide down and fade
            tl.from(".dashboard-hero-banner", {
                y: -25,
                opacity: 0,
                duration: 0.7
            })
                .from(
                    ".dashboard-stat-box",
                    {
                        scale: 0.9,
                        opacity: 0,
                        stagger: 0.1,
                        duration: 0.5
                    },
                    "-=0.3"
                )
                // Action cards stagger
                .from(
                    ".dash-action-card",
                    {
                        y: 30,
                        opacity: 0,
                        stagger: 0.15,
                        duration: 0.6
                    },
                    "-=0.2"
                )
                // Bottom panels
                .from(
                    ".dash-panel",
                    {
                        y: 25,
                        opacity: 0,
                        stagger: 0.15,
                        duration: 0.6
                    },
                    "-=0.2"
                );

            // Animate number counters smoothly from 0 to targets
            if (jobCounterRef.current) {
                gsap.fromTo(
                    jobCounterRef.current,
                    { innerText: 0 },
                    {
                        innerText: jobCount,
                        snap: { innerText: 1 },
                        duration: 1.2,
                        ease: "power2.out"
                    }
                );
            }
            if (resumeCounterRef.current) {
                gsap.fromTo(
                    resumeCounterRef.current,
                    { innerText: 0 },
                    {
                        innerText: hasResume ? 1 : 0,
                        snap: { innerText: 1 },
                        duration: 1.0,
                        ease: "power2.out"
                    }
                );
            }
            if (atsCounterRef.current) {
                gsap.fromTo(
                    atsCounterRef.current,
                    { innerText: 0 },
                    {
                        innerText: atsCount,
                        snap: { innerText: 1 },
                        duration: 1.2,
                        ease: "power2.out"
                    }
                );
            }
        }, dashboardRef);

        return () => ctx.revert();
    }, [jobCount, hasResume, atsCount]);

    const activityCards = [
        {
            title: "Resume Builder",
            icon: <FaFileAlt className="text-primary fs-3" />,
            description: hasResume
                ? "You have a saved resume in your profile. Click to edit or tailor to a new JD."
                : "Create, format, and download an ATS-tailored resume in minutes.",
            link: "/resume-builder",
            badge: hasResume ? "Saved & Ready" : "Start Now",
            badgeClass: hasResume ? "badge-success" : "badge-primary",
            actionText: "Open Resume Studio"
        },
        {
            title: "Real ATS Checker",
            icon: <FaCheckCircle className="text-success fs-3" />,
            description: atsCount > 0
                ? `You have ${atsCount} saved ATS scan${atsCount > 1 ? "s" : ""}. Test against new roles anytime.`
                : "Analyze your resume against real ATS algorithms, find missing skills, and inject them.",
            link: "/ats-checker",
            badge: atsCount > 0 ? `${atsCount} Analyses` : "New Analysis",
            badgeClass: atsCount > 0 ? "badge-info" : "badge-secondary",
            actionText: "Launch ATS Scanner"
        },
        {
            title: "Job Tracker",
            icon: <FaBriefcase className="text-info fs-3" />,
            description: jobCount > 0
                ? `Tracking ${jobCount} active application${jobCount > 1 ? "s" : ""}. Keep your pipeline organized.`
                : "Track application statuses, interview rounds, and response rates in one spot.",
            link: "/job-tracker",
            badge: jobCount > 0 ? `${jobCount} Active` : "Organize Pipeline",
            badgeClass: jobCount > 0 ? "badge-warning" : "badge-secondary",
            actionText: "View Applications"
        }
    ];

    return (
        <div ref={dashboardRef} className="dashboard-page">
            {/* Hero Welcome Banner */}
            <section className="dashboard-hero-banner">
                <div className="d-flex align-items-center gap-3">
                    <div className="dashboard-avatar-ring">
                        <FaUserCircle className="dashboard-avatar-icon" />
                    </div>
                    <div>
                        <p className="dashboard-eyebrow mb-1">
                            {getGreeting()} • Career Command Center
                        </p>
                        <h1 className="dashboard-heading mb-1">
                            Welcome back, {user?.name || "Professional"} 👋
                        </h1>
                        <p className="dashboard-subtext mb-0">
                            Here is your career activity snapshot. Keep your momentum going and stay ahead of every interview.
                        </p>
                    </div>
                </div>

                {/* Animated Activity Snapshot Stats */}
                <div className="dashboard-stats-strip mt-4">
                    <div className="dashboard-stat-box">
                        <span className="stat-label">Tracked Jobs</span>
                        <span className="stat-val text-primary" ref={jobCounterRef}>
                            {jobCount}
                        </span>
                        <span className="stat-sub">Active Applications</span>
                    </div>

                    <div className="dashboard-stat-box">
                        <span className="stat-label">Saved Resumes</span>
                        <span className="stat-val text-success" ref={resumeCounterRef}>
                            {hasResume ? 1 : 0}
                        </span>
                        <span className="stat-sub">{hasResume ? "Up to date" : "Not created yet"}</span>
                    </div>

                    <div className="dashboard-stat-box">
                        <span className="stat-label">ATS Scans</span>
                        <span className="stat-val text-info" ref={atsCounterRef}>
                            {atsCount}
                        </span>
                        <span className="stat-sub">Evaluated Roles</span>
                    </div>
                </div>
            </section>

            {/* Quick Action Cards Grid */}
            <section className="dashboard-action-grid mb-4">
                {activityCards.map((card) => (
                    <Link to={card.link} key={card.title} className="dash-action-card">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="dash-card-icon-box">{card.icon}</div>
                            <span className={`dash-badge ${card.badgeClass}`}>{card.badge}</span>
                        </div>
                        <h3 className="dash-card-title mb-2">{card.title}</h3>
                        <p className="dash-card-desc text-muted mb-4">{card.description}</p>
                        <div className="dash-card-footer">
                            <span className="dash-action-link">
                                {card.actionText} <FaArrowRight className="ms-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </section>

            {/* Bottom Insight & Next Steps Panels */}
            <section className="dashboard-bottom-grid">
                <div className="dash-panel">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <FaChartBar className="text-primary fs-4" />
                        <h3 className="dash-panel-title mb-0">Associate Frontend Role Focus</h3>
                    </div>
                    <p className="text-muted small mb-3">
                        Key skills top hiring managers look for in Associate Frontend Engineer candidates right now:
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {["React 18/19", "JavaScript (ES6+)", "TypeScript", "REST APIs", "Redux / Zustand", "CSS3 / Tailwind", "Jest Testing", "Web Performance"].map((tag) => (
                            <span key={tag} className="badge bg-light text-dark border">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="small text-muted mb-0">
                        💡 <strong>Pro Tip:</strong> Ensure these keywords appear naturally in your resume's Skills and Project highlights using the <strong>Real ATS Checker</strong>.
                    </p>
                </div>

                <div className="dash-panel">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <FaClock className="text-success fs-4" />
                        <h3 className="dash-panel-title mb-0">Interview Readiness Checklist</h3>
                    </div>
                    <ul className="dash-checklist">
                        <li>
                            <FaCheck className="text-success me-2" />
                            <span>Tailor your resume specifically for the target Associate Frontend role</span>
                        </li>
                        <li>
                            <FaCheck className="text-success me-2" />
                            <span>Verify your ATS match score is above 80% with zero critical missing skills</span>
                        </li>
                        <li>
                            <FaCheck className="text-success me-2" />
                            <span>Prepare STAR method stories for React component architecture and state management</span>
                        </li>
                        <li>
                            <FaCheck className="text-success me-2" />
                            <span>Keep your application tracker updated with interviewer notes and stage dates</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
