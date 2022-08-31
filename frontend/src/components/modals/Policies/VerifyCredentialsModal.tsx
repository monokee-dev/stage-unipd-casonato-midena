import { CheckIcon } from '@chakra-ui/icons';
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
    Textarea,
    Box,
    HStack,
    Select,
    Input,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Custodian, Auditor, Signatory, utils } from 'ssikit-sdk';
import axios from 'axios';
import { Buffer } from "buffer";
import useVerificationRegistryData from '../../../hooks/useVerificationRegistryData';
import { useContractWrite, usePrepareContractWrite, useSignTypedData, useWaitForTransaction } from 'wagmi';
import { ethers } from 'ethers';

export default function VerifyCredentialsModal(props: {policiesToUse: string[]}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [vr_address, vr_abi, domain, types] = useVerificationRegistryData();

    const [credentialsToVerify, setCredentialsToVerify] = useState<string>("[\n\n]");
    const [result, setResult] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [keys, setKeys] = useState<utils.Key[]>([]);
    const [subject, setSubject] = useState<string>("");
    const [verifierKey, setVerifierKey] = useState<string>("");
    const [expiration, setExpiration] = useState<string>("");
    const [didSignature, setDidSignature] = useState<string>("");
    const [error, setError] = useState<string>("");

    const verificationResult: IVerificationResult = {
        subject: subject,
        expiration: (new Date(expiration))?.getTime() / 1000,
        jsonResult: result,
        useCase: "diploma",
        signature: didSignature
    };

    const { data: signature, error: signError, isError, isLoading: isLoadingSignature, isSuccess: isSuccessSignature, signTypedData } =
        useSignTypedData({
            domain,
            types,
            value: verificationResult,
            onError: (error) => {
                console.log(JSON.stringify(error));
            }
        });

    const { config, error: prepareError } = usePrepareContractWrite({
        addressOrName: vr_address,
        contractInterface: vr_abi,
        functionName: 'registerVerification',
        enabled: (ethers.utils.isAddress(subject) && !!signature),
        args: [verificationResult, signature],
        onError(error) {
            console.log('Error', error)
        },
    })

    const { data, error: writeError, isError: isErrorWrite, isLoading: isLoadingWrite, isSuccess, write } = useContractWrite(config);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingTx, isSuccess: isSuccessTx } = useWaitForTransaction({
        hash: data?.hash,
    });

    const checkIfCredsRevoked = async (credentials: any[]) => {
        let revoked = await Promise.all(credentials.map(async cred => {
            if (cred?.credentialStatus && cred?.credentialStatus?.type === "SimpleCredentialStatus2022") {
                let id = cred?.credentialStatus?.id
                let index = id?.indexOf("/revocations/")
                let token = ""
                if (index !== -1) {
                    token = id?.substring(index + "/revocations/".length)
                }
                let isRevoked = (await Signatory.isRevoked(token)).isRevoked;
                if (isRevoked) {
                    return cred
                }
            }
        }));
        return revoked;
    }

    const checkIfValid = async (event: any) => {
        event.preventDefault();
        try {
            let credentials: any[] = JSON.parse(credentialsToVerify);
            let revoked = await checkIfCredsRevoked(credentials);
            if (revoked.some(cred => cred !== undefined)) {
                throw new Error("Error: one or more credentials are revoked")
            } else {
                if (props.policiesToUse.length !== 0 && credentialsToVerify !== "[\n\n]") {
                    let policies = props.policiesToUse.map(policy => {
                        return { policy: policy };
                    });
                    let request: utils.VerificationRequest = {
                        credentials,
                        policies
                    };
                    let result = await Auditor.verifyCredential(request);
                    if (result) {
                        setResult(JSON.stringify(result));
                        result?.valid ? setVerified(true) : setVerified(false);
                    } else {
                        setError("Error: couldn't verify credentials (probably not valid)")
                    }
                }
            }
        } catch (error) {
            alert(error);
        }
    };

    const registerVerificationRecord = async () => {
        let record = verificationResult;
        delete record.signature;

        let messageString = JSON.stringify(record);
        const request: signatureRequest = {
            keyId: verifierKey,
            message: messageString
        }
        let didSignature = (await axios.post("/createSignature", {data:request})).data;
        let encoded = Buffer.from(JSON.stringify(didSignature)).toString('base64');
        setDidSignature(encoded);
    }

    const reset = () => {
        setCredentialsToVerify("[\n\n]");
    }

    const initKeys = async () => {
        let keys = await Custodian.getKeys();
        setKeys(keys);
        setVerifierKey(keys[0]?.keyId?.id);
    }

    useEffect(() => {
        setCredentialsToVerify("[\n\n]");
        setResult("");
        setError("");
        setVerified(false);
        initKeys();
    }, [isOpen]);

    useEffect(() => {
        setError("");
        setResult("");
        setVerified(false);
    }, [credentialsToVerify]);

    useEffect(() => {
        if (didSignature) {
            try {
                signTypedData();
            } catch (error) {
                console.log("Sign error: ", error)
            }
        }
    }, [didSignature])

    return (
        <>
            <Button isDisabled={props.policiesToUse.length===0}
                onClick={onOpen} leftIcon={<CheckIcon/>} colorScheme='orange' variant='solid' alignSelf='right' mr='1em'
            >
                Verify Credentials
            </Button>

            <Modal size="2xl" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Verify credentials</ModalHeader>
                    <ModalCloseButton />
                    <form>
                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Credential(s) to verify (VCs/VPs)</FormLabel>
                                <Text mb="0.5em">Paste here your VC, VP or list of them separated with comma:</Text>
                                <Textarea
                                    value={credentialsToVerify}
                                    onChange={(e) => setCredentialsToVerify(e.target.value)}
                                    h='15em'
                                    variant="filled"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter display="flex" flexDir="column">
                            <HStack w="100%">
                                {error && <Text mr="auto" color="red.200">{error}</Text>}
                                <Box mr="auto">
                                    {
                                        !error &&
                                        <Button onClick={reset} size='sm' colorScheme='orange'>
                                            Reset
                                        </Button>
                                    }
                                </Box>
                                <Box ml="auto">
                                    <Button onClick={checkIfValid} size='sm' colorScheme='green'>
                                        Verify
                                    </Button>
                                </Box>
                            </HStack>
                            <Box w="100%">
                                <FormControl isRequired>              
                                    <FormLabel mt='2em'>Verification result:</FormLabel>
                                    <Textarea isDisabled={result?.length===0}
                                        mt='0.5em' mb="1em" 
                                        height="15em" value={
                                            result ? 
                                                JSON.stringify(JSON.parse(result), null, 4)
                                            : ""
                                        } variant="filled"
                                    />
                                </FormControl>
                            </Box>
                            <Box w="100%">
                                <FormControl isRequired>
                                    <FormLabel mt="1em">Subject address</FormLabel>
                                    <Input
                                        isDisabled={!verified}
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="monospace"
                                        w="60%"
                                        name='subject'
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel mt="1em">Key linked to the Verifier DID</FormLabel>
                                    <Select
                                        isDisabled={!verified}
                                        value={verifierKey}
                                        onChange={(e) => setVerifierKey(e.target.value)}
                                        className="monospace"
                                        w="60%"
                                    >
                                        {keys.map(myKey => {
                                            return <option className="monospace" key={myKey.keyId.id} value={myKey.keyId.id}>
                                                {myKey.keyId.id}
                                            </option>
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel mt="1em">Expiration date</FormLabel>
                                    <Input type="date"
                                        isDisabled={!verified}
                                        value={expiration}
                                        onChange={(e) => setExpiration(e.target.value)}
                                        className="monospace"
                                        w="60%"
                                    />
                                </FormControl>

                                {isLoadingWrite && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Check your wallet to complete the procedure...</Box>}
                                {isLoadingTx && <Box mt="1em" p={4} bg="yellow" color="black" borderRadius="lg">Please wait for the transaction to be mined...</Box>}
                                {isSuccessTx && <Box mt="1em" p={4} bg="green" borderRadius="lg">Transaction mined with success</Box>}
                                {isErrorWrite && <Box mt="1em" p={4} bg="tomato" borderRadius="lg">Error: there is an error with Metamask</Box>}
                            
                            </Box>
                            <HStack ml="auto" mt="1.5em">
                                <Button onClick={onClose} size='md' colorScheme='red'>
                                    Close
                                </Button>
                                <Button size='md' isLoading={isLoadingSignature} loadingText="Signing" colorScheme='blue' disabled={isLoadingSignature || isSuccessSignature || !verified} mr={3} onClick={() => {
                                    try {
                                        registerVerificationRecord();
                                    } catch( error ) {
                                        console.log("Try catch error: ", error);
                                    }
                                }}>
                                    {isSuccessSignature ? "Signed" : "Sign"}
                                </Button>
                                <Button size='md' isLoading={isLoadingTx || isLoadingWrite} loadingText="Confirming" colorScheme={isLoadingWrite ? 'yellow' : 'green'} disabled={!write || isLoadingTx || isLoadingWrite || isSuccessTx} onClick={() => {
                                    write?.()
                                }}>
                                    Confirm
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}