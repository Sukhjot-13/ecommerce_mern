import React from "react";
import {
	Box,
	Container,
	Stack,
	Link,
	Text,
	Image,
	IconButton,
	Icon,
} from "@chakra-ui/react";
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaCcVisa,
	FaCcMastercard,
} from "react-icons/fa";
import logo from "../assets/images/logoWhite.jpeg";
const Footer = () => {
	return (
		<Box bg="#1e083b" color="white" py={10} mt={8}>
			<Container maxW="container.lg">
				<Stack
					direction={{ base: "column", md: "row" }}
					spacing={8}
					align="center"
					justify="space-between"
				>
					<Stack direction="row" align="center" spacing={6}>
						<Image
							src={logo}
							alt="ShopSphere Logo"
							boxSize="50px"
							width={54}
						/>
						<Stack direction="row" spacing={4}>
							<IconButton
								as="a"
								href="#"
								aria-label="Facebook"
								icon={<FaFacebook />}
								bg="transparent"
								color="white" // Ensure the icon color is white
								_hover={{ bg: "whiteAlpha.200" }}
							/>
							<IconButton
								as="a"
								href="#"
								aria-label="Twitter"
								icon={<FaTwitter />}
								bg="transparent"
								color="white" // Ensure the icon color is white
								_hover={{ bg: "whiteAlpha.200" }}
							/>
							<IconButton
								as="a"
								href="#"
								aria-label="Instagram"
								icon={<FaInstagram />}
								bg="transparent"
								color="white" // Ensure the icon color is white
								_hover={{ bg: "whiteAlpha.200" }}
							/>
						</Stack>
					</Stack>
					<Stack direction="row" spacing={10} textAlign="center">
						<Link href="#" _hover={{ textDecoration: "underline" }}>
							Contact Us
						</Link>
						<Link href="#" _hover={{ textDecoration: "underline" }}>
							Products
						</Link>
						<Link href="#" _hover={{ textDecoration: "underline" }}>
							Sign In
						</Link>
						<Link href="#" _hover={{ textDecoration: "underline" }}>
							Sign Up
						</Link>
					</Stack>
				</Stack>
				<Stack
					direction={{ base: "column", md: "row" }}
					spacing={8}
					align="center"
					justify="space-between"
					mt={10}
				>
					<Stack direction="row" align="center" spacing={4}>
						<Text>Accepted Payment Methods:</Text>
						<Icon as={FaCcVisa} boxSize="30px" />
						<Icon as={FaCcMastercard} boxSize="30px" />
						{/* <Icon as={FaCcPaypal} boxSize="30px" /> */}
					</Stack>
					<Text fontSize="sm">
						&copy; 2024 ShopSphere. All rights reserved.
					</Text>
				</Stack>
			</Container>
		</Box>
	);
};

export default Footer;
