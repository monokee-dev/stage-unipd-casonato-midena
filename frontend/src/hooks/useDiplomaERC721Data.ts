import { ContractInterface } from "ethers";
import VR from '../abis/DiplomaERC721.json';

const useDiplomaERC721Data = (): [
    string,
    ContractInterface,
    {
        addressOrName: string;
        contractInterface: ContractInterface;
    },
] => {

    //const contract_address = "0x7e798Dcb871C34AD6356C78b3A130264296d67b6";
    const contract_address = "0xe72230aF40cf56580Ae0845bEAf30B5b4AF7fD51";

    const abi = VR as unknown as ContractInterface;

    const contract = {
        addressOrName: contract_address,
        contractInterface: abi,
    }

    return [contract_address, abi, contract];

}

export default useDiplomaERC721Data;