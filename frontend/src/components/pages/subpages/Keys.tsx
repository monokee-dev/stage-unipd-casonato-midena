import { Box, Heading } from '@chakra-ui/react';
import { AddKeyModal, ImportKeyModal, DeleteAllKeysModal } from '../../modals/Keys';
import { KeysTable } from '../../tables';
import { utils } from 'ssikit-sdk';

export default function Keys(props:{updateKeys: () => Promise<void>, keys: utils.Key[]}) {
    
    return (
        <Box id='main-container' className="with-navbar">
            <Heading as='h2' mb='1em'>
                Keys Management
            </Heading>
            <Box display='flex' justifyContent='space-between' mb='2em'>
                <Box>
                    <AddKeyModal updateKeys={props.updateKeys}/>
                    <ImportKeyModal updateKeys={props.updateKeys}/>
                </Box>             
                <DeleteAllKeysModal updateKeys={props.updateKeys}/>
            </Box>
            <KeysTable data={props.keys} updateKeys={props.updateKeys} caption='Your keys'/>
        </Box>
    );

}