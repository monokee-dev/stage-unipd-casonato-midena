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

export default function DeleteVcModal(props: {vcToDelete: string, updateVcs: () => Promise<void>}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await Custodian.deleteCredential(props.vcToDelete);
            onClose();
            await props.updateVcs();
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                colorScheme='red'
                aria-label='Delete credential'
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
                            <Text>Are you sure you want to delete this credential?</Text>
                            <Text>This action is not reversible.</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} size='sm' colorScheme='green' mr={3}>
                                Abort
                            </Button>
                            <Button type='submit' size='sm' colorScheme='red'>
                                Delete VC
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}