
import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, Link, Select, Spinner, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Custodian, lib } from "ssikit-sdk";

export default function Ebsi(){
    const [ bearerToken, setBearToken ] = useState<string>("");
    const [ didsList, setDidsList ] = useState<string[]>([]);
    const [ did, setDid ] = useState<string>("");
    const [ registeredDid, setRegisteredDid ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);

    const initDidsList = async () => {
        let didsList = await Custodian.getDIDs();
        didsList = didsList.filter(did => did.includes("ebsi"));
        setDidsList(didsList);
        setDid(didsList[0]);
    }

    const truncateDid = (did: string) => {
        return did.substring(0, 15) + '...' + did.substring(did.length - 10);
    }

    const registerDidOnEbsi = async () => {
        let registeredDid = await lib.registerDIDOnEBSI(bearerToken, did);
        setRegisteredDid(registeredDid);
        setLoading(false)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!registeredDid) {
            try {
                setLoading(true)
                registerDidOnEbsi();
            } catch (error) {
                alert(error);
            }
        }
    };

    useEffect(() => {
        initDidsList();
    } , []);
    
    return (
        <Box id='main-container'>
            <Box mb="2em">
                <Heading as="h2">Register a DID on EBSI</Heading>
                <Text mt="0.5em" size="xl">
                    In order to correctly execute the onboarding procedure, please provide the bearer token you 
                    can get from <Link className="link" href="https://app.preprod.ebsi.eu/users-onboarding/" target="_blank">EBSI official website</Link>.
                </Text>
            </Box>
            <HStack alignItems="flex-start">
                <Box w="50%">
                    <form method='post' onSubmit={handleSubmit}>
                        <FormControl isRequired>
                            <FormLabel mt="1.5em">Bearer Token</FormLabel>
                            <Input
                                variant="filled" 
                                placeholder='your bearer token'
                                name='webDomain'
                                onChange={ event => setBearToken(event.currentTarget.value) }
                                value={bearerToken}
                                w="80%"
                            />
                            <FormLabel mt="1.5em">DID to register</FormLabel>
                            <Select
                                value={did}
                                onChange={(e) => setDid(e.target.value)}
                                w='80%'
                                variant="filled"
                            >
                                {didsList.map((did, index) => (
                                    <option key={index} value={did}>{truncateDid(did)}</option>
                                ))}
                            </Select>
                            <Button type="submit"
                                colorScheme='blue' mt='2em' w='8em'
                            >
                                {loading && <Spinner mr="0.5em" size='xs' />}
                                Register
                            </Button>
                        </FormControl>
                    </form>
                </Box>
                <Box w="100%">                         
                    <Text mt='2em'>Registered DID:</Text>
                    <Textarea isDisabled={registeredDid.length===0}
                        value={registeredDid}
                        mt='0.5em' mb="1em" 
                        height="30em" variant="filled"
                    />
                </Box>
            </HStack>
        </Box>
    )

}