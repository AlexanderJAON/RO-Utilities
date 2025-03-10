import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/use-auth-store.js";

const ProtectedRoute = ({ children })=> {
    const {user}= useAuthStore();

    if(!user){
        return <Navigate to = "/roptar" replace/>
    }
    return children;
}

export default ProtectedRoute;