import { Link } from "react-router-dom";
import "./Home.css";
import FeatureCard from "../Feature-card";
import features from "../../data/features";

function Home() {

    return (

        <>

            <section className="container hero">

                <h1 className="display-4 fw-bold">
                    The Smarter Way to Manage Your Career Journey.
                </h1>

                <p className="hero-text">
                    Create ATS-friendly resumes, organize your job search,
                    and stay ahead of every opportunity with NextRole.
                </p>

                <div className="mt-4">

                    <Link
                        to="/resume-builder"
                        className="btn btn-primary me-3"
                    >
                        Build Resume
                    </Link>

                    <Link
                        to="/job-tracker"
                        className="btn btn-outline-primary"
                    >
                        Track Jobs
                    </Link>

                </div>

            </section>

            <section className="container py-5">

                <h2 className="text-center features-title">                    
                    Everything You Need To Land Your Next Role
                </h2>

                <div className="row">

                    {
                        features.map((feature, index) => (

                            <div
                                className="col-md-6 col-lg-3 mb-4"
                                key={index}
                            >

                                <FeatureCard
                                    title={feature.title}
                                    description={feature.description}
                                />

                            </div>

                        ))
                    }

                </div>

            </section>

            <section className="container py-5">

                <h2 className="text-center mb-5">
                    How NextRole Works
                </h2>

                <div className="row text-center">

                    <div className="col-md-3 mb-4">
                        <h1>1</h1>
                        <h4>Build Resume</h4>
                        <p>Create your ATS-friendly resume.</p>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h1>2</h1>
                        <h4>Apply Jobs</h4>
                        <p>Apply for jobs with confidence.</p>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h1>3</h1>
                        <h4>Track Progress</h4>
                        <p>Track every application from one dashboard.</p>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h1>4</h1>
                        <h4>Get Hired</h4>
                        <p>Get more interviews and offers.</p>
                    </div>

                </div>

            </section>

            <section className="container text-center py-5">

                <h2>
                    Ready To Land Your Next Role?
                </h2>

                <p className="text-muted">
                    Join thousands of job seekers using NextRole
                    to build resumes and track applications.
                </p>

                <Link
                    to="/register"
                    className="btn btn-primary"
                >
                    Get Started
                </Link>

            </section>

        </>

    );

}

export default Home;