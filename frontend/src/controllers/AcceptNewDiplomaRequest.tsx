import { useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useDiplomaIssuerManagerData from "../hooks/useDiplomaIssuerManagerData";
import { AcceptNewDiplomaRequestView } from "../views";
import { pinJSONToIPFS } from "../utils/pinata";

const defaultMetadata = `{
    "name" : "",
    "description" : "",
    "image" : "https://gateway.pinata.cloud/ipfs/QmNkus5BdawNLFvHrE5wc4dW5wpvDjCxESj3oVKWBdwqbZ",
    "details" : ""
}`;

const AcceptNewDiplomaRequestController = () => {
    
    const [startRequest, setStartRequest] = useState(false);
    const [prepareErrorShort, setPrepareErrorShort] = useState("");
    const [metadata, setMetadata] = useState(defaultMetadata);
    const [tokenURIipfs, setTokenURIipfs] = useState("");
    const [uploadedIPFS, setUploadedIPFS] = useState(false);


    // bypass pinata upload for now
    const tokenURI = "ipfs://QmW7aofc5AHLHQQ4V3kwojYPW316j7ybgGgx3Var2DJTvo";

    // pinata pin request
    if(startRequest){
        console.log(metadata, JSON.parse(metadata));
        pinJSONToIPFS(JSON.parse(metadata))
            .then(response => {
                console.log(response);
                setTokenURIipfs(response.pinataUrl);
                setUploadedIPFS(true);
            })
        setStartRequest(false);
    }

    /***************************
     *      Contract Data
     **************************/

    const [contract_address, contract_abi, contract] = useDiplomaIssuerManagerData();

    const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
        ...contract,
        functionName: 'acceptNewDiplomaRequest',
        args: [tokenURIipfs],
        enabled: uploadedIPFS,
        onError(error) {
            setPrepareErrorShort(error.message.split('(reason="execution reverted: ')[1].split('", method')[0]);
            //throw (error)
        },
    });
    
    const { data, isLoading: isLoadingWrite, error: writeError, isError: isWriteError, write } = useContractWrite(config);
    
    /*
    console.log(
        "CAUSE:", prepareError?.cause, 
        "NAME: ", prepareError?.name, 
        "STACK: ", prepareError?.stack,
        "MESSAGE: ", prepareError?.message,
    );
    console.log(
        "WRITE ERROR:", writeError, 
        "isWriteError: ", isWriteError,
    );
    */

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingTx, isSuccess: isSuccessTx } = useWaitForTransaction({
        hash: data?.hash,
    });

    function handleClick() {
        write?.();
    }

    return <AcceptNewDiplomaRequestView
        isLoadingWrite={isLoadingWrite}
        isLoadingTx={isLoadingTx}
        isSuccessTx={isSuccessTx}
        isPrepareError={isPrepareError}
        isError={isWriteError}
        prepareError={prepareError}
        prepareErrorShort={prepareErrorShort}
        error={writeError}
        handleClick={handleClick}
        txHash={data?.hash}
        setStartRequest={setStartRequest}
        defaultMetadata={defaultMetadata}
        setMetadata={setMetadata}
        uploadedIPFS={uploadedIPFS}
    />;
}

export default AcceptNewDiplomaRequestController;