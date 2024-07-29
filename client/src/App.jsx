import { Outlet } from "react-router";
import "./App.css";
// import { UserContextProvider } from "./context/UserContext";
import Header from "./components/Header";
import { ChakraProvider } from "@chakra-ui/react";
import Footer from "./components/Footer";

function App() {
	return (
		<>
			<ChakraProvider>
				{/* <UserContextProvider> */}
				<Header />
				<Outlet />
				<Footer />
				{/* </UserContextProvider> */}
			</ChakraProvider>
		</>
	);
}

export default App;
