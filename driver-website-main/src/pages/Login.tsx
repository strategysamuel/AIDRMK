import { Navigate } from "react-router-dom";

// Legacy route — redirect to the real authentication flow.
const Login = () => <Navigate to="/pin-login" replace />;

export default Login;
