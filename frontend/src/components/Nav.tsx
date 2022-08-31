import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";

export default function Nav() {

    let otherPages = "active-link"
    let currentPage = "inactive-link";
      
    return (
        <>
            <nav>
                <Flex justifyContent="space-between">
                    <Box>
                        <Heading as='h1'>Besu & walt.id integration</Heading>
                    </Box>
                    <Box className="connect-wallet-box">
                        <ColorModeSwitcher />
                        <ConnectButton />
                    </Box>
                </Flex>
                <Box mt="1em" id="menu">
                    <NavLink to="/holder" className={({isActive}) => isActive ? currentPage : otherPages}>Holder</NavLink>
                    <NavLink to="/issuer" className={({isActive}) => isActive ? currentPage : otherPages}>Issuer</NavLink>
                    <NavLink to="/verifier" className={({isActive}) => isActive ? currentPage : otherPages}>Verifier</NavLink>
                    <NavLink to="/contracts" className={({isActive}) => isActive ? currentPage : otherPages}>Contracts</NavLink>
                    <NavLink to="/diploma" className={({isActive}) => isActive ? currentPage : otherPages}>Diploma</NavLink>
                    <NavLink to="/ebsi" className={({isActive}) => isActive ? currentPage : otherPages}>EBSI</NavLink>
                </Box>
            </nav>
            <Outlet/>
        </>

    )
}