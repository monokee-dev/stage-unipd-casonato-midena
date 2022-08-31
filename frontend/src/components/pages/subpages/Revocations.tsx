import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Signatory, utils } from "ssikit-sdk";

export default function Revocations() {

    const [privateToken, setPrivateToken] = useState<string>("");
    const [publicToken, setPublicToken] = useState<string>("");
    const [revocationSuccess, setRevocationSuccess] = useState<boolean>(false);
    const [revocationError, setRevocationError] = useState<boolean>(false);
    const [revocationStatus, setRevocationStatus] = useState<utils.RevocationStatus>();
    const [checkResult, setCheckResult] = useState<JSX.Element>();

    const convertDate = (timestamp: EpochTimeStamp | undefined): string => {
        if (timestamp) {
            var date = new Date(timestamp);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            return day + "/" + month + "/" + year;
        } else {
            return "";
        }
    }

    const revokeCredential = async () => {
        let revocation = await Signatory.revokeCredential(privateToken);
        if (revocation) {
            setRevocationSuccess(true);
        } else {
            setRevocationError(true);
        }
    }

    const checkRevocation = async () => {
        let status: utils.RevocationStatus = await Signatory.isRevoked(publicToken);
        setRevocationStatus(status);
    }

    useEffect(() => {
        if (revocationStatus) {
            if (revocationStatus.isRevoked) {
                setCheckResult(isRevoked);
            } else {
                setCheckResult(isNotRevoked);
            }
        }
    }, [revocationStatus])

    useEffect(() => {
        setRevocationSuccess(false);
        setRevocationError(false);
    }, [privateToken])

    useEffect(() => {
        setRevocationStatus(undefined);
        setCheckResult(undefined);
    }, [publicToken])

    const successColor = "cyan.200";
    const errorColor = "red.300";

    const isNotRevoked = <Text fontWeight="bold" color={successColor}>Credential has not been revoked yet.</Text>
    const isRevoked = (
        <Text fontWeight="bold" color={errorColor}>
            Credential has been revoked on {convertDate(revocationStatus?.timeOfRevocation)}
        </Text>
    )

    return (
        <Box id="main-container" className="with-navbar">
            <Box mb="3em">
                <Heading as='h2' mb="0.25em">
                    Revocations
                </Heading>
                <Text mb="0.1em">The private revocation token is held by the issuer (who generated it before issuing the credential);</Text>
                <Text>The public revocation token can be found in the "CredentialStatus" field in the VC (refer to W3C docs);</Text>
            </Box>
            <HStack w="100%">
                <Box id="check-revocation" w="35%" mr="10em">
                    <Heading as="h3" size="md" mb="1em">Revoke credential</Heading>
                    <FormControl isRequired>
                        <FormLabel>Private revocation token</FormLabel>
                        <Input 
                            value={privateToken}
                            onChange={(e) => setPrivateToken(e.target.value)}
                            placeholder='202a4733-dd1e-4914...' 
                            variant="filled"
                        />
                    </FormControl>
                    <HStack alignItems="flex-end" justifyContent="space-between">
                        <Button onClick={revokeCredential} colorScheme="red" mt="1em">
                            Revoke
                        </Button>
                        { revocationSuccess && <Text fontWeight="bold" color={successColor}>Credential revoked successfully!</Text> }
                        { revocationError && <Text fontWeight="bold" color={errorColor}>Error during revocation, retry!</Text> }
                    </HStack>
                </Box>
                <Box id="check-revocation" w="35%" mr="10em">
                    <Heading as="h3" size="md" mb="1em">Check revocation status</Heading>
                    <FormControl isRequired>
                        <FormLabel>Public revocation token</FormLabel>
                        <Input 
                            value={publicToken}
                            onChange={(e) => setPublicToken(e.target.value)}
                            placeholder='GLFPG2BHPJXWEDKVR...' 
                            variant="filled"
                        />
                    </FormControl>
                    <HStack alignItems="flex-end" justifyContent="space-between">
                        <Button onClick={checkRevocation} colorScheme="cyan" mt="1em">
                            Check
                        </Button>
                        {checkResult}
                    </HStack>
                </Box>
            </HStack>
        </Box>
    );
}