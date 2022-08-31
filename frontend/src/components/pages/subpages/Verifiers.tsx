import AddVerifierModal from '../../modals/AddVerifierModal'
import { 
    SearchVerifierFromAddressController, 
    VerifierCountController, 
} from '../../../controllers';
import { Box, Heading, HStack, Text } from '@chakra-ui/react';

export default function Verifiers(){
    
    return (
        <Box id='main-container' className="with-navbar">
            <HStack>
            </HStack>
            <Box className="widget-box">
            </Box>
            <Box>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Heading as='h2' size='xl' mb="0.5em">On-Chain Verifiers</Heading>
                        <AddVerifierModal />
                    </Box>
                    <VerifierCountController />
                </HStack>
                <Text fontSize="2xl" mt="1em">Search a verifier</Text>
            </Box>
            <SearchVerifierFromAddressController />
        </Box>
    );

}
