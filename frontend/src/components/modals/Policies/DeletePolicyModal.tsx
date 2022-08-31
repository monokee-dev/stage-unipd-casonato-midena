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
import { Auditor } from 'ssikit-sdk';

export default function DeletePolicyModal(props: {policyToDelete: string, updatePolicies: () => Promise<void>}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await Auditor.deleteDynamicVerificationPolicy(props.policyToDelete);
            onClose();
            await props.updatePolicies();
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
                            <Text>Are you sure you want to delete this policy?</Text>
                            <Text>This action is not reversible.</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} size='sm' colorScheme='green' mr={3}>
                                Abort
                            </Button>
                            <Button type='submit' size='sm' colorScheme='red'>
                                Delete Policy
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}