import { SearchIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Box,
    Text,
    Textarea,
    HStack,
    Checkbox,
    Spinner,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Custodian, UniversalResolver } from 'ssikit-sdk';

export default function ResolveDidModal() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ didToResolve, setDidToResolve ] = useState<string>("");
    const [ resolvedDid, setResolvedDid ] = useState<string>("");
    const [ universalResolver, setUniversalResolver ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            let resolved = "";
            setLoading(true);
            if (!universalResolver) {
                resolved = await Custodian.resolveDID(didToResolve);
            } else {
                resolved = await UniversalResolver.resolveDID(didToResolve);
            }
            setResolvedDid(JSON.stringify(resolved, null, 4));
            setLoading(false)
        } catch (error) {
            console.log("HELLO")
            alert(error);
        }
    }

    useEffect(() => {
        setDidToResolve("");
        setResolvedDid("");
        setUniversalResolver(false);
    } , [isOpen]);

    return (
        <>
            <Button onClick={onOpen} leftIcon={<SearchIcon/>} colorScheme='cyan' variant='solid'>
                Resolve DID
            </Button>

            <Modal size="xl" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Resolve DID</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>DID to resolve:</FormLabel>
                                <Input
                                    variant="filled" 
                                    placeholder='did:example:123456789abcdefghi'
                                    name='webDomain'
                                    onChange={ e => setDidToResolve(e.currentTarget.value) }
                                    value={didToResolve}
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter display="flex" flexDir="column">
                            <HStack w="100%" justifyContent="space-between">
                                <Box>
                                    <Checkbox onChange={ e => setUniversalResolver(e.currentTarget.checked) }>
                                        Universal Resolver
                                    </Checkbox>
                                </Box>
                                <Box ml="auto">
                                    <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                                        Close
                                    </Button>
                                    <Button type='submit' size='sm' colorScheme='green'>
                                        {loading && <Spinner mr="0.5em" size='xs' />}
                                        Resolve
                                    </Button>
                                </Box>
                            </HStack>
                            <Box w="100%">                         
                                <Text mt='2em'>Resolved DID:</Text>
                                <Textarea isDisabled={resolvedDid?.length===0}
                                    mt='0.5em' mb="1em" 
                                    height="15em" value={resolvedDid} variant="filled"
                                />
                            </Box>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}