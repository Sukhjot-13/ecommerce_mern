import React, { useState } from "react";
import { Box, Text, Button, Stack } from "@chakra-ui/react";

function ReviewList({ reviews }) {
	const [currentPage, setCurrentPage] = useState(1);
	const reviewsPerPage = 5;

	const indexOfLastReview = currentPage * reviewsPerPage;
	const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
	const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<Box>
			{currentReviews.length > 0 ? (
				currentReviews.map((review) => (
					<Box
						key={review._id}
						p={4}
						mb={4}
						borderWidth="1px"
						borderRadius="md"
					>
						<Text mb={2}>{review.comment}</Text>
						<Text>Rating: {review.rating}</Text>
						<Text fontSize="sm" color="gray.500">
							User: {review?.user?.userName}
						</Text>
					</Box>
				))
			) : (
				<Text>No reviews yet.</Text>
			)}
			<Stack direction="row" spacing={4} mt={4}>
				{Array.from({
					length: Math.ceil(reviews.length / reviewsPerPage),
				}).map((_, index) => (
					<Button
						key={index}
						onClick={() => paginate(index + 1)}
						isDisabled={currentPage === index + 1}
					>
						{index + 1}
					</Button>
				))}
			</Stack>
		</Box>
	);
}

export default ReviewList;
