import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    ButtonGroup,
    Box,
} from '@chakra-ui/react'
import { ethers } from 'ethers';
import { useState } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import useVerificationRegistryData from '../../hooks/useVerificationRegistryData';

export function AddNewVerifierModal(props: {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}) {

    const [ vr_address, vr_abi] = useVerificationRegistryData();

    const [inputName, setName] = useState('');
    const [did, setDid] = useState('');
    const [url, setUrl] = useState('');
    const [inputAddress, setAddress] = useState('');
    const [prepareErrorShort, setPrepareErrorShort] = useState('');

    const verifierInfo: IVerifier = {
        name: ethers.utils.formatBytes32String(inputName),
        did: did,
        url: url,
        signer: inputAddress,
    }

    const { config, isError: isPrepareError, error: prepareError } = usePrepareContractWrite({
        addressOrName: vr_address,
        contractInterface: vr_abi,
        functionName: 'addVerifier',
        enabled: (ethers.utils.isAddress(inputAddress)),
        args: [inputAddress, verifierInfo],
        onError: (error) => {
            setPrepareErrorShort(error.message.split('(reason="execution reverted: ')[1].split('", method')[0]);
        }
    })

    const { data, isLoading: isLoadingWrite, isSuccess, isError, error: errorWrite, write } = useContractWrite(config)

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingTx, isSuccess: isSuccessTx } = useWaitForTransaction({
        hash: data?.hash,
    });

    return <Modal blockScrollOnMount={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Please provide the following fields:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input variant='filled' mt='.2em' name='name' onChange={event =>
                        setName(event.currentTarget.value)}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel mt='.5em'>DID</FormLabel>
                    <Input variant='filled' mt='.2em' name='did' onChange={event =>
                        setDid(event.currentTarget.value)
                    } placeholder='did:example:123...'
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel mt='.5em'>Url</FormLabel>
                    <Input variant='filled' mt='.2em' name='url' onChange={event =>
                        setUrl(event.currentTarget.value)
                    } placeholder='https://example.com'
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel mt='.5em'>Address</FormLabel>
                    <Input variant='filled' mt='.2em' name='address' onChange={event =>
                        setAddress(event.currentTarget.value)
                    } placeholder='0x123...'
                    />
                </FormControl>

                {isLoadingWrite && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Check your wallet to complete the procedure...</Box>}
                {isLoadingTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Please wait for the transaction to be mined...</Box>}
                {isSuccessTx && <Box mt="1em" p={4} bg="green" borderRadius="lg">Transaction mined with success</Box>}
                {isError && <Box mt="1em" p={4} bg="tomato" borderRadius="lg">Error: there is an error with Metamask</Box>}
                {isPrepareError && <Box mt="1em" p={4} bg="tomato" borderRadius="lg">{prepareErrorShort}</Box>}

            </ModalBody>

            <ModalFooter>
                <ButtonGroup>
                    <Button size='sm' colorScheme='red' disabled={isLoadingTx || isLoadingWrite} onClick={props.onClose}>
                        Close
                    </Button>
                    <Button isLoading={isLoadingWrite || isLoadingTx} loadingText="Confirming" size='sm' colorScheme='green' disabled={isLoadingWrite || isLoadingTx || !write} onClick={() => write?.()}>Confirm</Button>
                </ButtonGroup>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

export default AddNewVerifierModal;