import { Outlet, Navigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";

const PrivateRoutes = () => {
	const { gUser, loading } = useUserData();

	if (loading) {
		return <div>Loading...</div>; // You can customize this loading indicator
	}

	return gUser ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoutes = () => {
	const { gUser, loading } = useUserData();

	if (loading) {
		return <div>Loading...</div>; // You can customize this loading indicator
	}

	return gUser && gUser.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export { PrivateRoutes, AdminRoutes };
