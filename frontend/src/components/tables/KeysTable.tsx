import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react';
import { utils } from 'ssikit-sdk';
import { DeleteKeyModal, ExportKeyModal } from '../modals/Keys';

export default function KeysTable(props: { data: utils.Key[], updateKeys: () => Promise<void>, caption: string }) {
    return <TableContainer>
        <Table variant='simple' colorScheme='teal'>
            <TableCaption>{props.caption}</TableCaption>
            <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Algorithm</Th>
                    <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {props.data.map(key => {
                    return (
                        <Tr key={key.keyId.id}>
                            <Td w='50%' className='monospace' fontSize="md">{key.keyId.id}</Td>
                            <Td>{key.algorithm}</Td>
                            <Td>
                                <ExportKeyModal keyToExport={key}/>
                                <DeleteKeyModal keyToDelete={key} updateKeys={props.updateKeys}/>
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    </TableContainer>
}