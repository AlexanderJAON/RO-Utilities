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
                
            </>
        )
    },
    {
        path: "/roptar",
        element: (
            <>
                <Header/>
                <ROPTAR/>
                
            </>
        )
    },

]);

export default Router;