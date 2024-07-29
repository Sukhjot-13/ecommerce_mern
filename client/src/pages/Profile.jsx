// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useUserData } from "../context/UserContext";
// import {
// 	Box,
// 	Button,
// 	Divider,
// 	Heading,
// 	Stack,
// 	Text,
// 	useToast,
// } from "@chakra-ui/react";

// function Profile() {
// 	const { gUser } = useUserData();
// 	const [profileData, setProfileData] = useState(null);
// 	const toast = useToast();

// 	useEffect(() => {
// 		// Fetch user profile data when the component mounts
// 		fetchProfileData();
// 	}, []);

// 	const fetchProfileData = async () => {
// 		try {
// 			const response = await axios.get(
// 				`${import.meta.env.VITE_API_HOST}/api/v1/users/${gUser._id}`
// 			);
// 			console.log(response.data.user);
// 			setProfileData(response.data.user);
// 		} catch (error) {
// 			console.error("Error fetching profile data:", error);
// 			// Display error toast notification
// 			toast({
// 				title: "Error",
// 				description:
// 					"Failed to fetch profile data. Please try again later.",
// 				status: "error",
// 				duration: 3000,
// 				isClosable: true,
// 			});
// 		}
// 	};

// 	const handleEditProfile = () => {
// 		// Navigate to the edit profile page or show a modal for editing
// 		console.log("Edit profile clicked");
// 	};

// 	return (
// 		<Box p={4}>
// 			<Heading size="lg" mb={4}>
// 				Profile Details
// 			</Heading>
// 			{profileData ? (
// 				<Stack spacing={4}>
// 					<Box>
// 						<Text fontWeight="bold">Name: </Text>
// 						<Text>{profileData.userName}</Text>
// 					</Box>
// 					<Box>
// 						<Text fontWeight="bold">Email: </Text>
// 						<Text>{profileData.email}</Text>
// 					</Box>

// 					<Divider />
// 				</Stack>
// 			) : (
// 				<Text>Loading profile data...</Text>
// 			)}
// 		</Box>
// 	);
// }

// export default Profile;

///
///
//
//
//
//
//
import { useState, useEffect } from "react";
import axios from "axios";
import { useUserData } from "../context/UserContext";
import {
	Box,
	Divider,
	Heading,
	Stack,
	Text,
	useToast,
	Flex,
	Image,
	Grid,
} from "@chakra-ui/react";

function Profile() {
	const { gUser } = useUserData();
	const [profileData, setProfileData] = useState(null);
	const [cartItems, setCartItems] = useState([]);
	const [orders, setOrders] = useState([]);
	const toast = useToast();

	useEffect(() => {
		fetchProfileData();
		fetchCartItems();
		fetchOrders();
	}, []);

	const fetchProfileData = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_HOST}/api/v1/users/${gUser._id}`
			);
			setProfileData(response.data.user);
		} catch (error) {
			toast({
				title: "Error",
				description:
					"Failed to fetch profile data. Please try again later.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const fetchCartItems = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_HOST}/api/v1/cart/${gUser._id}`
			);
			setCartItems(response.data.cart.products);
		} catch (error) {
			toast({
				title: "Error",
				description:
					"Failed to fetch cart items. Please try again later.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const fetchOrders = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_HOST}/api/v1/order?userId=${
					gUser._id
				}`
			);
			setOrders(response.data.orders);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch orders. Please try again later.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box p={4}>
			<Heading size="lg" mb={4}>
				Profile Details
			</Heading>
			{profileData ? (
				<Stack spacing={4} mb={6}>
					<Box>
						<Text fontWeight="bold">Name: </Text>
						<Text>{profileData.userName}</Text>
					</Box>
					<Box>
						<Text fontWeight="bold">Email: </Text>
						<Text>{profileData.email}</Text>
					</Box>

					<Divider />
				</Stack>
			) : (
				<Text>Loading profile data...</Text>
			)}
			<Heading size="md" mb={4}>
				Cart Items
			</Heading>
			{cartItems.length > 0 ? (
				<Grid
					templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
					gap={4}
				>
					{cartItems.map((item, index) => (
						<Box
							key={index}
							p={4}
							borderWidth="1px"
							borderRadius="lg"
							overflow="hidden"
						>
							<Flex>
								<Image
									src={`${import.meta.env.VITE_API_HOST}/${
										item.product.images[0]
									}`}
									alt={item.product.name}
									boxSize="100px"
									objectFit="cover"
									mr={4}
								/>
								<Box>
									<Text fontWeight="bold">
										{item.product.name}
									</Text>
									<Text>Quantity: {item.quantity}</Text>
									<Text>
										Price: ${item.product.price.toFixed(2)}
									</Text>
								</Box>
							</Flex>
						</Box>
					))}
				</Grid>
			) : (
				<Text>No items in cart</Text>
			)}
			<Divider my={6} />
			<Heading size="md" mb={4}>
				Orders
			</Heading>
			{orders.length > 0 ? (
				<Stack spacing={4}>
					{orders.map((order, index) => (
						<Box
							key={index}
							p={4}
							borderWidth="1px"
							borderRadius="lg"
						>
							<Text fontWeight="bold">Order ID: {order._id}</Text>
							<Text>
								Order Total: ${order.orderTotal.toFixed(2)}
							</Text>
							<Text>
								Placed on:{" "}
								{new Date(order.createdAt).toLocaleDateString()}
							</Text>
							<Divider my={2} />
							{order.items.map((item) => (
								<Flex key={item._id} mb={2}>
									{item.productId &&
									item.productId.images &&
									item.productId.images.length > 0 ? (
										<Image
											src={`${
												import.meta.env.VITE_API_HOST
											}/${item.productId.images[0]}`}
											alt={item.productId.name}
											boxSize="50px"
											objectFit="cover"
											mr={4}
										/>
									) : (
										<Box
											boxSize="50px"
											bg="gray.200"
											mr={4}
										/>
									)}
									<Box>
										{item.productId ? (
											<>
												<Text fontWeight="bold">
													{item.productId.name}
												</Text>
												<Text>
													Quantity: {item.quantity}
												</Text>
												<Text>
													Price: $
													{item.price.toFixed(2)}
												</Text>
											</>
										) : (
											<Text fontWeight="bold">
												Product not found
											</Text>
										)}
									</Box>
								</Flex>
							))}
						</Box>
					))}
				</Stack>
			) : (
				<Text>No orders found</Text>
			)}
		</Box>
	);
}

export default Profile;
