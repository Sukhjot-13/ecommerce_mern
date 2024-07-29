import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Image,
	SimpleGrid,
	Text,
	Stack,
} from "@chakra-ui/react";
import { FaTruck, FaBox, FaShieldAlt } from "react-icons/fa";
import { StarIcon } from "@chakra-ui/icons";
// import summerCollection from "../assets/images/summer.png";
import ecoFriendly from "../assets/images/ecoFriendly.jpg";
import { useNavigate } from "react-router";
import { Carousel } from "react-responsive-carousel";
function Home() {
	const navigate = useNavigate();
	const testimonials = [
		{
			name: "Liam T.",
			feedback:
				"Shopping here has been a fantastic experience. The site offers a wide range of high-quality products at competitive prices.",
			avatar: "/path/to/avatar1.jpg",
			rating: 5,
		},
		{
			name: "David L.",
			feedback:
				"This site is my go-to for all my shopping needs. The range of products is extensive, and everything I've bought has been top-notch.",
			avatar: "/path/to/avatar2.jpg", // Replace with actual path to the avatar image
			rating: 5,
		},
		{
			name: "Emma W.",
			feedback:
				"I love the variety of eco-friendly products available here! The quality is top-notch, and I feel great knowing my purchases are helping the environment.",
			avatar: "/path/to/avatar3.jpg", // Replace with actual path to the avatar image
			rating: 5,
		},
	];
	const carouselData = [
		{
			imageUrl:
				//  summerCollection,
				"https://images.unsplash.com/photo-1479752524501-2a1efb81c407?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			altText: "Summer Collection",
			heading: "SHOP OUR SUMMER COLLECTION",
			buttonText: "Shop Now",
			buttonLink: "/products?search=summer", // Corrected category parameter
		},
		{
			imageUrl:
				// "https://images.pexels.com/photos/2562992/pexels-photo-2562992.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
				"https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
			altText: "Shoes Collection", // Update alt text
			heading: "SHOP OUR SHOES COLLECTION",
			buttonText: "Shop Now",
			buttonLink: "/products?search=shoes", // Corrected category parameter
		},
		// Add more carousel items here following the same structure
	];

	return (
		<Box>
			{/* Banner Section */}
			{/*  */}
			{/*  */}
			<Box flex="1" w={"100%"} m={"auto"}>
				<Carousel
					showThumbs={false}
					showStatus={false}
					infiniteLoop
					useKeyboardArrows
					autoPlay
					width={"100%"}
					// height={"70vh"}
				>
					{carouselData.map((item) => (
						<Box key={item.altText} position="relative">
							<Image
								src={item.imageUrl}
								alt={item.altText}
								height={"70vh"}
								aspectRatio={"16/9"}
								objectFit="cover"
							/>
							<Box
								position="absolute"
								top="0"
								left="0"
								width="100%"
								height="100%"
								bg="rgba(0, 0, 0, 0.4	)"
								display="flex"
								alignItems="center"
								justifyContent="center"
								flexDirection="column"
							>
								<Heading
									as="h1"
									color="white"
									fontSize="4xl"
									textAlign="center"
									mb="4"
								>
									{item.heading}
								</Heading>
								<Button
									bg="#1e083b"
									color="white"
									size="lg"
									_hover={{ bg: "white", color: "#1e083b" }}
									onClick={() => {
										navigate(item.buttonLink);
									}}
								>
									{item.buttonText}
								</Button>
							</Box>
						</Box>
					))}
				</Carousel>
			</Box>
			{/*  */}

			{/* Why Choose Us Section */}
			<Container maxW="container.xl" mt="8">
				<Heading as="h2" textAlign="center" mb="8">
					Why Choose Us
				</Heading>
				<SimpleGrid columns={[1, 1, 3]} spacing="8" textAlign="center">
					<Box textAlign="center">
						<Flex
							width="80px"
							height="80px"
							borderRadius="full"
							bg="#1e083b"
							color="white"
							alignItems="center"
							justifyContent="center"
							mx="auto"
							mb="4"
							transition="all 0.3s ease"
							_hover={{
								bg: "white",
								color: "#1e083b",
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							}}
						>
							<FaTruck size="3em" />
						</Flex>
						<Text fontSize="xl" mt="4">
							Get your orders delivered to your doorstep quickly
							and reliably.
						</Text>
					</Box>
					<Box textAlign="center">
						<Flex
							width="80px"
							height="80px"
							borderRadius="full"
							bg="#1e083b"
							color="white"
							alignItems="center"
							justifyContent="center"
							mx="auto"
							mb="4"
							transition="all 0.3s ease"
							_hover={{
								bg: "white",
								color: "#1e083b",
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							}}
						>
							<FaBox size="3em" />
						</Flex>
						<Text fontSize="xl" mt="4">
							Explore a vast selection of products across all
							categories to meet all your needs.
						</Text>
					</Box>
					<Box textAlign="center">
						<Flex
							width="80px"
							height="80px"
							borderRadius="full"
							bg="#1e083b"
							color="white"
							alignItems="center"
							justifyContent="center"
							mx="auto"
							mb="4"
							transition="all 0.3s ease"
							_hover={{
								bg: "white",
								color: "#1e083b",
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							}}
						>
							<FaShieldAlt size="3em" />
						</Flex>
						<Text fontSize="xl" mt="4">
							Shop with confidence using our secure and encrypted
							payment options.
						</Text>
					</Box>
				</SimpleGrid>
			</Container>

			{/* Eco-Friendly Products Section */}
			<Box
				position="relative"
				bgImage={`url(${ecoFriendly})`}
				bgSize="cover"
				bgPosition="center"
				color="white"
				py={{ base: 12, md: 16 }}
				mt={16}
				width="100%"
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "center", md: "flex-start" }}
					justify={{ base: "center", md: "flex-start" }}
					py={{ base: 8, md: 12 }}
					px={{ base: 4, md: 8 }}
				>
					<Stack
						spacing={6}
						maxW={{ base: "full", md: "50%" }}
						color="white"
						textAlign={{ base: "center", md: "left" }}
					>
						<Heading as="h2" size="xl">
							Shop Eco-Friendly Products
						</Heading>
						<Text fontSize={{ base: "md", md: "md" }}>
							Embrace Sustainability with Our Ethically Sourced
							Collection
						</Text>
						<Button
							colorScheme="teal"
							size="lg"
							alignSelf={{ base: "center", md: "start" }}
							_hover={{ bg: "teal.700" }}
							onClick={() => {
								navigate("/products?search=eco");
							}}
						>
							Shop Now
						</Button>
					</Stack>
				</Flex>
			</Box>

			{/* Testimonials Section */}
			<Container maxW="container.xl" mt="16">
				<Heading as="h2" textAlign="center" mb="8">
					What Our Customers Are Saying...
				</Heading>
				<SimpleGrid columns={[1, 1, 3]} spacing="8" textAlign="center">
					{testimonials.map((testimonial, index) => (
						<Box
							key={index}
							p="6"
							borderWidth="1px"
							borderRadius="lg"
							overflow="hidden"
							boxShadow="lg"
							bg="white"
							transition="all 0.3s ease"
							_hover={{
								transform: "translateY(-10px)",
								boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
							}}
						>
							<Avatar
								src={testimonial.avatar}
								name={testimonial.name}
								size="xl"
								mb="4"
							/>
							<Text fontWeight="bold" fontSize="lg" mb="2">
								{testimonial.name}
							</Text>
							<Text mb="4">{testimonial.feedback}</Text>
							<Flex justifyContent="center" alignItems="center">
								{Array(5)
									.fill("")
									.map((_, i) => (
										<StarIcon
											key={i}
											color={
												i < testimonial.rating
													? "yellow.500"
													: "gray.300"
											}
										/>
									))}
							</Flex>
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}

export default Home;
