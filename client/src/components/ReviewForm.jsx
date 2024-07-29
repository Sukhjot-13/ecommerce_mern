import React, { useState } from "react";
import axios from "axios";
import { useUserData } from "../context/UserContext";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	VStack,
} from "@chakra-ui/react";

function ReviewForm({ productId }) {
	const { gUser } = useUserData();
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/reviews/${productId}`,
				{
					rating,
					comment,
					user: gUser._id,
					product: productId,
				}
			);
			console.log("Review added:", response.data);
			setRating(5);
			setComment("");
			// Optionally, refresh the product details to show the new review
		} catch (error) {
			console.error("Error adding review:", error);
		}
	};

	return (
		<Box as="form" onSubmit={handleSubmit} mt={6}>
			<VStack spacing={4}>
				<FormControl id="rating" isRequired>
					<FormLabel>Rating</FormLabel>
					<Input
						type="number"
						value={rating}
						onChange={(e) => setRating(e.target.value)}
						min="1"
						max="5"
					/>
				</FormControl>
				<FormControl id="comment" isRequired>
					<FormLabel>Comment</FormLabel>
					<Textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
				</FormControl>
				<Button type="submit" colorScheme="blue" w="full">
					Submit Review
				</Button>
			</VStack>
		</Box>
	);
}

export default ReviewForm;
