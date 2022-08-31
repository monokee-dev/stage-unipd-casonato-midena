import { Result } from "ethers/lib/utils";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useTrustedSCRegistryData from "../hooks/useTrustedSCRegistryData";
import { TrustedContractItemView } from "../views";


const TrustedContractItemController = ({
    contractInfo
} : {
    contractInfo: ITrustedSmartContract
}) => {

    /***************************
     *      Contract Data
     **************************/

    const [vr_address, vr_abi, contract] = useTrustedSCRegistryData();

    // editTrust 

    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        ...contract,
        functionName: 'editTrust',
        args: [contractInfo.address, !contractInfo.trusted],
    });

    const { data, error: error, isLoading: isLoadingWrite, isError: isError, write: write } = useContractWrite(config);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingTx, isSuccess: isSuccessTx } = useWaitForTransaction({
        hash: data?.hash,
    });

    function handleClick() {
        write?.();
    }

    return <TrustedContractItemView 
        contractInfo={contractInfo}
        handleClick={handleClick}
        isLoadingWrite={isLoadingWrite}
        isLoadingTx={isLoadingTx}
        isSuccessTx={isSuccessTx}
        isPrepareError={isPrepareError}
        isError={isError}
        prepareError={prepareError}
        error={error}
    />
}

export default TrustedContractItemController;   