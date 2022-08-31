import { CloseIcon, DeleteIcon, InfoIcon } from "@chakra-ui/icons";
import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Textarea,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Tooltip,
    Flex,
} from "@chakra-ui/react";
import { Buffer } from "buffer";
import { Result } from "ethers/lib/utils";
import Moment from 'react-moment';
Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';

const VerificationRecordItemView = ({
    record,
    handleClickRevoke,
    isLoadingRevoke,
    isSuccessRevoke,
    isPrepareRevokeError,
    isRevokeError,
    prepareRevokeError,
    prepareRevokeErrorShort,
    revokeError,
    txHashRevoke,
    isLoadingRevokeTx,
    isSuccessRevokeTx,
    handleClickRemove,
    isLoadingRemove,
    isSuccessRemove,
    isPrepareRemoveError,
    isRemoveError,
    prepareRemoveError,
    prepareRemoveErrorShort,
    removeError,
    txHashRemove,
    isLoadingRemoveTx,
    isSuccessRemoveTx,
    isValid
}: {
    record: Result,
    handleClickRevoke: () => void,
    isLoadingRevoke: boolean,
    isSuccessRevoke: boolean,
    isPrepareRevokeError: boolean,
    isRevokeError: boolean,
    prepareRevokeError: Error | null,
    prepareRevokeErrorShort: string,
    revokeError: Error | null,
    txHashRevoke: string | undefined,
    isLoadingRevokeTx: boolean,
    isSuccessRevokeTx: boolean,
    handleClickRemove: () => void,
    isLoadingRemove: boolean,
    isSuccessRemove: boolean,
    isPrepareRemoveError: boolean,
    isRemoveError: boolean,
    prepareRemoveError: Error | null,
    prepareRemoveErrorShort: string,
    removeError: Error | null,
    txHashRemove: string | undefined,
    isLoadingRemoveTx: boolean,
    isSuccessRemoveTx: boolean,
    isValid: boolean
}) => {
    return <li className="card-item">
        <div className="verification-record-box">
            <div className="card-header">
                <span className="uuid">{record.uuid}</span>
                <Badge variant="solid" colorScheme={record.revoked ? 'red' : 'green'} fontSize='1em'>{record.revoked ? "REVOKED" : "VALID"}</Badge>
            </div>
            <div className="verification-record-data">
                <Text>
                    <span className="fieldname">Verifier:</span> {record.verifier}
                </Text>
                <Text>
                    <span className="fieldname">Subject:</span>  {record.subject}
                </Text>
            </div>
            <div>
                <Text>
                    <span className="fieldname">Entry time: </span> <Moment unix>{record.entryTime}</Moment>
                    <span className="fieldname">Expiration time: </span> <Moment unix>{(record.expirationTime)}</Moment>
                </Text>
            </div>
            <Box mt="2em">
                <Flex alignItems="center">
                    <Tooltip label="If DID signature isn't VALID you cannot trust the record" fontSize='md' bg='teal.200'>
                        <InfoIcon mr="0.5em" />
                    </Tooltip>
                    <span className="fieldname">DID signature:</span> 
                    <Badge colorScheme={isValid ? "green" : "red"} variant='solid' ml="1em" fontSize="lg">
                        {
                            isValid ? "VALID" : "INVALID"
                        }
                    </Badge>
                </Flex>           
            </Box>
            <Box mt="1em">    
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex='1' textAlign='left'>
                                    See DID signature details (for manual verification)
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Textarea 
                                value={
                                    JSON.stringify(
                                        JSON.parse(
                                            Buffer.from(record.signature, 'base64').toString('ascii')
                                        ), 
                                        null, 
                                        4
                                    )
                                } 
                                height="18em"
                                readOnly/>
                            <Text><span className="fieldname">Verification JSON result:</span></Text>
                            <Textarea value={JSON.stringify(JSON.parse(record.jsonResult), null, 4)} height="18em" readOnly />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>

            {
                isPrepareRevokeError && isPrepareRemoveError ?

                    <Box display="inline-block" mt="1em" p={4} bg="orange.200" color="black" borderRadius="lg">
                        This account cannot perform actions to this record.
                        {isPrepareRemoveError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{prepareRemoveErrorShort}</Box>}
                        {isPrepareRevokeError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{prepareRevokeErrorShort}</Box>}

                    </Box>

                    : <>
                        < ButtonGroup variant='outline' spacing='6' mt='1em'>
                            {!record.revoked ?
                                <Button isLoading={isLoadingRevoke} loadingText="Revoking" leftIcon={<CloseIcon />} colorScheme='yellow' variant='solid' disabled={isLoadingRevoke || isLoadingRemove || isPrepareRevokeError} onClick={() => {
                                    handleClickRevoke()
                                }}>
                                    Revoke
                                </Button>
                                : null}


                            <Button isLoading={isLoadingRemove} loadingText="Removing" leftIcon={<DeleteIcon />} colorScheme='red' variant='solid' disabled={isLoadingRevoke || isLoadingRemove || isPrepareRemoveError} onClick={() => {
                                handleClickRemove()
                            }}>
                                Remove
                            </Button>
                        </ButtonGroup>

                        {isLoadingRevoke && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Check your wallet to complete the procedure...</Box>}
                        {isLoadingRevokeTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Please wait for the transaction to be mined...</Box>}
                        {isSuccessRevokeTx &&
                            <Box mt="1em" p={4} bg="green" borderRadius="lg">
                                Transaction mined with success.
                                <Text><a href={'https://goerli.etherscan.io/tx/' + txHashRevoke} /></Text>
                            </Box>}
                        {isRevokeError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{revokeError?.message}</Box>}
                        {isPrepareRevokeError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{prepareRevokeErrorShort}</Box>}

                        {isLoadingRemove && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Check your wallet to complete the procedure...</Box>}
                        {isLoadingRemoveTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg" width="50%">Please wait for the transaction to be mined...</Box>}
                        {isSuccessRemoveTx &&
                            <Box mt="1em" p={4} bg="green" borderRadius="lg">
                                Transaction mined with success.
                                <Text><a href={'https://goerli.etherscan.io/tx/' + txHashRemove} /></Text>
                            </Box>}
                        {isRemoveError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{removeError?.message}</Box>}
                        {isPrepareRemoveError && <Box mt="1em" p={4} bg="teal" borderRadius="lg" width="50%">{prepareRemoveErrorShort}</Box>}
                    </>
            }

        </div>
    </li >
};

export default VerificationRecordItemView;