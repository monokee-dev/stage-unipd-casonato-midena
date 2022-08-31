import { DeleteIcon } from '@chakra-ui/icons';
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
    Text,
    IconButton,
} from '@chakra-ui/react'
import { Custodian } from 'ssikit-sdk';

export default function DeleteDidModal(props: {didToDelete: string, updateDids: () => Promise<void>}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await Custodian.deleteDID(props.didToDelete);
            onClose();
            await props.updateDids();
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                colorScheme='red'
                aria-label='Delete did'
                size='sm'
                icon={<DeleteIcon/>}
            />
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>ATTENTION:</ModalHeader>
                    <ModalCloseButton/>
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                            <Text>Are you sure you want to delete this DID?</Text>
                            <Text>This action is not reversible.</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} size='sm' colorScheme='green' mr={3}>
                                Abort
                            </Button>
                            <Button type='submit' size='sm' colorScheme='red'>
                                Delete DID
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}