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
    Checkbox,
} from '@chakra-ui/react'

const AddTrustedContractModalView = ({
    isOpen,
    onOpen,
    onClose,
    handleClick,
    isLoadingWrite, 
    isLoadingTx, 
    isSuccessTx,
    isPrepareError,
    prepareError,
    isError,
    error,
    setContractAddress,
    setContractName,
    setContractTrust,
} : {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    handleClick: () => void,
    isLoadingWrite: boolean,
    isLoadingTx: boolean,
    isSuccessTx: boolean,
    isPrepareError: boolean,
    prepareError: Error | null,
    isError: boolean,
    error: Error | null,
    setContractAddress: (address: string) => void,
    setContractName: (name: string) => void,
    setContractTrust: (trust: boolean) => void,
}) => {
    return <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Please provide the following fields:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isRequired  mt='1em'>
                    <FormLabel htmlFor="contractAddress">Contract Address</FormLabel>
                    <Input id="contractAddress" placeholder="0x..." onChange={(e) => 
                        setContractAddress(e.target.value)} 
                    />
                </FormControl>
                <FormControl isRequired  mt='1em'>
                    <FormLabel htmlFor="contractName">Contract Name</FormLabel>
                    <Input id="contractName" placeholder="Name" onChange={(e) =>
                        setContractName(e.target.value)}
                    />
                </FormControl>
                <FormControl mt='1em'>
                    <FormLabel htmlFor="contractTrust">Check the box if the contract is trusted</FormLabel>
                    <Checkbox defaultChecked={false} id="contractTrust" onChange={(e) => {
                        setContractTrust(e.target.checked)
                    }}
                    >
                        Trusted
                    </Checkbox>   
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
                <Button isLoading={isLoadingWrite || isLoadingTx} loadingText="Confirming" variant='solid' size='sm' disabled={isLoadingTx || isLoadingWrite} colorScheme='green' onClick={() => handleClick()}>Register</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>

};

export default AddTrustedContractModalView;