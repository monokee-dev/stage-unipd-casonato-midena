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
    Text
} from '@chakra-ui/react'
import { Custodian } from 'ssikit-sdk';
import { DeleteIcon } from '@chakra-ui/icons';

export default function DeleteAllKeysModal(props: {updateKeys: () => Promise<void>}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await Custodian.deleteAllKeys();
            onClose();
            await props.updateKeys();
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <Button onClick={onOpen} leftIcon={<DeleteIcon/>} colorScheme='red' variant='solid' alignSelf='right'>
                Delete All Keys
            </Button>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>ATTENTION:</ModalHeader>
                    <ModalCloseButton/>
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                            <Text>Are you sure you want to delete <strong>all</strong> your keys?</Text>
                            <Text>This action is not reversible.</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} size='sm' colorScheme='green' mr={3}>
                                Abort
                            </Button>
                            <Button type='submit' size='sm' colorScheme='red'>
                                Delete All
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}