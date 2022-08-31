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
    Textarea,
    Text,
    Input,
    Select,
    Box
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiExport } from 'react-icons/bi';
import { Custodian, utils } from 'ssikit-sdk';

export default function PresentVcsModal(props: {updateVcs: () => Promise<void>, vcsToPresent: string[], dids: string[]}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ presentation, setPresentation ] = useState<string>("");
    const [ holderDID, setHolderDID ] = useState<string>(props.dids[0]);
    const [ verifierDID, setVerifierDID ] = useState<string>();
    const [ domain, setDomain ] = useState<string>();
    const [ challenge, setChallenge ] = useState<string>();

    const truncateDid = (did: string) => {
        return did.substring(0, 20) + '...' + did.substring(did.length - 15);
    }

    const presentVCs = async () => {
        let vp = ""
        try {
            let request = {
                discriminator: "presentCredentialIDsRequest",
                vcIds: props.vcsToPresent,
                holderDid: holderDID,
                verifierDid: verifierDID,
                domain: domain,
                challenge: challenge
            } as utils.PresentationRequest;
            vp = await Custodian.presentCredentials(request);
        } catch (error) {
            alert(error);
        }
        return JSON.stringify(vp, null, 4)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            let vp = await presentVCs();
            setPresentation(vp);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setHolderDID(props.dids[0]);
        setVerifierDID("");
        setDomain("");
        setChallenge("");
    } , [isOpen]);

    return (
        <>
            <Button
                isDisabled={props.vcsToPresent.length===0}
                onClick={onOpen} leftIcon={<BiExport/>} colorScheme='cyan' variant='solid'
            >
                Present Credential(s)
            </Button>

            <Modal size="xl" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Present Credentials</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Holder DID</FormLabel>
                                <Select
                                    variant='filled' 
                                    name='method'
                                    onChange={ e => setHolderDID(e.target.value) }
                                    value={holderDID}
                                >
                                    {props.dids.map(did => (
                                        <option key={did} value={did}>{truncateDid(did)}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Text mt='1em'>Verifier DID:</Text>
                                <Input 
                                    value={verifierDID}
                                    onChange={(e) => setVerifierDID(e.target.value)}
                                    placeholder='did:example:123456789' 
                                    mt='0.5em'
                                    variant="filled"
                                />
                            </FormControl>
                            <FormControl>
                                <Text mt='1em'>Domain:</Text>
                                <Input 
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder='sec:domain' 
                                    mt='0.5em'
                                    variant="filled"
                                />
                            </FormControl>
                            <FormControl>
                                <Text mt='1em'>Challenge:</Text>
                                <Input 
                                    value={challenge}
                                    onChange={(e) => setChallenge(e.target.value)}
                                    placeholder='sec:challenge' 
                                    mt='0.5em'
                                    variant="filled"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter display="flex" flexDir="column">
                            <Box ml="auto">
                                <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                                    Close
                                </Button>
                                <Button type='submit' size='sm' colorScheme='green'>
                                    Present
                                </Button>
                            </Box>
                            <Box w="100%">                         
                                <Text mt='2em'>Verifiable Presentation:</Text>
                                <Textarea isDisabled={presentation.length===0}
                                    mt='0.5em' mb="1em" 
                                    height="15em" value={presentation} variant="filled"
                                />
                            </Box>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}