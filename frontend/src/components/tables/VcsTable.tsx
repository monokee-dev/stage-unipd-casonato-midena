import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Checkbox,
} from '@chakra-ui/react';
import { ViewVcModal, DeleteVcModal } from '../modals/VCs';

export default function VcsTable(props: { 
    data: string[], 
    updateVcs: () => Promise<void>, 
    vcsToPresent: string[],
    setVcsToPresent: React.Dispatch<React.SetStateAction<string[]>>,
    caption: string 
}) {
    
    const check = (active: boolean, vc: string) => {
        if (active) {
            props.setVcsToPresent([...props.vcsToPresent, vc]);
        } else {
            props.setVcsToPresent(props.vcsToPresent.filter(x => x !== vc));
        }
    }

    return (
        <TableContainer>
            <Table variant='simple' colorScheme='teal'>
                <TableCaption>{props.caption}</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Alias</Th>
                        <Th>Actions</Th>
                        <Th>Present</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props.data.map(vcId => {
                        return (
                            <Tr key={vcId}>
                                <Td>{vcId}</Td>
                                <Td>
                                    <ViewVcModal vcToView={vcId}/>
                                    <DeleteVcModal vcToDelete={vcId} updateVcs={props.updateVcs}/>
                                </Td>
                                <Td><Checkbox onChange={e => check(e.target.checked, vcId)} size='lg'/></Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    )
}