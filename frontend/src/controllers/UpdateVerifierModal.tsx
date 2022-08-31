import { ethers } from "ethers";
import { Result } from "ethers/lib/utils";
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";
import { UpdateVerifierModalView } from "../views";

export function UpdateVerifierModal({
    isOpen,
    onOpen,
    onClose,
    verifier: oldVerifier,
} : {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    verifier: IVerifier
}) {

    const [verifierName, setVerifierName] = useState(oldVerifier.name);
    const [verifierDid, setVerifierDid] = useState(oldVerifier.did);
    const [verifierUrl, setVerifierUrl] = useState(oldVerifier.url);
    const [verifierAddress, setVerifierAddress] = useState(oldVerifier.signer);

    const newVerifierInfo = {
        name: verifierName,
        did: verifierDid,
        url: verifierUrl,
        signer: verifierAddress,
    }

    //console.log(newVerifierInfo);

    /***************************
     *      Contract Data
     **************************/

     const [vr_address, vr_abi] = useVerificationRegistryData();
     const contract = {
         addressOrName: vr_address,
         contractInterface: vr_abi,
     }

    const { config: updateConfig, error: prepareUpdateError, isError: isPrepareUpdateError } = usePrepareContractWrite({
        ...contract,
        functionName: 'updateVerifier',
        args: [verifierAddress, newVerifierInfo],
    });

    const { data: updateData, isLoading: isLoadingWrite, error: updateError, isError: isUpdateError, write: updateWrite } = useContractWrite(updateConfig);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } = useWaitForTransaction({
        hash: updateData?.hash,
    });

    function handleClickUpdate() {
        updateWrite?.();
    }

    return <UpdateVerifierModalView 
        isOpen={isOpen} 
        onOpen={onOpen} 
        onClose={onClose} 
        oldData={oldVerifier}
        isLoadingWrite={isLoadingWrite}
        isLoadingTx={isLoadingUpdate}
        isSuccessTx={isSuccessUpdate} 
        isPrepareError={isPrepareUpdateError} 
        isError={isUpdateError} 
        prepareError={prepareUpdateError} 
        error={updateError} 
        handleClick={handleClickUpdate}
        setVerifierName={setVerifierName}
        setVerifierDid={setVerifierDid}
        setVerifierUrl={setVerifierUrl}
        setVerifierAddress={setVerifierAddress}
    />
}

export default UpdateVerifierModal;