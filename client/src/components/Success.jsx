import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	effect,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function Success() {
	navigate = useNavigate();
	useEffect(() => {
		setTimeout(() => {
			navigate("/");
		}, 3000);
	}, []);
	return (
		<Alert
			status="success"
			variant="subtle"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
			height="200px"
		>
			<AlertIcon boxSize="40px" mr={0} />
			<AlertTitle mt={4} mb={1} fontSize="lg">
				Order Placed Succesfully!
			</AlertTitle>
			<AlertDescription maxWidth="sm">
				Thanks for your purchase.
			</AlertDescription>
		</Alert>
	);
}

export default Success;
