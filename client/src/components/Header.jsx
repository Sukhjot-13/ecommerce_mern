import React, { useRef, useState } from "react";
import "./header.css";
import shopSphereLogo from "./../assets/images/shopSphereLogo.png";
import { FaHeart, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { IoPersonSharp, IoLogInSharp, IoPersonAddSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdAssignmentAdd } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { Input } from "@chakra-ui/react";

function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const navigate = useNavigate();
	const searchInputRef = useRef(null);
	const { gUser, logOut } = useUserData();
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		// console.log(searchText);
		const searchQuery = searchText;
		searchInputRef.current.blur();
		setSearchText("");
		navigate(`/products?search=${searchQuery}`);
	};

	const handleLogout = async () => {
		logOut();
		setDropdownOpen(false);
		navigate("/login");
	};

	return (
		<div className="header">
			<div className="headerLogo">
				<Link to="/" onClick={() => setMenuOpen(false)}>
					<div className="headerLogoContainer">
						<img src={shopSphereLogo} alt="Shop Sphere Logo" />
					</div>
				</Link>
			</div>
			<div className={`headerLinks ${menuOpen ? "open" : ""}`}>
				<div className="headerPagesLinks">
					<div>
						<Link to="/" onClick={() => setMenuOpen(false)}>
							<FaHeart
								size={20}
								style={{ display: menuOpen ? "block" : "none" }}
							/>
							Home
						</Link>
					</div>
					<div className="headerLinksDivision">|</div>
					<div>
						<Link to="/products" onClick={() => setMenuOpen(false)}>
							<FaCartShopping
								size={20}
								style={{ display: menuOpen ? "block" : "none" }}
							/>
							Products
						</Link>
					</div>
				</div>
			</div>
			<div className="headerRightPart">
				<div className="headerLogos">
					<div className="searchContainer ">
						<form
							onSubmit={handleSearch}
							className="searchFormInline "
						>
							<Input
								htmlSize={23}
								width="auto"
								type="text"
								name="search"
								placeholder="Search..."
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								ref={searchInputRef}
							/>
						</form>
						<FaSearch
							size={20}
							onClick={handleSearch}
							className="secondSearchBar"
						/>
					</div>
					<div className="headerProfile" onClick={toggleDropdown}>
						<IoPersonSharp size={25} color="black" />
						{dropdownOpen && (
							<div className="dropdownMenu">
								{gUser ? (
									<>
										<Link
											to="/profile"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											<IoPersonSharp />
											Profile
										</Link>
										<Link
											to="/myCart"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											<FaCartShopping /> Cart
										</Link>
										{gUser.role === "admin" && (
											<Link
												to="/createProduct"
												onClick={() =>
													setDropdownOpen(false)
												}
											>
												<MdAssignmentAdd /> Create
												Product
											</Link>
										)}
										<div onClick={handleLogout}>
											<FaSignOutAlt /> Logout
										</div>
									</>
								) : (
									<>
										<Link
											to="/login"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											<IoLogInSharp /> Sign In
										</Link>
										<Link
											to="/register"
											onClick={() =>
												setDropdownOpen(false)
											}
										>
											<IoPersonAddSharp /> Sign Up
										</Link>
									</>
								)}
							</div>
						)}
					</div>
					<div className="hamburgerMenuBar">
						<div className="hamburgermenu" onClick={toggleMenu}>
							<GiHamburgerMenu
								size={30}
								className="hamburgerMenuLogo"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Header;
