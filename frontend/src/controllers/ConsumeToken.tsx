import { Button, Heading, useDisclosure } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { isNumberObject } from "util/types";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { AddTrustedContractModalController } from ".";
import useDiplomaERC721Data from "../hooks/useDiplomaERC721Data";
import useDiplomaIssuerManagerData from "../hooks/useDiplomaIssuerManagerData";
import { AcceptNewDiplomaRequestView, ConsumeTokenView } from "../views";

const ConsumeTokenController = () => {

    const [tokenId, setTokenId] = useState("-1");
    const [prepareErrorShort, setPrepareErrorShort] = useState("");
    const [prepareErrorERC721Short, setPrepareErrorERC721Short] = useState(""); 

    /***************************
     *      Contract Data
     **************************/

    const [contract_address, contract_abi, contract] = useDiplomaIssuerManagerData();

    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        ...contract,
        functionName: 'consumeDiplomaAccessToken',
        enabled: (tokenId!="-1" && (+tokenId)>=0),
        args: [+tokenId],
        onError(error) {
            setPrepareErrorShort(error.message.split('(reason="execution reverted: ')[1].split('", method')[0])
        }
    });

    const { data, isLoading: isLoadingWrite, error: writeError, isError: isWriteError, write } = useContractWrite(config);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingTx, isSuccess: isSuccessTx } = useWaitForTransaction({
        hash: data?.hash,
    });

    const handleClick = () => {
        write?.();
    }

    return <ConsumeTokenView
        isLoadingWrite={isLoadingWrite}
        isLoadingTx={isLoadingTx}
        isSuccessTx={isSuccessTx}
        isPrepareError={isPrepareError}
        isError={isWriteError}
        prepareError={prepareError}
        error={writeError}
        handleClick={handleClick}
        txHash={data?.hash}
        setTokenId={setTokenId}
        prepareErrorShort={prepareErrorShort}
    />;

}

export default ConsumeTokenController;