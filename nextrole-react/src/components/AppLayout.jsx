import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobTracker from "./pages/JobTracker";
import ATSChecker from "./pages/ATSChecker";
import CoverLetter from "./pages/CoverLetter";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {

    const location = useLocation();
    const hideLayout = location.pathname === "/login" || location.pathname === "/register";


    return (
        <>
            {!hideLayout && <Navbar />}

            <Routes>

                <Route path="/" element={<Home />} />

                <Route
                    path="/pricing"
                    element={<Pricing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/resume-builder"
                        element={<ResumeBuilder />}
                    />

                    <Route
                        path="/job-tracker"
                        element={<JobTracker />}
                    />

                    <Route
                        path="/ats-checker"
                        element={<ATSChecker />}
                    />

                    <Route
                        path="/cover-letter"
                        element={<CoverLetter />}
                    />

                </Route>

            </Routes>

            {!hideLayout && <Footer />}
        </>
    );

}

export default AppLayout;