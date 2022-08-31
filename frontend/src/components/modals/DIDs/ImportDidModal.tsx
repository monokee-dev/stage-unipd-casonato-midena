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
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiImport } from 'react-icons/bi';
import { Custodian } from 'ssikit-sdk';

export default function ImportDidModal(props: {updateDids: () => Promise<void>}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ didToImport, setDidToImport ] = useState<string>("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await Custodian.importDID(didToImport);
            onClose();
            await props.updateDids();
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setDidToImport("");
    } , [isOpen]);

    return (
        <>
            <Button onClick={onOpen} leftIcon={<BiImport/>} colorScheme='orange' variant='solid' mr='1em'>
                Import DID
            </Button>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Import a DID</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel>DID to import</FormLabel>
                                    <Input 
                                        value={didToImport}
                                        onChange={ e => setDidToImport(e.target.value) }
                                        placeholder='did:...'
                                        variant="filled"
                                    />
                                </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                                Close
                            </Button>
                            <Button type='submit' size='sm' colorScheme='green'>
                                Import
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}