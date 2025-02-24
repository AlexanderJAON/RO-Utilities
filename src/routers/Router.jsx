import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import ROPTAI from "../roptai/ROPTAI";
import Header from "../components/Header";


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
    

]);

export default Router;