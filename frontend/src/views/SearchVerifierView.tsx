import {
    FormControl, FormLabel, Input,
    Box,
    Heading,
} from "@chakra-ui/react";
import { Result } from "ethers/lib/utils";
import { VerifierItemController } from "../controllers";

const SearchVerifierView = ({ 
    verifier, 
    setVerifierAddress 
}: {
    verifier: Result | undefined,
    setVerifierAddress: (arg0: string) => void
}) => {
    return (
        <Box width="100%" mr="auto">
            <Heading as='h2' size='xl' mt="1em">Search a Verifier by Address</Heading>
            <Box width="33%" mt="2em" mb="2em">
                <FormControl>
                    <FormLabel htmlFor="address">Address:</FormLabel>
                    <Input name="address" variant='filled' placeholder='0x123...' onChange={event =>
                        setVerifierAddress(event.currentTarget.value)
                    } />
                </FormControl>
            </Box>
        </Box>
    )
};

export default SearchVerifierView;