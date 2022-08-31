
import { Box, Divider } from "@chakra-ui/react";
import { AcceptNewDiplomaRequestController, ConsumeTokenController, ShowPersonalNFTsController } from "../../controllers";

export function DiplomaUseCase(){
    
    return (
        <Box id='main-container'>
            <AcceptNewDiplomaRequestController />
            <Divider m={6} />
            <ShowPersonalNFTsController />
            <Divider m={6} />
            <ConsumeTokenController />
        </Box>
    )

}


export default DiplomaUseCase;