import { Flex, HStack } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';

export default function SideNav(props: {links: { [key: string]: string }}) {

    let otherPages = "active-link"
    let currentPage = "inactive-link";

    return (
        <HStack alignItems="flex-start">
            <nav id="side-nav">
                <Flex mt="1em" id="menu" className="side-menu">
                    {Object.keys(props.links).map((key, index) => {
                        return (
                            <NavLink key={index} to={key} className={({isActive}) => isActive ? currentPage : otherPages}>{props.links[key]}</NavLink>
                        )
                    })}
                </Flex>
            </nav>
            <Outlet/>
        </HStack>
    );

}