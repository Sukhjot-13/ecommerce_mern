// // src/pages/Product.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import "./Product.css";

// function Product() {
// 	const [products, setProducts] = useState([]);
// 	const [totalPages, setTotalPages] = useState(1);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const location = useLocation();
// 	const navigate = useNavigate();

// 	const fetchProducts = async () => {
// 		try {
// 			const response = await axios.get(
// 				`${import.meta.env.VITE_API_HOST}/api/v1/products${
// 					location.search
// 				}`
// 			);
// 			console.log(response.data);
// 			setProducts(response.data.data.products);
// 			setTotalPages(response.data.totalPages);
// 			setCurrentPage(
// 				parseInt(new URLSearchParams(location.search).get("page")) || 1
// 			);
// 		} catch (error) {
// 			console.error("Error fetching products:", error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchProducts();
// 	}, [location.search]);

// 	const handlePageChange = (page) => {
// 		const searchParams = new URLSearchParams(location.search);
// 		searchParams.set("page", page);
// 		navigate({
// 			search: searchParams.toString(),
// 		});
// 	};

// 	useEffect(() => {
// 		window.scrollTo(0, 0); // Scroll to top when currentPage changes
// 	}, [currentPage]);

// 	return (
// 		<div className="productPage">
// 			<h1>Product Page</h1>
// 			<div className="productGrid">
// 				{products.map((product) => (
// 					<Link to={`/products/${product.slug}`} key={product._id}>
// 						<ProductCard
// 							name={product.name}
// 							image={product.images[0]}
// 							price={product.price}
// 							brandName={product.brandName}
// 							slug={product.slug}
// 							productId={product._id}
// 							description={product.description}
// 						/>
// 					</Link>
// 				))}
// 			</div>
// 			<div className="pagination">
// 				{Array.from({ length: totalPages }, (_, index) => (
// 					<button
// 						key={index}
// 						onClick={() => handlePageChange(index + 1)}
// 						className={currentPage === index + 1 ? "active" : ""}
// 					>
// 						{index + 1}
// 					</button>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

// export default Product;

//////////////
////////////
// src/pages/Product.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Product.css";

function Product() {
	const [products, setProducts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [categories, setCategories] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const location = useLocation();
	const navigate = useNavigate();

	const fetchProducts = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_HOST}/api/v1/products${
					location.search
				}`
			);
			setProducts(response.data.data.products);
			setTotalPages(response.data.totalPages);
			setCurrentPage(
				parseInt(new URLSearchParams(location.search).get("page")) || 1
			);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};
	const fetchCategories = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_HOST}/api/v1/categories`
			);
			setCategories(response.data.data.categories);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};
	useEffect(() => {
		fetchProducts();
	}, [location.search]);
	useEffect(() => {
		fetchCategories();
	}, []);

	const handlePageChange = (page) => {
		const searchParams = new URLSearchParams(location.search);
		searchParams.set("page", page);
		navigate({
			search: searchParams.toString(),
		});
	};
	const handleCategoryChange = (event) => {
		const searchParams = new URLSearchParams(location.search);
		const selectedCategory = event.target.value;

		if (!selectedCategory) {
			// "All Categories" selected, remove category parameter
			searchParams.delete("category");
		} else {
			searchParams.set("category", selectedCategory);
		}
		searchParams.set("page", 1); // Reset to page 1 when category changes
		navigate({
			search: searchParams.toString(),
		});
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to top when currentPage changes
	}, [currentPage]);

	return (
		<div className="productPage">
			<h1>Product Page</h1>
			<div className="categoryFilter">
				<select onChange={handleCategoryChange}>
					<option value="">All Categories</option>
					{categories.map((category) => (
						<option key={category._id} value={category._id}>
							{category.name}
						</option>
					))}
				</select>
			</div>
			<div className="productGrid">
				{products.map((product) => (
					<Link to={`/products/${product.slug}`} key={product._id}>
						<ProductCard
							name={product.name}
							image={product.images[0]}
							price={product.price}
							brandName={product.brandName}
							slug={product.slug}
							productId={product._id}
							description={product.description}
						/>
					</Link>
				))}
			</div>
			<div className="pagination">
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index}
						onClick={() => handlePageChange(index + 1)}
						className={currentPage === index + 1 ? "active" : ""}
					>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	);
}

export default Product;
