import { createBrowserRouter , Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import ROPTAI from "../roptai/ROPTAI";
import Header from "../components/Header";
import ROPTAR from "../roptar/ROPTAR";

const Router = createBrowserRouter([
    {
        path: "/roptai",
        element: (
            <ProtectedRoute>
                <Header />
                <ROPTAI />
            </ProtectedRoute>
        ),
    },
    {
        path: "/roptar",
        element: (
            <ProtectedRoute>
                <Header />
                <ROPTAR />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <Navigate to="/roptai" replace />,
    },
]);


export default Router;