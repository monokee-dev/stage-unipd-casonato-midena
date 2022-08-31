import { ContractInterface } from "ethers";
import VR from '../abis/TrustedSmartContractRegistry.json';

const useTrustedSCRegistryData = (): [
    string,
    ContractInterface,
    {
        addressOrName: string;
        contractInterface: ContractInterface;
    },
] => {

    const trustedSmartContractsRegistryAddress = "0xdA99451f8cf10F842C9C6B758712F856480aDAA3";
    const abi = VR as unknown as ContractInterface;

    const contract = {
        addressOrName: trustedSmartContractsRegistryAddress,
        contractInterface: abi,
    }

    return [trustedSmartContractsRegistryAddress, abi, contract];

}

export default useTrustedSCRegistryData;