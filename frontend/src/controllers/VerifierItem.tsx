import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";
import { VerifierItemView } from "../views";


const VerifierItemController = ({
    verifier
} : {
    verifier: IVerifier
}) => {

    /***************************
     *      Contract Data
     **************************/

    const [vr_address, vr_abi] = useVerificationRegistryData();
    const contract = {
        addressOrName: vr_address,
        contractInterface: vr_abi,
    }

    // REMOVE

    const { config: removeConfig, error: prepareRemoveError, isError: isPrepareRemoveError } = usePrepareContractWrite({
        ...contract,
        functionName: 'removeVerifier',
        args: [verifier.signer],
    });

    const { data: removeData, error: removeError, isError: isRemoveError, write: removeWrite } = useContractWrite(removeConfig);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingRemove, isSuccess: isSuccessRemove } = useWaitForTransaction({
        hash: removeData?.hash,
    });

    function handleClickRemove() {
        removeWrite?.();
    }

    return <VerifierItemView 
        verifier={verifier}
        handleClickRemove={handleClickRemove}
        isLoadingRemove={isLoadingRemove}
        isSuccessRemove={isSuccessRemove}
        isPrepareRemoveError={isPrepareRemoveError}
        isRemoveError={isRemoveError}
        prepareRemoveError={prepareRemoveError}
        removeError={removeError}
    />
}

export default VerifierItemController;   