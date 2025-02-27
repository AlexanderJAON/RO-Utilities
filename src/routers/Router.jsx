import { createBrowserRouter , Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import ROPTAI from "../roptai/ROPTAI";
import Header from "../components/Header";
import ROPTAR from "../roptar/ROPTAR";

const Router = createBrowserRouter([
   
    {
        path: "/roptai",
        element: (
            <>
                <Header/>
                <ROPTAI/>
                <ProtectedRoute><ROPTAI /></ProtectedRoute>
            </>
        )
    },
    {
        path: "/roptar",
        element: (
            <>
                <Header/>
                <ROPTAR/>
                <ProtectedRoute><ROPTAR /></ProtectedRoute>
            </>
        )
    },
    {
        path: "*", // Captura cualquier ruta desconocida
        element: <Navigate to="/roptai" replace />,
    }

]);

export default Router;