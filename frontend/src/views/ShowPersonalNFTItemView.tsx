import axios from "axios";
import Moment from 'react-moment';
import {
    Image,
    Box,
    Heading,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Center,
    Stack,
    Button,
    Flex,
    Spinner,
    ButtonGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { updateLanguageServiceSourceFile } from "typescript";

Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';

const ShowPersonalNFTItemView = ({
    token,
    handleERC721Click,
    isLoadingERC721Write,
    isLoadingERC721Tx,
    isSuccessERC721Tx,
    isPrepareERC721Error,
    prepareERC721Error,
    isERC721Error,
    errorERC721,
    txHashERC721,
    prepareErrorERC721Short,
    metadata,
    decodedDetails
}: {
    token: IERC721Token,
    handleERC721Click: () => void,
    isLoadingERC721Write: boolean,
    isLoadingERC721Tx: boolean,
    isSuccessERC721Tx: boolean,
    isPrepareERC721Error: boolean,
    prepareERC721Error: Error | null,
    isERC721Error: boolean,
    errorERC721: Error | null,
    txHashERC721: string | undefined,
    prepareErrorERC721Short: string,
    metadata: IERC721Metadata | undefined,
    decodedDetails: Array<string>
}) => {

    if (!(metadata && decodedDetails)) 
        return <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
    
    return (
        <>
            <li className="card-item nft-card">
                <Center mb="1em">
                    <Image
                        src={metadata.image ? metadata.image : "https://via.placeholder.com/200"}
                        alt={metadata.name}
                        boxSize="200px"
                        borderRadius="16px" />
                </Center>
                <Box mb="1em">
                    <Text fontSize="xl">{metadata.name}</Text>
                    <Text fontSize="xs">
                        Token #{token.tokenID}
                    </Text>
                </Box>
                <ButtonGroup variant='outline' spacing='3'>
                    <Popover>
                        <PopoverTrigger>
                            <Button variant='solid' colorScheme="blue" size="sm">Read more</Button>
                        </PopoverTrigger>
                        <PopoverContent width="md">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>More details:</PopoverHeader>
                            <PopoverBody>
                                <Stack spacing={2} direction="column" mb="0.5em">
                                    <Text fontWeight="bold">Description:</Text>
                                    <span>{metadata.description}</span>
                                </Stack>
                                <Stack spacing={2} direction="column" mb="0.5em">
                                    <Text fontWeight="bold">Owner:</Text> <span>{token.owner.id}</span>
                                </Stack>
                                <Stack spacing={3} direction="row" mt="0.5em">
                                    <Text fontWeight="bold">Mint time:</Text> <Moment unix>{token.mintTime}</Moment>
                                </Stack>
                                {   decodedDetails.length ?
                                    <Stack>
                                        <Text fontWeight="bold" mt="1em" fontSize="xl">Metadata details:</Text>
                                        <Flex justifyContent="space-between">
                                            <Text fontWeight="bold">DID:</Text>
                                            <span>{decodedDetails[0]}</span>
                                        </Flex>
                                        <Flex justifyContent="space-between">
                                            <Text fontWeight="bold">Corso:</Text> 
                                            <span>{decodedDetails[1]}</span>
                                        </Flex>
                                        <Flex justifyContent="space-between">
                                            <Text fontWeight="bold">Schema:</Text> 
                                            <span>{decodedDetails[2]}</span>
                                        </Flex>
                                    </Stack>
                                    : null
                                }
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    
                    <Button isLoading={isLoadingERC721Write || isLoadingERC721Tx} loadingText="Approving" variant='solid' size='sm' disabled={isLoadingERC721Tx || isLoadingERC721Write || isPrepareERC721Error} colorScheme='yellow' onClick={() => {
                        handleERC721Click()
                    }}>
                        Approve
                    </Button>
                </ButtonGroup>
                


                {isLoadingERC721Write && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Check your wallet to complete the procedure...</Box>}
                {isLoadingERC721Tx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Please wait for the transaction to be mined...</Box>}
                {isSuccessERC721Tx &&
                    <Box mt="1em" p={4} bg="green" borderRadius="lg">
                        Transaction mined with success.
                        <p><a href={'https://goerli.etherscan.io/tx/' + txHashERC721} /></p>
                    </Box>}
                {isERC721Error && <Box mt="1em" p={4} bg="teal" borderRadius="lg">{errorERC721?.message}</Box>}
                {isPrepareERC721Error && <Box mt="1em" p={4} bg="teal" borderRadius="lg">{prepareErrorERC721Short}</Box>}

                
            </li>
        </>
    )
}

export default ShowPersonalNFTItemView;