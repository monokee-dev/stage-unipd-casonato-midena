import { Box, Flex, FormControl, FormLabel, Heading, Input, Spacer, Text } from "@chakra-ui/react";
import { Result } from "ethers/lib/utils";
import { VerificationRecordItemController } from "../controllers";

const SearchVerificationRecordsView = ({ 
    verificationRecords, 
    setUuid, 
    setSubjectAddress, 
    setVerifierAddress
}: {
    verificationRecords: Result | undefined,
    setUuid: (arg0: string) => void,
    setSubjectAddress: (arg0: string) => void,
    setVerifierAddress: (arg0: string) => void
}) => {
    return (
        <Box width="100%" mr="auto">
            <Heading as='h2' size='xl' mt="2em">Search a Verification Record</Heading>
            <Flex mt="1.5em" mb="2em">
                <Box mr="2em" width="33%">
                    <FormControl>
                        <FormLabel htmlFor="uuid">UUID:</FormLabel>
                        <Input name="uuid" variant='filled' placeholder='000-0000-0000' onChange={event =>
                            setUuid(event.currentTarget.value)
                        } />
                    </FormControl>
                </Box>
                <Box mr="2em" width="33%">
                    <FormControl>
                        <FormLabel htmlFor="subject">Subject address:</FormLabel>
                        <Input name="subject" variant='filled' placeholder='0x123...' onChange={event =>
                            setSubjectAddress(event.currentTarget.value)
                        } />
                    </FormControl>
                </Box>
                <Box width="33%">
                    <FormControl>
                        <FormLabel htmlFor="verifier">Verifier address:</FormLabel>
                        <Input name="verifier" variant='filled' placeholder='0x123...' onChange={event =>
                            setVerifierAddress(event.currentTarget.value)
                        } />
                    </FormControl>
                </Box>
            </Flex>
            {(verificationRecords?.length) ? 
                <>
                    <Heading as='h2' size='xl'>Verification Records list</Heading>
                    <ul>
                        {verificationRecords.map((record, index) => 
                            <VerificationRecordItemController record={record} key={index} />
                        )}
                    </ul>
                </>
                : null}
        </Box>
    )
};

export default SearchVerificationRecordsView;