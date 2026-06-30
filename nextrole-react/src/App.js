import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (

    <BrowserRouter>

      <AppLayout />

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