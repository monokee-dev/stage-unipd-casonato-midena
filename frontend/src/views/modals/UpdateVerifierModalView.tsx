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
    Box,
} from '@chakra-ui/react'
import { ethers } from 'ethers';
import { Result } from 'ethers/lib/utils';

const UpdateVerifierModalView = ({
    isOpen,
    onOpen,
    onClose,
    oldData,
    handleClick,
    isLoadingWrite, 
    isLoadingTx, 
    isSuccessTx,
    isPrepareError,
    prepareError,
    isError,
    error,
    setVerifierName,
    setVerifierDid,
    setVerifierUrl,
    setVerifierAddress,
}: {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    oldData: IVerifier,
    handleClick: () => void,
    isLoadingWrite: boolean,
    isLoadingTx: boolean,
    isSuccessTx: boolean,
    isPrepareError: boolean,
    prepareError: Error | null,
    isError: boolean,
    error: Error | null,
    setVerifierName: (name: string) => void,
    setVerifierDid: (did: string) => void,
    setVerifierUrl: (url: string) => void,
    setVerifierAddress: (address: string) => void,
}) => {
    return <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Please provide the following fields:</ModalHeader>
            <ModalCloseButton />

                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input variant='filled' defaultValue={oldData.name} mt='.2em' name='name' onChange={event =>
                            setVerifierName(event.currentTarget.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mt='.5em'>DID</FormLabel>
                        <Input variant='filled' defaultValue={oldData.did} mt='.2em' name='did' onChange={event =>
                            setVerifierDid(event.currentTarget.value)
                        } placeholder='did:example:123...'
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mt='.5em'>Url</FormLabel>
                        <Input variant='filled' defaultValue={oldData.url} mt='.2em' name='url' onChange={event =>
                            setVerifierUrl(event.currentTarget.value)
                        } placeholder='https://example.com'
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel mt='.5em'>Address</FormLabel>
                        <Input variant='filled' defaultValue={oldData.signer} mt='.2em' name='address' onChange={event =>
                            setVerifierAddress(event.currentTarget.value)
                        } placeholder='0x123...'
                        />
                    </FormControl>

                    {isLoadingWrite && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Check your wallet to complete the procedure...</Box>}
                    {isLoadingTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Please wait for the transaction to be mined...</Box>}
                    {isSuccessTx && <Box mt="1em" p={4} bg="green" borderRadius="lg">Transaction mined with success</Box>}
                    {isError && <Box mt="1em" p={4} bg="tomato" borderRadius="lg">Error: {error?.message}</Box>}
                </ModalBody>

                <ModalFooter>
                    <Button size='sm' variant='solid' colorScheme='red' mr={3} disabled={isLoadingWrite || isLoadingTx} onClick={onClose}>
                        Close
                    </Button>
                    <Button isLoading={isLoadingWrite || isLoadingTx} loadingText="Confirming" variant='solid' size='sm' disabled={isLoadingTx || isLoadingWrite} colorScheme='green' onClick={() => handleClick()}>Confirm</Button>
                </ModalFooter>

        </ModalContent>
    </Modal>
}

export default UpdateVerifierModalView;