import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PoliciesTable } from '../../tables';
import { Auditor, utils } from 'ssikit-sdk';
import { AddPolicyModal, VerifyCredentialsModal } from '../../modals/Policies';
import { SearchVerificationRecordsController, VerificationRecordCountController } from '../../../controllers';

export default function Verifications(){

    const [policies, setPolicies] = useState<utils.VerificationPolicy[]>([]);
    const [policiesToUse, setPoliciesToUse] = useState<string[]>([]);

    const updatePolicies = async () => {
        let policies = await Auditor.getVerificationPolicies();
        setPolicies(policies);
    }

    useEffect(() => {
        updatePolicies();
    }, []);
    
    return (
        <Box id='main-container' className="with-navbar">
            <HStack justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Box mb="1.5em">
                        <Heading as="h2" mb="0.25em">
                            Create a verification record
                        </Heading>
                        <Text>
                            To create a verification record, select the policies you want to use and click the "Verify Credentials" button.
                        </Text>
                    </Box>
                    <Box mb='2em'>
                        <AddPolicyModal updatePolicies={updatePolicies} policies={policies}/>
                        <VerifyCredentialsModal policiesToUse={policiesToUse}/>
                    </Box>
                </Box>
                <VerificationRecordCountController />
            </HStack>
            <Heading as="h3" size="md" mb="1em">List of verification policies</Heading>
            <PoliciesTable 
                data={policies}
                updatePolicies={updatePolicies} 
                policiesToUse={policiesToUse}
                setPoliciesToUse={setPoliciesToUse}
                caption='Verification Policies'
            />
            <SearchVerificationRecordsController />
        </Box>
    );

}
