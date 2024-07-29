import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import App from "../App";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Product from "../pages/Product";
import { PrivateRoutes, AdminRoutes } from "./PrivateRoutes";
import CreateProduct from "../pages/CreateProduct";
import ProductDetail from "../pages/ProductDetail";
import MyCart from "../pages/MyCart";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import Success from "../components/Success";
export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route index element={<Home />} />

			<Route path="login" element={<SignIn />} />
			<Route path="register" element={<SignUp />} />

			<Route element={<PrivateRoutes />}>
				<Route path="myCart" element={<MyCart />} />
				<Route path="profile" element={<Profile />} />
				<Route path="success" element={<Success />} />
			</Route>

			<Route element={<AdminRoutes />}>
				<Route path="createProduct" element={<CreateProduct />} />
			</Route>

			<Route path="products" element={<Product />} />
			<Route path="/products/:slug" element={<ProductDetail />} />
		</Route>
	)
);
