import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Text,
	Input,
	Select,
	Textarea,
	Button,
	Alert,
	AlertIcon,
	Image,
	Flex,
	Stack,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";

function CreateProduct() {
	const [brandName, setBrandName] = useState("");
	const [productName, setProductName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [images, setImages] = useState([]);
	const [tags, setTags] = useState([]);
	const [features, setFeatures] = useState([]);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertSeverity, setAlertSeverity] = useState("success");
	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState("");

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_HOST}/api/v1/categories`
				);
				const lowercasedCategories = response.data.data.categories.map(
					(category) => ({
						...category,
						name: category.name.toLowerCase(),
					})
				);
				setCategories(lowercasedCategories);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};

		fetchCategories();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const productData = new FormData();
		for (let i = 0; i < images.length; i++) {
			productData.append("images", images[i]);
		}
		productData.append("brandName", brandName);
		productData.append("productName", productName);
		productData.append("category", category);
		productData.append("price", price);
		productData.append("description", description);
		productData.append("tags", JSON.stringify(tags));
		productData.append("features", JSON.stringify(features));

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/products`,
				productData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				setAlertMessage("Product successfully created.");
				setAlertSeverity("success");
				displayAlert();
				resetForm();
				window.scrollTo(0, 0);
			} else {
				setAlertMessage("Failed to create product.");
				setAlertSeverity("warning");
				displayAlert();
			}
		} catch (error) {
			setAlertMessage("Error occurred while creating product.");
			setAlertSeverity("warning");
			displayAlert();
		}
	};

	const resetForm = () => {
		setBrandName("");
		setProductName("");
		setCategory("");
		setPrice("");
		setDescription("");
		setImages([]);
		setTags([]);
		setFeatures([]);
	};

	const displayAlert = () => {
		setShowAlert(true);
		setTimeout(() => {
			setShowAlert(false);
		}, 2000);
	};

	const handleAddCategory = async () => {
		if (newCategory.trim() === "") return;

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_HOST}/api/v1/categories`,
				{ name: newCategory.toLowerCase() }
			);
			setCategories([...categories, response.data.data.category]);
			setNewCategory("");
		} catch (error) {
			console.error("Error adding category:", error);
		}
	};

	const handleImageChange = (e) => {
		setImages([...e.target.files]);
	};

	const handleInputChange = (e, setter) => {
		setter(e.target.value);
	};

	const addFeature = () => {
		if (newFeature.trim() !== "") {
			setFeatures([...features, newFeature.trim()]);
			setNewFeature("");
		}
	};

	const removeFeature = (index) => {
		const newFeatures = features.filter((_, i) => i !== index);
		setFeatures(newFeatures);
	};

	const [newFeature, setNewFeature] = useState("");
	const [inputValue, setInputValue] = useState("");

	const handleAddTag = () => {
		if (inputValue && !tags.includes(inputValue)) {
			setTags([...tags, inputValue]);
			setInputValue("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	return (
		<Box p={4} maxW="1200px" mx="auto">
			{showAlert && (
				<Alert status={alertSeverity} mb={4}>
					<AlertIcon />
					{alertMessage}
				</Alert>
			)}
			<form onSubmit={handleSubmit}>
				<Flex direction="column" gap={6}>
					<Box>
						<Text fontSize="2xl" fontWeight="bold" mb={4}>
							Product Images
						</Text>
						<Input
							type="file"
							onChange={handleImageChange}
							accept="image/*"
							multiple
							mb={4}
						/>
						<Wrap>
							{images.length > 0 &&
								images.map((image, index) => (
									<WrapItem key={index}>
										<Image
											src={URL.createObjectURL(image)}
											alt={`Preview ${index}`}
											boxSize="100px"
											objectFit="cover"
										/>
									</WrapItem>
								))}
						</Wrap>
					</Box>

					<Box>
						<Text fontSize="2xl" fontWeight="bold" mb={4}>
							Basic Information
						</Text>
						<Stack spacing={4}>
							<Box>
								<Text>Brand Name</Text>
								<Input
									type="text"
									value={brandName}
									onChange={(e) =>
										handleInputChange(e, setBrandName)
									}
								/>
							</Box>
							<Box>
								<Text>Product Name</Text>
								<Input
									type="text"
									value={productName}
									onChange={(e) =>
										handleInputChange(e, setProductName)
									}
								/>
							</Box>
							<Box>
								<Text>Category</Text>
								<Select
									value={category}
									onChange={(e) =>
										handleInputChange(e, setCategory)
									}
								>
									<option value="">Select a category</option>
									{categories.map((category) => (
										<option
											key={category._id}
											value={category._id}
										>
											{category.name}
										</option>
									))}
								</Select>
							</Box>
							<Box>
								<Text>Add New Category</Text>
								<Flex>
									<Input
										type="text"
										value={newCategory}
										onChange={(e) =>
											handleInputChange(e, setNewCategory)
										}
										mr={2}
									/>
									<Button
										onClick={handleAddCategory}
										bg="#391359" // Set the background color to custom purple
										color="white" // Set the text color to white
										variant="solid"
										_hover={{
											bg: "white",
											color: "#1e083b",
											borderColor: "#1e083b",
											borderWidth: "1px",
										}}
									>
										Add Category
									</Button>
								</Flex>
							</Box>
							<Box>
								<Text>Price</Text>
								<Input
									type="number"
									value={price}
									onChange={(e) =>
										handleInputChange(e, setPrice)
									}
								/>
							</Box>
							<Box>
								<Text>Description</Text>
								<Textarea
									value={description}
									onChange={(e) =>
										handleInputChange(e, setDescription)
									}
								/>
							</Box>
						</Stack>
					</Box>

					<Box>
						<Text fontSize="2xl" fontWeight="bold" mb={4}>
							Product Tags
						</Text>
						<Stack spacing={4}>
							<Flex>
								<Input
									type="text"
									value={inputValue}
									onChange={(e) =>
										handleInputChange(e, setInputValue)
									}
									mr={2}
								/>
								<Button
									bg="#391359" // Set the background color to custom purple
									color="white" // Set the text color to white
									variant="solid"
									_hover={{
										bg: "white",
										color: "#1e083b",
										borderColor: "#1e083b",
										borderWidth: "1px",
									}}
									onClick={handleAddTag}
								>
									Add Tag
								</Button>
							</Flex>
							<Wrap>
								{tags.map((tag, index) => (
									<WrapItem key={index}>
										<Box
											display="inline-block"
											borderRadius="md"
											bg="blue.100"
											color="blue.900"
											px={2}
											py={1}
											mr={2}
											mb={2}
										>
											{tag}
											<Button
												size="xs"
												ml={2}
												variant="ghost"
												colorScheme="red"
												onClick={() =>
													handleRemoveTag(tag)
												}
											>
												x
											</Button>
										</Box>
									</WrapItem>
								))}
							</Wrap>
						</Stack>
					</Box>

					<Box>
						<Text fontSize="2xl" fontWeight="bold" mb={4}>
							Additional Features
						</Text>
						<Stack spacing={4}>
							{features.map((feature, index) => (
								<Flex key={index} alignItems="center">
									<Text flex="1">{feature}</Text>
									<Button
										onClick={() => removeFeature(index)}
										variant="outline"
										colorScheme="red"
										size="sm"
									>
										Remove
									</Button>
								</Flex>
							))}
							<Flex>
								<Input
									type="text"
									placeholder="Add a feature"
									value={newFeature}
									onChange={(e) =>
										handleInputChange(e, setNewFeature)
									}
									mr={2}
								/>
								<Button
									onClick={addFeature}
									bg="#391359" // Set the background color to custom purple
									color="white" // Set the text color to white
									variant="solid"
									_hover={{
										bg: "white",
										color: "#1e083b",
										borderColor: "#1e083b",
										borderWidth: "1px",
									}}
								>
									Add Feature
								</Button>
							</Flex>
						</Stack>
					</Box>

					<Button
						bg="#391359" // Set the background color to custom purple
						color="white" // Set the text color to white
						variant="solid"
						_hover={{
							bg: "white",
							color: "#1e083b",
							borderColor: "#1e083b",
							borderWidth: "1px",
						}}
						type="submit"
						alignSelf="flex-start"
						mt={4}
					>
						Create Product
					</Button>
				</Flex>
			</form>
		</Box>
	);
}

export default CreateProduct;
