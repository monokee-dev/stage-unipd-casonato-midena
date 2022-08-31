import { ethers } from "ethers";
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useTrustedSCRegistryData from "../hooks/useTrustedSCRegistryData";
import { AddTrustedContractModalView } from "../views";


export function AddTrustedContractModalController({
    isOpen,
    onOpen,
    onClose
} : {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}) {

    const [contractAddress, setContractAddress] = useState("");
    const [contractName, setContractName] = useState("");
    const [contractTrust, setContractTrust] = useState(false);

    /***************************
     *      Contract Data
     **************************/

    const [tcr_address, tcr_abi, contract] = useTrustedSCRegistryData();

    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        ...contract,
        functionName: 'register',
        enabled: (ethers.utils.isAddress(contractAddress)),
        args: [contractAddress, contractName, contractTrust],
    });

    

    const { data, isLoading: isLoadingWrite, error: writeError, isError: isWriteError, write } = useContractWrite(config);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingTx, isSuccess: isSuccessTx } = useWaitForTransaction({
        hash: data?.hash,
    });

    function handleClick() {
        write?.();
    }

    return <AddTrustedContractModalView 
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        isLoadingWrite={isLoadingWrite}
        isLoadingTx={isLoadingTx}
        isSuccessTx={isSuccessTx}
        isPrepareError={isPrepareError}
        isError={isWriteError}
        prepareError={prepareError}
        error={writeError}
        handleClick={handleClick}
        setContractAddress={setContractAddress}
        setContractName={setContractName}
        setContractTrust={setContractTrust}
    />
}

export default AddTrustedContractModalController;
