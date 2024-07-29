import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserData } from "../context/UserContext";
import {
	Box,
	Text,
	Image,
	Flex,
	Button,
	VStack,
	Heading,
	Container,
	IconButton,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ totalAmount, cartProducts, onClose }) => {
	const stripe = useStripe();
	const elements = useElements();
	const { gUser } = useUserData();
	const toast = useToast();
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/payment/intent`,
				{
					amount: totalAmount,
				}
			);

			const clientSecret = response.data.paymentIntent;

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: {
						email: gUser.email,
					},
				},
			});

			if (result.error) {
				toast({
					title: "Error",
					description: "Payment was unsuccessful.",
					status: "error",
					duration: 2000, // 2 seconds
					isClosable: true,
				});
				console.error(result.error.message);
			} else {
				if (result.paymentIntent.status === "succeeded") {
					toast({
						title: "success",
						description: `Payment succeeded!`,
						status: "success",
						duration: 2000, // 2 seconds
						isClosable: true,
					});
					console.log("Payment succeeded!");
					// Prepare items array
					const items = cartProducts.map((product) => ({
						productId: product._id,
						quantity: product.quantity,
						price: product.product.price,
					}));

					// Save order to the backend
					await axios.post(
						`${import.meta.env.VITE_API_HOST}/api/v1/order`,
						{
							userId: gUser._id,
							paymentIntentId: result.paymentIntent.id,
							items: items, // Use prepared items array
							orderTotal: totalAmount,
						}
					);

					onClose();
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement />
			<Button
				type="submit"
				disabled={!stripe}
				colorScheme="green"
				size="lg"
				w="100%"
				mt={4}
			>
				Pay ${totalAmount}
			</Button>
		</form>
	);
};

const MyCart = () => {
	const { gUser } = useUserData();
	const [cart, setCart] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_HOST}/api/v1/cart/${gUser._id}`
				);
				setCart(response.data.cart);
			} catch (error) {
				console.error("Error fetching cart:", error);
			}
		};

		if (gUser) {
			fetchCart();
		}
	}, [gUser]);

	const updateCartState = (productId, quantity) => {
		setCart((prevCart) => {
			const updatedProducts = prevCart.products
				.map((item) => {
					if (item.product._id === productId) {
						return { ...item, quantity: item.quantity + quantity };
					}
					return item;
				})
				.filter((item) => item.quantity > 0);
			return { ...prevCart, products: updatedProducts };
		});
	};

	const removeFromCartState = (productId) => {
		setCart((prevCart) => {
			const updatedProducts = prevCart.products.filter(
				(item) => item.product._id !== productId
			);
			return { ...prevCart, products: updatedProducts };
		});
	};

	const handleQuantityChange = async (productId, quantity) => {
		try {
			await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/cart/add`,
				{
					id: gUser._id,
					productId,
					quantity,
				}
			);
			updateCartState(productId, quantity);
		} catch (error) {
			console.error("Error updating cart:", error);
		}
	};

	const handleRemoveFromCart = async (productId) => {
		try {
			await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/cart/remove`,
				{
					id: gUser._id,
					productId,
				}
			);
			removeFromCartState(productId);
		} catch (error) {
			console.error("Error removing from cart:", error);
		}
	};

	if (!cart) {
		return <div>Loading...</div>;
	}

	const totalAmount = cart.products.reduce(
		(acc, item) => acc + item.product.price * item.quantity,
		0
	);

	return (
		<Container maxW="container.xl" p={4}>
			<Heading as="h1" size="2xl" mb={6} textAlign="center">
				My Cart
			</Heading>
			<Flex
				direction={{ base: "column", lg: "row" }}
				wrap="wrap"
				justifyContent="space-between"
			>
				<Box flex="1" mr={{ lg: 4 }}>
					<VStack align="stretch" spacing={4}>
						{cart.products.map((item) => (
							<Box
								key={item.product._id}
								p={4}
								borderWidth="1px"
								borderRadius="lg"
								shadow="md"
							>
								<Flex align="center">
									<Image
										src={`${
											import.meta.env.VITE_API_HOST
										}/${item.product.images?.[0]}`}
										alt={item.product.name}
										boxSize="100px"
										objectFit="cover"
										mr={4}
									/>
									<Box flex="1">
										<Text fontSize="xl" fontWeight="bold">
											{item.product.name}
										</Text>
										<Text>Brand: {item.product.brand}</Text>
										<Text>
											Price: ${item.product.price}
										</Text>
										<Text>
											Total: $
											{item.product.price * item.quantity}
										</Text>
									</Box>
									<Box>
										<IconButton
											icon={<AddIcon />}
											size="sm"
											onClick={() =>
												handleQuantityChange(
													item.product._id,
													1
												)
											}
											mr={2}
										/>
										<Text display="inline" mx={2}>
											{item.quantity}
										</Text>
										<IconButton
											icon={<MinusIcon />}
											size="sm"
											onClick={() =>
												handleQuantityChange(
													item.product._id,
													-1
												)
											}
											mr={2}
											isDisabled={item.quantity === 1}
										/>
										<Button
											colorScheme="red"
											size="sm"
											onClick={() =>
												handleRemoveFromCart(
													item.product._id
												)
											}
										>
											Remove
										</Button>
									</Box>
								</Flex>
							</Box>
						))}
					</VStack>
				</Box>
				<Box flex="1" ml={{ lg: 4 }} mt={{ base: 4, lg: 0 }}>
					<Box bg="gray.100" p={6} borderRadius="md" shadow="md">
						<Text fontSize="2xl" mb={4}>
							Total Amount: ${totalAmount}
						</Text>
						<Button
							colorScheme="green"
							size="lg"
							w="100%"
							onClick={onOpen}
						>
							Place Order
						</Button>
					</Box>
				</Box>
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Enter Payment Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Elements stripe={stripePromise}>
							<CheckoutForm
								totalAmount={totalAmount}
								cartProducts={cart.products}
								onClose={onClose}
							/>
						</Elements>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	);
};

export default MyCart;
