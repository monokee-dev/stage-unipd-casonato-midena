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
    RadioGroup,
    Stack,
    Radio,
    Textarea,
    Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Auditor, utils } from 'ssikit-sdk';

export default function AddPolicyModal(props: {updatePolicies: () => Promise<void>, policies: utils.VerificationPolicy[]}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    let defaultArg: any = {
        policyEngine: "OPA",
        applyToVC: true,
        applyToVP: true,
        input: {},
        policy: "",
        dataPath: "",
        policyQuery: "",
        description: "test"
    };

    const [policyName, setPolicyName] = useState<string>("");
    const [updatable, setUpdatable] = useState<string>("true");
    const [download, setDownload] = useState<string>("true");
    const [arg, setArg] = useState<any>(defaultArg);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (props.policies.find(policy => policy.id === policyName)) {
                setError("Error: Name already exists.");
            } else {
                arg.name = policyName;
                let success = await Auditor.createDynamicVerificationPolicy(
                    policyName,
                    arg as utils.DynamicPolicyArg,
                    updatable as unknown as boolean,
                    download as unknown as boolean
                );
                if (!success) {
                    setError("Error: Policy creation failed.");
                } else {
                    onClose();
                    await props.updatePolicies();
                }
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setPolicyName("");
        setUpdatable("true");
        setDownload("true");
        setArg(defaultArg);
        setError("");
    } , [isOpen]);

    return (
        <>
            <Button onClick={onOpen} leftIcon={<FaPlus/>} colorScheme='green' variant='solid' alignSelf='right' mr='1em'>
                Create Verification Policy
            </Button>
            
            <Modal size="md" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create verification policy</ModalHeader>
                    <ModalCloseButton />
                    <form method='post' onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Policy Name</FormLabel>
                                <Input
                                    variant="filled" 
                                    placeholder='E.g. CredentialStatusPolicy'
                                    name='policyName'
                                    onChange={ event => setPolicyName(event.currentTarget.value) }
                                    value={policyName}
                                />
                                <FormLabel mt='1em'>Updatable</FormLabel>
                                <RadioGroup onChange={setUpdatable} value={updatable}>
                                    <Stack direction='row'>
                                        <Radio value='true'>Yes</Radio>
                                        <Radio value='false'>No</Radio>
                                    </Stack>
                                </RadioGroup>
                                <FormLabel mt='1em'>Download Policy</FormLabel>
                                <RadioGroup onChange={setDownload} value={download}>
                                    <Stack direction='row'>
                                        <Radio value='true'>Yes</Radio>
                                        <Radio value='false'>No</Radio>
                                    </Stack>
                                </RadioGroup>
                                <FormLabel mt='1em'>Additional Data:</FormLabel>
                                <Textarea
                                    value={JSON.stringify(arg, null, 2)}
                                    onChange={(e) => setArg(JSON.parse(e.target.value))}
                                    h='15em'
                                    variant="filled"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            {error && <Text mr="auto" color="red.200">{error}</Text>}
                            <Button onClick={onClose} size='sm' colorScheme='red' mr={3}>
                                Close
                            </Button>
                            <Button type='submit' size='sm' colorScheme='green'>
                                Create
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}