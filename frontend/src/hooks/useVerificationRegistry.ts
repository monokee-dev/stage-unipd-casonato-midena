
import { Contract, ContractInterface } from 'ethers';
import { useCallback } from 'react';
import { useAccount, useContract } from 'wagmi'
import VR from '../abis/VerificationRegistry.json';

const verificationRegistryAddress = "0xE9a5A31088DFe5d64C1783aCD154D1484A99ff56";

const useVerificationRegistry = (): [
    Contract | null,
    {
        addVerifier: (address: string, verifierInfo: IVerifier) => Promise<void>,
        getVerifierCount: () => Promise<number>
    }
] => {

    const contract = useContract({
        addressOrName: verificationRegistryAddress,
        contractInterface: VR as unknown as ContractInterface,
    })
    

    const {address, isConnecting, isDisconnected} = useAccount();
    
    const addVerifier = useCallback(async (verifierAddress: string, verifierInfo: IVerifier) => {
        if (!contract)
            throw new Error("Contract Not Initiated");
        try {
            await contract.connect(address).addVerifier(verifierAddress, verifierInfo);
        } catch (err) {
            throw err;
        }
    }, [contract]);

    const getVerifierCount = useCallback(async (): Promise<number> => {
        if (!contract)
            throw new Error("Contract Not Initiated");
        return await contract.getVerifierCount();
    }, [contract]);


    return [contract, { addVerifier, getVerifierCount }];
}
  
export default useVerificationRegistry;
  
