import { DeleteIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, ButtonGroup, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Result } from "ethers/lib/utils";
import Moment from 'react-moment';
Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';

const VerifierItemView = ({
    contractInfo,
    handleClick,
    isLoadingWrite, 
    isLoadingTx, 
    isSuccessTx,
    isPrepareError,
    prepareError,
    isError,
    error,
}: {
    contractInfo: ITrustedSmartContract,
    handleClick: () => void,
    isLoadingWrite: boolean,
    isLoadingTx: boolean,
    isSuccessTx: boolean,
    isPrepareError: boolean,
    prepareError: Error | null,
    isError: boolean,
    error: Error | null,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return <li className="card-item">
        <Stack spacing="20px">
            <Box>
                <Text fontSize='3xl'>{contractInfo.name}</Text>
                <Badge variant="solid" colorScheme={contractInfo.trusted ? 'green' : 'red'} fontSize='1em'>{contractInfo.trusted ? "TRUSTED" : "UNTRUSTED"}</Badge>
            </Box>
            <Box>
                <span className="fieldname">Address:</span> {contractInfo.address}
            </Box>
            <Box>
                <span className="fieldname">Registration date:</span> <Moment unix>{contractInfo.lastChangeTime}</Moment>
            </Box>
            <Box>
                <span className="fieldname">Owner:</span> {contractInfo.owner}
            </Box>

            {isLoadingWrite && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Check your wallet to complete the procedure...</Box>}
            {isLoadingTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Please wait for the transaction to be mined...</Box>}
            {isSuccessTx && <Box mt="1em" p={4} bg="green" borderRadius="lg">Transaction mined with success</Box>}
            {isError && <Box mt="1em" p={4} bg="tomato" borderRadius="lg">Error: {error?.message}</Box>}
        

            {
                isPrepareError ?
                    <Box display="inline-block" width="50%" mt="1em" p={4} bg="orange.200" color="black" borderRadius="lg">
                        This account cannot perform actions to this record.
                    </Box> 
                    :
                    <ButtonGroup variant='outline' spacing='6' mt='1em'> 
                        <Button isLoading={isLoadingWrite || isLoadingTx} loadingText="Editing" leftIcon={<DeleteIcon />} colorScheme='yellow' variant='solid' disabled={isLoadingTx || isLoadingWrite || isPrepareError} onClick={() => {
                            handleClick()
                        }}>
                            Edit Trust
                        </Button>
                    </ButtonGroup>
            }
        </Stack>
    </li>
};

export default VerifierItemView;