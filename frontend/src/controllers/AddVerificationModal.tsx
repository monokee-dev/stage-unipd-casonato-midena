
import { Button, FormControl, FormLabel, Input, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite, useSigner, useSignTypedData } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { FaPlus } from "react-icons/fa";
import { ethers } from "ethers";

const AddVerificationModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [vr_address, vr_abi, domain, types] = useVerificationRegistryData();

    // Form params setters
    const [schema, setSchema] = useState('');
    const [subject, setSubject] = useState('');
    const [expiration, setExpiration] = useState('');


    const verificationResult: IVerificationResult = {
        subject: subject,
        expiration: (new Date(expiration))?.getTime() / 1000,
        jsonResult: "",
        useCase: "diploma",
        signature: ""
    };

    //console.log(domain, types, verificationResult);

    //const { signature, signTypedData } = CreateSignature(domain, types, verificationResult);

    const { data: signature, error: signError, isError, isLoading: isLoadingSignature, isSuccess: isSuccessSignature, signTypedData } =
        useSignTypedData({
            domain,
            types,
            value: verificationResult
        });

    const { config, error } = usePrepareContractWrite({
        addressOrName: vr_address,
        contractInterface: vr_abi,
        functionName: 'registerVerification',
        enabled: (ethers.utils.isAddress(subject)),
        args: [verificationResult, signature]
    })

    const { data, error: writeError, isLoading, isSuccess, write } = useContractWrite(config);

    return (
        <>
            <Button onClick={onOpen} leftIcon={<FaPlus />} colorScheme='blue' variant='solid' mt="1em">
                New Verification
            </Button>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Please provider the following fields</ModalHeader>
                    <ModalCloseButton />

                        <ModalBody>
                            <FormControl isRequired>
                                <FormLabel>Schema</FormLabel>
                                <Input variant='filled' mt='.2em' name='schema' onChange={event =>
                                    setSchema(event.currentTarget.value)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel mt='.5em'>Subject</FormLabel>
                                <Input variant='filled' mt='.2em' name='subject' onChange={event =>
                                    setSubject(event.currentTarget.value)
                                } placeholder='0x123...'
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel mt='.5em'>Expiration Date</FormLabel>
                                <Input type="datetime-local" variant='filled' mt='.2em' name='expiration' onChange={event =>
                                    setExpiration(event.currentTarget.value)
                                }
                                />
                            </FormControl>
                        
                            {(isLoading || isLoadingSignature) ? <Text mt="1em" mb="0.5em" padding="0.3em" bg="gray">Complete on wallet...</Text> : null}
                            {signError ? <Text mt="1em" mb="0.5em" bg="red">{signError.message}</Text> : null}
                        </ModalBody>

                        <ModalFooter>

                            <Button size='sm' colorScheme='red' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button size='sm' colorScheme={isLoadingSignature ? 'yellow' : 'blue'} disabled={isLoadingSignature} mr={3} onClick={() => {
                                try {
                                    signTypedData();
                                } catch( error ) {
                                    console.log("Try catch error: ", error);
                                }
                            }}>
                                {isLoadingSignature ? "Check Wallet" : "Create Signature"}
                            </Button>
                            <Button size='sm' colorScheme={isLoading ? 'yellow' : 'green'} disabled={!write} onClick={() => {
                                write?.()
                            }}>
                                {isLoading ? "Confirm tx" : "Confirm"}
                            </Button>

                        </ModalFooter>
                    
                        {isSuccess && <div>Tx hash: {JSON.stringify(data)}</div>}
                </ModalContent>
            </Modal>
        </>
    )
};

export default AddVerificationModal;