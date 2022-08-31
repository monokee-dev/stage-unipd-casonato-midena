import { ContractInterface } from "ethers";
import VR from '../abis/DiplomaIssuerManager.json';

const useDiplomaIssuerManagerData = (): [
    string,
    ContractInterface,
    {
        addressOrName: string;
        contractInterface: ContractInterface;
    },
] => {

    //const contract_address = "0x7e3E8dFfb775D533d401Aa30621F783cEA83A747";
    // const contract_address = "0x901A95d186C03dC874FdF1823C676D11f5EEfb95";
    const contract_address = "0xb6c340818bB78C9b7Bb3Ee704473395C1BdF19b7";

    const abi = VR as unknown as ContractInterface;

    const contract = {
        addressOrName: contract_address,
        contractInterface: abi,
    }

    return [contract_address, abi, contract];

}

export default useDiplomaIssuerManagerData;