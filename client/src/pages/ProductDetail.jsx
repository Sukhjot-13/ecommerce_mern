import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useUserData } from "../context/UserContext";
import {
	Box,
	Flex,
	Heading,
	Text,
	Image,
	Button,
	List,
	ListItem,
	VStack,
	Divider,
	Container,
	useToast,
} from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ProductDetail() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const { gUser } = useUserData();
	const toast = useToast();

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_HOST}/api/v1/products/${slug}`
				);
				setProduct(response.data.product);
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		fetchProduct();
	}, [slug]);

	if (!product) {
		return <div>Loading...</div>;
	}

	const handleAddReview = () => {
		if (!gUser) {
			navigate("/login");
		}
	};

	const handleAddToCart = async (event) => {
		event.preventDefault();
		if (!gUser) {
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
					productId: product._id,
					quantity: 1,
				}
			);
			toast({
				title: "Added to cart",
				description: `${product.name} added to cart successfully.`,
				status: "success",
				duration: 2000, // 2 seconds
				isClosable: true,
			});
		} catch (error) {
			console.error("Error adding to cart:", error);
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
		<Container maxW="container.xl" p={4}>
			<Heading as="h1" size="2xl" mb={6} textAlign="center">
				{product.name}
			</Heading>
			<Flex
				direction={{ base: "column", md: "row" }}
				wrap="wrap"
				justifyContent="space-between"
				mb={6}
			>
				<Box flex="1" p={4}>
					<Carousel
						showThumbs={false}
						showStatus={false}
						infiniteLoop
						useKeyboardArrows
						autoPlay
					>
						{product.images.map((image, index) => (
							<div key={index}>
								<Image
									src={`${
										import.meta.env.VITE_API_HOST
									}/${image}`}
									alt={`${product.name}-${index}`}
									borderRadius="md"
									maxWidth="100%"
									maxHeight="400px" // Adjust height as per your design
									objectFit="contain"
								/>
							</div>
						))}
					</Carousel>
				</Box>
				<Box flex="1" p={4}>
					<VStack align="start" spacing={4}>
						<Box>
							<Heading as="h3" size="md">
								Brand
							</Heading>
							<Text fontSize="lg" color="gray.700">
								{product.brand}
							</Text>
						</Box>
						<Box>
							<Heading as="h3" size="md">
								Category
							</Heading>
							<Text fontSize="lg" color="gray.700">
								{product.category.name}
							</Text>
						</Box>
						<Box>
							<Heading as="h3" size="md">
								Price
							</Heading>
							<Text
								fontSize="2xl"
								fontWeight="bold"
								color="blue.600"
							>
								${product.price}
							</Text>
						</Box>
						<Button
							colorScheme="blue"
							size="lg"
							onClick={handleAddToCart}
							width="full"
						>
							Add to Cart
						</Button>
					</VStack>
				</Box>
			</Flex>
			<Divider my={6} />
			<Box>
				<Heading as="h3" size="md">
					Description
				</Heading>
				<Text fontSize="lg" color="gray.700">
					{product.description}
				</Text>
			</Box>
			<Box mb={6}>
				<Heading as="h3" size="md" mb={4}>
					Tags
				</Heading>
				<List spacing={2} styleType="disc">
					{product.tags.map((tag, index) => (
						<ListItem key={index} fontSize="lg" color="gray.700">
							{tag}
						</ListItem>
					))}
				</List>
			</Box>
			<Box mb={6}>
				<Heading as="h3" size="md" mb={4}>
					Features
				</Heading>
				<List spacing={2} styleType="disc">
					{product.additionalFeatures.map((feature, index) => (
						<ListItem key={index} fontSize="lg" color="gray.700">
							{feature}
						</ListItem>
					))}
				</List>
			</Box>
			<Divider my={6} />
			<Box>
				<Heading as="h3" size="md" mb={4}>
					Reviews
				</Heading>
				<ReviewList reviews={product.reviews} />
				{gUser ? (
					<ReviewForm productId={product._id} />
				) : (
					<Button colorScheme="blue" onClick={handleAddReview}>
						Add Review
					</Button>
				)}
			</Box>
		</Container>
	);
}

export default ProductDetail;
