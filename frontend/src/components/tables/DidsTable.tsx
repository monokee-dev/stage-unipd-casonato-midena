import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react';
import { DeleteDidModal, ViewDidModal } from '../modals/DIDs';

export default function DidsTable(props: { data: string[], updateDids: () => Promise<void>, caption: string }) {

    const truncateDid = (did: string) => {
        return did.substring(0, 20) + '...' + did.substring(did.length - 10);
    }

    return <TableContainer>
        <Table variant='simple' colorScheme='teal'>
            <TableCaption>{props.caption}</TableCaption>
            <Thead>
                <Tr>
                    <Th>Id</Th>
                    <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {props.data.map(did => {
                    return (
                        <Tr key={did}>
                            <Td>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button onClick={() => navigator.clipboard.writeText(did)}
                                            className="monospace"
                                        >
                                            {truncateDid(did)}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>DID copied to clipboard!</PopoverHeader>
                                    </PopoverContent>
                                </Popover>
                            </Td>
                            <Td>
                                <ViewDidModal didToView={did}/>
                                <DeleteDidModal didToDelete={did} updateDids={props.updateDids}/>
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    </TableContainer>
}