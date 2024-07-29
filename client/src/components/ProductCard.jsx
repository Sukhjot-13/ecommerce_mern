import React, { useState } from "react";
import axios from "axios";
import { useUserData } from "../context/UserContext";
import {
	Divider,
	Heading,
	Stack,
	ButtonGroup,
	Image,
	Text,
	Card,
	CardBody,
	CardFooter,
	Button,
	Box,
	Flex,
	Spacer,
	useToast, // Import useToast hook
} from "@chakra-ui/react";

export default function ProductCard({
	name,
	image,
	price,
	description,
	productId,
}) {
	const { gUser } = useUserData();
	const [addedToCart, setAddedToCart] = useState(false);
	const toast = useToast(); // Initialize the useToast hook

	const truncatedDescription =
		description.length > 60
			? `${description.substring(0, 60)}...`
			: description;

	const handleAddToCart = async (event) => {
		event.preventDefault();
		if (!gUser) {
			// Display toast notification for error
			toast({
				title: "Error",
				description: "Please login to add items to your cart.",
				status: "error",
				duration: 2000, // 2 seconds
				isClosable: true,
			});
			return;
		}
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/cart/add`,
				{
					id: gUser._id,
					productId,
					quantity: 1,
				}
			);
			setAddedToCart(true);
			setTimeout(() => setAddedToCart(false), 5000); // Reset after 2 seconds
			console.log(response.data);
			// Display toast notification
			toast({
				title: "Added to cart",
				description: `${name} added to cart successfully.`,
				status: "success",
				duration: 2000, // 2 seconds
				isClosable: true,
			});
		} catch (error) {
			console.error("Error adding to cart:", error);
			// Display toast notification for error
			toast({
				title: "Error",
				description: "Failed to add to cart. Please try again later.",
				status: "error",
				duration: 2000, // 2 seconds
				isClosable: true,
			});
		}
	};

	return (
		<Box w="full" h="full" p={2}>
			<Card
				w="300px"
				h="full"
				borderRadius="lg"
				overflow="hidden"
				boxShadow="lg"
				_hover={{
					transform: "translate(5px, -5px)",
					transition: "transform 0.2s ease",
				}}
			>
				<CardBody h="full">
					<Flex direction="column" h="full">
						<Box>
							<Image
								src={`${
									import.meta.env.VITE_API_HOST
								}/${image}`}
								alt={name}
								borderRadius="lg"
								objectFit="cover"
								w="full"
								h="200px"
							/>
							<Stack mt="6" spacing="3">
								<Heading size="md" h="50px" noOfLines={1}>
									{name}
								</Heading>
								<Text h="60px" noOfLines={2}>
									{truncatedDescription}
								</Text>
								<Text color="1e083b" fontSize="2xl">
									${price}
								</Text>
							</Stack>
						</Box>
						<Spacer />
						<Box>
							<Divider mt="4" />
							<CardFooter>
								<ButtonGroup
									spacing="2"
									w="full"
									justifyContent="center"
								>
									<Button
										bg="#1e083b" // Set the background color to custom purple
										color="white" // Set the text color to white
										variant="solid"
										_hover={{
											bg: "white",
											color: "#1e083b",
											borderColor: "#1e083b",
											borderWidth: "1px",
										}}
										// colorScheme="blue"
										onClick={handleAddToCart}
									>
										Add to cart
									</Button>
								</ButtonGroup>
							</CardFooter>
						</Box>
					</Flex>
				</CardBody>
			</Card>
		</Box>
	);
}
