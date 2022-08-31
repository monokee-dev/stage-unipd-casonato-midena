
import { VStack } from '@chakra-ui/react';
import { 
    SearchTrustedContractFromAddressController,
    AddTrustedContract
} from '../../controllers';

export function TrustedContracts(){
    
    return (
        <VStack id='main-container'>
            <AddTrustedContract />
            <SearchTrustedContractFromAddressController />
        </VStack>
    )

}


export default TrustedContracts;