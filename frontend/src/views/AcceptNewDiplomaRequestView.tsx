import { 
    Box, 
    Button, 
    ButtonGroup, 
    Heading, 
    Textarea,
    Text 
} from "@chakra-ui/react";


const AcceptNewDiplomaRequestView = ({
    handleClick,
    isLoadingWrite, 
    isLoadingTx, 
    isSuccessTx,
    isPrepareError,
    prepareError,
    prepareErrorShort,
    isError,
    error,
    txHash,
    setStartRequest,
    defaultMetadata,
    setMetadata,
    uploadedIPFS
} : {
    handleClick: () => void,
    isLoadingWrite: boolean,
    isLoadingTx: boolean,
    isSuccessTx: boolean,
    isPrepareError: boolean,
    prepareError: Error | null,
    prepareErrorShort: string | undefined,
    isError: boolean,
    error: Error | null,
    txHash: string | undefined,
    setStartRequest: (start: boolean) => void,
    defaultMetadata: string,
    setMetadata: (metadata: string) => void,
    uploadedIPFS: boolean
}) => {

    return <>
        <Heading>New diploma request</Heading>
        <Text>Hi Student! Provide your informations for receiving your NFT.</Text>

        <Text mt="1em" mb="8px" fontSize="2xl">NFT metadata:</Text>
        <Textarea
            defaultValue={defaultMetadata}
            onChange={ (e) => {
                setMetadata(e.target.value)
            }}
            size='md'
            height="xs"
        />

        <ButtonGroup mt={4}>

            <Button variant='solid' size='sm' colorScheme="orange" disabled={uploadedIPFS} onClick={() => {
                setStartRequest(true);
            }}>
                {uploadedIPFS ? "Uploaded" : "Upload to IPFS" }
            </Button>

            <Button isLoading={isLoadingWrite || isLoadingTx} loadingText="Confirming" variant='solid' size='sm' disabled={isLoadingTx || isLoadingWrite || isPrepareError || !uploadedIPFS} colorScheme='green' onClick={() => {
                //setStartRequest(true)
                handleClick()
            }}>
                Request NFT
            </Button>

        </ButtonGroup>


        {isLoadingWrite && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Check your wallet to complete the procedure...</Box>}
        {isLoadingTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Please wait for the transaction to be mined...</Box>}
        {isSuccessTx && 
            <Box mt="1em" p={4} bg="green" borderRadius="lg">
                Transaction mined with success. See your tx at: <a href={'https://goerli.etherscan.io/tx/'+txHash}>{'https://goerli.etherscan.io/tx/'+txHash}</a>
            </Box>}
        {isError && <Box mt="1em" p={4} bg="tomato" borderRadius="lg" width="50%">Error: {error?.message}</Box>}
        {isPrepareError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{prepareErrorShort}</Box>}  
    </>;

}

export default AcceptNewDiplomaRequestView;