import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useContext, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";

// Create the context
const UserContext = React.createContext();

// Define the provider component
export const UserContextProvider = ({ children }) => {
	const [gUser, gSetUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const userData = {
						uid: user.uid,
						email: user.email,
					};
					const response = await axios.get(
						`${
							import.meta.env.VITE_API_HOST
						}/api/v1/users/getUserId`,
						{ params: { email: user.email } }
					);

					const userId = response.data._id;
					const userRole = response.data.role;
					console.log(userRole);
					const completeUserData = {
						...userData,
						_id: userId,
						role: userRole,
					};
					gSetUser(completeUserData);
					// Every API call carries the caller's backend user id so
					// server ownership/admin guards (requireOwner/requireAdmin)
					// can enforce it. Stopgap until Firebase ID-token
					// verification lands server-side.
					axios.defaults.headers.common["x-user-id"] = userId;
					document.cookie = `uid=${userId}; path=/; max-age=3600`;
				} catch (error) {
					console.error(
						"Error fetching user ID from backend:",
						error
					);
					delete axios.defaults.headers.common["x-user-id"];
					gSetUser(null);
				}
			} else {
				delete axios.defaults.headers.common["x-user-id"];
				gSetUser(null);
				document.cookie = "uid=; path=/; max-age=0";
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const logOut = async () => {
		await signOut(auth);
	};

	return (
		<UserContext.Provider value={{ gUser, gSetUser, logOut, loading }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserData = () => {
	return useContext(UserContext);
};
