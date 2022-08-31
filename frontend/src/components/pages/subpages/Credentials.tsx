import { Box, Heading } from '@chakra-ui/react';
import { ImportVcModal, PresentVcsModal, DeleteAllVcsModal } from '../../modals/VCs';
import { VcsTable } from '../../tables';

export default function Credentials(props:{
    updateVcs: () => Promise<void>,
    dids: string[],
    vcs: string[],
    vcsToPresent: string[],
    setVcsToPresent: React.Dispatch<React.SetStateAction<string[]>>
}) {
    return (
        <Box id='main-container' className="with-navbar">
            <Heading as='h2' mb='1em'>
                Credentials Management
            </Heading>
            <Box display='flex' justifyContent='space-between' mb='2em'>
                <Box>
                    <ImportVcModal updateVcs={props.updateVcs}/>
                    <PresentVcsModal updateVcs={props.updateVcs} vcsToPresent={props.vcsToPresent} dids={props.dids}/>
                </Box>             
                <DeleteAllVcsModal updateVcs={props.updateVcs}/>
            </Box>
            <VcsTable 
                data={props.vcs} 
                updateVcs={props.updateVcs} 
                vcsToPresent={props.vcsToPresent}
                setVcsToPresent={props.setVcsToPresent}
                caption='Your Credentials'
            />
        </Box>
    );

}