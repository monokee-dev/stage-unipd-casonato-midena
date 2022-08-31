import { Box, Heading } from '@chakra-ui/react';
import { utils } from 'ssikit-sdk';
import { AddDidModal, ImportDidModal, ResolveDidModal, DeleteAllDidsModal } from '../../modals/DIDs';
import { DidsTable } from '../../tables';

export default function Dids(props:{updateDids: () => Promise<void>, keys: utils.Key[], dids: string[]}) {
    return (
        <Box id='main-container' className="with-navbar">
            <Heading as='h2' mb='1em'>
                DIDs Management
            </Heading>
            <Box display='flex' justifyContent='space-between' mb='2em'>
                <Box>
                    <AddDidModal keys={props.keys} dids={props.dids} updateDids={props.updateDids}/>
                    <ImportDidModal updateDids={props.updateDids}/>
                    <ResolveDidModal/>
                </Box>             
                <DeleteAllDidsModal updateDids={props.updateDids}/>
            </Box>
            <DidsTable data={props.dids} updateDids={props.updateDids} caption='Your DIDs'/>
        </Box>
    );

}