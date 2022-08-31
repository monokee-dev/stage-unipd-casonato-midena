import { ViewIcon } from '@chakra-ui/icons';
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
    IconButton,
    Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Custodian } from 'ssikit-sdk';

export default function ViewVcModal(props: {vcToView: string}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ vc, setVc ] = useState<string>(props.vcToView);

    const loadVc = async () => {
        try {
            let vcData = await Custodian.getCredential(props.vcToView);
            setVc(JSON.stringify(vcData, null, 4));
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        loadVc();
    } , [isOpen]);

    return (
        <>
            <IconButton
                onClick={onOpen}
                colorScheme='blue'
                aria-label='View DID'
                size='sm'
                icon={<ViewIcon/>}
                mr='1em'
            />
            <Modal size="full" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View Credential</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea height="50em" value={vc} variant="filled" readOnly/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}