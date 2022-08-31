import {
    Box, Button, ButtonGroup, Heading,
    NumberInput,
    NumberInputField,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";


const ConsumeTokenView = ({
    handleClick,
    isLoadingWrite,
    isLoadingTx,
    isSuccessTx,
    isPrepareError,
    prepareError,
    isError,
    error,
    txHash,
    setTokenId,
    prepareErrorShort,
}: {
    handleClick: () => void,
    isLoadingWrite: boolean,
    isLoadingTx: boolean,
    isSuccessTx: boolean,
    isPrepareError: boolean,
    prepareError: Error | null,
    isError: boolean,
    error: Error | null,
    txHash: string | undefined,
    setTokenId: (id: string) => void,
    prepareErrorShort: string,
}) => {

    return <>
        <Heading>Consume Token from University</Heading>
        <p>If you have obtained your NFT token, you have to do the approve for the University's wallet.</p>

        <FormControl mt={6}>
            <FormLabel>TokenId</FormLabel>
            <NumberInput width="30%" min={0}>
                <NumberInputField onChange={(e) => {
                    setTokenId(e.currentTarget.value)
                }} />
            </NumberInput>
        </FormControl>

        <ButtonGroup mt={4}>

            <Button isLoading={isLoadingWrite || isLoadingTx} loadingText="Confirming" variant='solid' size='sm' disabled={isLoadingTx || isLoadingWrite || isPrepareError} colorScheme='green' onClick={() => {
                //setStartConsume(true)
                handleClick()
            }}>
                Consume NFT
            </Button>
            
        </ButtonGroup>

        {isLoadingWrite && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Check your wallet to complete the procedure...</Box>}
        {isLoadingTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Please wait for the transaction to be mined...</Box>}
        {isSuccessTx &&
            <Box mt="1em" p={4} bg="green" borderRadius="lg">
                Transaction mined with success.
                <p><a href={'https://goerli.etherscan.io/tx/'+txHash} /></p>
            </Box>}
        {isError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">Consume Error: {error?.message}</Box>}
        {isPrepareError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">Consume Prepare error: {prepareErrorShort}</Box>}
    </>;

}

export default ConsumeTokenView;