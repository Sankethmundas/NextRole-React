import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/pages/Home.jsx";
import ResumeBuilder from "./components/pages/ResumeBuilder.jsx";
import JobTracker from "./components/pages/JobTracker.jsx";
import ATSChecker from "./components/pages/ATSChecker.jsx";
import CoverLetter from "./components/pages/CoverLetter.jsx";
import Pricing from "./components/pages/Pricing.jsx";
import Login from "./components/pages/Login.jsx";
import Register from "./components/pages/Register.jsx";
import Footer from "./components/Footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

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

      </Routes>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
      />

    </BrowserRouter>

  );

}

export default App;