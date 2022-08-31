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
    FormControl,
    FormLabel,
    IconButton,
    RadioGroup,
    Radio,
    Stack,
    Box,
    Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiExport } from 'react-icons/bi';
import { Custodian, utils } from 'ssikit-sdk';

export default function ExportKeyModal(props: {keyToExport: utils.Key}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ keyFormat, setKeyFormat ] = useState<utils.KeyFormat>("JWK");
    const [ exportPrivate, setExportPrivate ] = useState<string>('true');
    const [ exported, setExported ] = useState<string>("");

    const keyFormats: utils.KeyFormat[] = ["JWK", "PEM"] as utils.KeyFormat[];

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            let exported = await Custodian.exportKey(props.keyToExport, keyFormat, exportPrivate as unknown as boolean);
            setExported(JSON.stringify(exported, null, 2));
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setKeyFormat("JWK");
        setExportPrivate("true");
        setExported("");
    } , [isOpen]);

    return (
        <>
            <IconButton
                onClick={onOpen}
                colorScheme='blue'
                aria-label='Export key'
                size='sm'
                icon={<BiExport/>}
                mr='1em'
            />
            <Modal size="xl" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Export key</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                                <FormControl isRequired>
                                    <FormLabel>Select a key format:</FormLabel>
                                    <RadioGroup
                                        mt='0.5em' 
                                        onChange={value => setKeyFormat(value as utils.KeyFormat)}
                                        value={keyFormat}
                                    >
                                        <Stack direction='row'>
                                            {keyFormats.map(keyFormat => (
                                                <Radio key={keyFormat} value={keyFormat}>{keyFormat}</Radio>
                                            ))}
                                        </Stack>
                                    </RadioGroup>
                                    <FormLabel mt='1em'>Do you want the private or public key?</FormLabel>
                                    <RadioGroup
                                        mt='0.5em' 
                                        onChange={value => setExportPrivate(value)}
                                        value={exportPrivate}
                                    >
                                        <Stack direction='row'>
                                            <Radio key='true' value='true'>Private</Radio>
                                            <Radio key='false' value='false'>Public</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                        </ModalBody>

                        <ModalFooter display="flex" flexDir="column">
                            <Box ml="auto">
                                <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                                    Close
                                </Button>
                                <Button type='submit' size='sm' colorScheme='green'>
                                    Export
                                </Button>
                            </Box>
                            <Box w="100%">                         
                                <Text mt='2em'>Exported Key:</Text>
                                <Textarea isDisabled={exported.length===0}
                                    mt='0.5em' mb="1em" 
                                    height="15em" value={exported} variant="filled"
                                />
                            </Box>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}