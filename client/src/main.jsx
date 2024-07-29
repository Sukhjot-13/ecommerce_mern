import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/Router";

import { UserContextProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
	<UserContextProvider>
		<RouterProvider router={router} />
	</UserContextProvider>
);
