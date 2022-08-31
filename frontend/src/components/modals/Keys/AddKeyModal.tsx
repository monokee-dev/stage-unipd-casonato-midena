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
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { Custodian, utils } from 'ssikit-sdk';

export default function AddKeyModal(props: {updateKeys: () => Promise<void>}) {

    const algorithms: utils.KeyAlgorithm[] = ["RSA", "EdDSA_Ed25519", "ECDSA_Secp256k1"]
    const defaultAlgorithm: utils.KeyAlgorithm = algorithms[0];

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [algorithm, setAlgorithm] = useState<utils.KeyAlgorithm>(defaultAlgorithm);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await Custodian.generateKey(algorithm);
            onClose();
            await props.updateKeys();
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setAlgorithm(defaultAlgorithm);
    } , [isOpen]);

    return (
        <>
            <Button onClick={onOpen} leftIcon={<FaPlus/>} colorScheme='green' variant='solid' alignSelf='right' mr='1em'>
                Generate Key
            </Button>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Please select an algoritm:</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel>Algorithm</FormLabel>
                                    <Select
                                        variant='filled' 
                                        mt='1em' 
                                        name='algorithm'
                                        onChange={ event => setAlgorithm(event.currentTarget.value as utils.KeyAlgorithm) }
                                        value={algorithm}
                                    >
                                        {algorithms.map(algorithm => (
                                            <option key={algorithm} value={algorithm}>{algorithm}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                        </ModalBody>

                        <ModalFooter>
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