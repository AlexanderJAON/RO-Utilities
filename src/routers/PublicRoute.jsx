import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/use-auth-store.js";

const PublicRoute = ({ children })=> {
    const {user}= useAuthStore();

    if(user){
        return <Navigate to = "/roptai" replace/>
    }
    return children;
}

export default PublicRoute;