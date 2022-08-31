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
    Text,
} from '@chakra-ui/react';
import { utils } from 'ssikit-sdk';
import { DeletePolicyModal } from '../modals/Policies';

export default function PoliciesTable(props: { 
    data: utils.VerificationPolicy[], 
    updatePolicies: () => Promise<void>,
    policiesToUse: string[],
    setPoliciesToUse: React.Dispatch<React.SetStateAction<string[]>>,
    caption: string 
}){

    const check = (active: boolean, policy: string) => {
        if (active) {
            props.setPoliciesToUse([...props.policiesToUse, policy]);
        } else {
            props.setPoliciesToUse(props.policiesToUse.filter(x => x !== policy));
        }
    }

    return <TableContainer>
        <Table variant='simple' colorScheme='teal' className='scrollable-table'>
            <TableCaption>{props.caption}</TableCaption>
            <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Description</Th>
                    <Th>Actions</Th>
                    <Th>Policies to use</Th>
                </Tr>
            </Thead>
            <Tbody>
                {props.data.map(policy => {
                    return (
                        <Tr key={policy.id}>
                            <Td w='50%'>{policy.id}</Td>
                            <Td>{policy.description}</Td>
                            <Td>
                                {policy.isMutable ? 
                                    <DeletePolicyModal policyToDelete={policy.id} updatePolicies={props.updatePolicies}/>
                                    :
                                    <Text>-</Text>
                                }
                            </Td>
                            <Td>
                                <Checkbox onChange={e => check(e.target.checked, policy.id)} size='lg'/>
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    </TableContainer>
}