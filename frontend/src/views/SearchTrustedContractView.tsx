

import {
    FormControl, FormLabel, Input,
    Box,
    Heading,
    Center,
    Spinner,
    Stack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Result } from "ethers/lib/utils";
import { TrustedContractItemController, VerifierItemController } from "../controllers";

const SearchTrustedContractView = ({ 
    contractsInfo, 
    setContractAddress,
    setContractName,
    loading,
    error,
}: {
    contractsInfo: ITrustedSmartContract[],
    setContractAddress: (arg0: string) => void,
    setContractName: (arg0: string) => void,
    loading: boolean,
    error: AxiosError | undefined,
}) => {
    return (
        <Box width="100%" mr="auto">
            <Heading as='h2' size='xl' mt="1em">Search a Trusted Contract by Address</Heading>
            <Stack width="50%" mt="2em" mb="2em" direction="row" spacing="1em">
                <FormControl>
                    <FormLabel htmlFor="address">Address:</FormLabel>
                    <Input name="address" variant='filled' placeholder='0x123...' onChange={event =>
                        setContractAddress(event.currentTarget.value)
                    } />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="name">Name:</FormLabel>
                    <Input name="name" variant='filled' placeholder='contract name' onChange={event =>
                        setContractName(event.currentTarget.value)
                    } />
                </FormControl>
            </Stack>
            
            <ul>
                {
                    loading ?
                        <Center>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        </Center>
                    : null
                }
                {contractsInfo.length ?
                    contractsInfo.map((contract, index) => {
                        return <TrustedContractItemController 
                            contractInfo={contract} 
                            key={index}     
                        />
                    })
                    : null
                }
            </ul>
        </Box>
    )
};

export default SearchTrustedContractView;