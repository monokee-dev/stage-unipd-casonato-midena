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
    Select,
    FormControl,
    FormLabel,
    Input,
    Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { Custodian, utils } from 'ssikit-sdk';

export default function AddDidModal(props: {keys: utils.Key[], dids: string[], updateDids: () => Promise<void>}) {

    const methods: utils.DIDMethod[] = ["key", "web", "ebsi"]

    const defaultMethod: utils.DIDMethod = methods[0];
    const defaultKey: string = props.keys[0]?.keyId?.id;
    const defaultWebDomain: string = "";
    const defaultDidWebPath: string = "";

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [ method, setMethod ] = useState<utils.DIDMethod>(defaultMethod);
    const [ key, setKey ] = useState<string>(defaultKey);
    const [ webDomain, setWebDomain ] = useState<string>(defaultWebDomain);
    const [ didWebPath, setDidWebPath ] = useState<string>(defaultDidWebPath);
    const [ error, setError ] = useState<boolean>(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            let result: any = await Custodian.createDID(method, key, webDomain, didWebPath);
            if (!result) {
                setError(true);
                return;
            } else {
                onClose();
                await props.updateDids();
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setMethod(defaultMethod);
        setKey(defaultKey);
        setWebDomain(defaultWebDomain);
        setDidWebPath(defaultDidWebPath);
        setError(false);
    } , [isOpen]);

    return (
        <>
            <Button onClick={onOpen} leftIcon={<FaPlus/>} colorScheme='green' variant='solid' alignSelf='right' mr='1em'>
                Create DID
            </Button>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a DID</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel>DID method</FormLabel>
                                    <Select
                                        variant='filled' 
                                        name='method'
                                        onChange={ event => setMethod(event.currentTarget.value as utils.DIDMethod) }
                                        value={method}
                                    >
                                        {methods.map(method => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl mt='1em' isRequired>
                                    <FormLabel>Key</FormLabel>
                                    <Select
                                        variant='filled' 
                                        name='key'
                                        onChange={ event => setKey(event.currentTarget.value) }
                                        value={key}
                                    >
                                        {props.keys.map(key => (
                                            <option key={key.keyId.id} value={key.keyId.id}>{key.keyId.id}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl mt='1em'>
                                    <FormLabel>Web domain</FormLabel>
                                    <Input
                                        variant="filled" 
                                        placeholder='Web Domain'
                                        name='webDomain'
                                        onChange={ event => setWebDomain(event.currentTarget.value) }
                                        value={webDomain}
                                    />
                                </FormControl>
                                <FormControl mt='1em'>
                                    <FormLabel>DID Web path</FormLabel>
                                    <Input
                                        variant="filled" 
                                        placeholder='Did web path'
                                        name='didWebPath'
                                        onChange={ event => setDidWebPath(event.currentTarget.value) }
                                        value={didWebPath}
                                    />
                                </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            {
                                error 
                                &&
                                <Text mr='auto'>
                                    Error on DID creation
                                </Text>
                            }
                            <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                                Close
                            </Button>
                            <Button type='submit' size='sm' colorScheme='green'>
                                Generate
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}