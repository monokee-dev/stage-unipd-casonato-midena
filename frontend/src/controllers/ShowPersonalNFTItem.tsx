import axios from "axios";
import { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import useDiplomaERC721Data from "../hooks/useDiplomaERC721Data";
import { ShowPersonalNFTItemView } from "../views";


export function ShowPersonalNFTItemController({
    token
} : {
    token: IERC721Token
}){

    const [prepareErrorERC721Short, setPrepareErrorERC721Short] = useState("");
    const [metadata, setMetadata] = useState<IERC721Metadata>();
    const [decodedDetails, setDecodedDetails] = useState(Array<string>());

    /*
        Note: this is a necessary workaround for the fact that
        the metadata uploaded to IPFS are slow to catch up.
    */
    useEffect(() => {
        if(token.tokenURI){
            axios.get(
                token.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            ).then((meta) => {
                const metadata = meta.data;
                setMetadata(metadata);
                try {
                    metadata.details = atob(metadata.details);
                } catch (error) {
                    console.log(`Token #${token.tokenID}'s metadata details aren't BASE64 encoded`);
                }
                setDecodedDetails(metadata.details.split(';'));
            });
        } else {
            setMetadata({
                name: "Generic Token",
                description: "This token has no metadata",
                image: "",
                details: ""
            });
        }
    }, []);

    const [contract_addressERC721, contract_abiERC721, contractERC721] = useDiplomaERC721Data();

    const { config: configERC721, error: prepareERC721Error, isError: isPrepareERC721Error } = usePrepareContractWrite({
        ...contractERC721,
        functionName: 'approve',
        args: [token.contract.id, token.tokenID],
        onError(error) {
            setPrepareErrorERC721Short(error.message.split('(reason="execution reverted: ')[1].split('", method')[0])
        }
    });

    const { data: dataERC721, isLoading: isLoadingERC721Write, error: writeERC721Error, isError: isWriteERC721Error, write: writeERC721 } = useContractWrite(configERC721);

    // using the useWaitForTransaction we can show feedback on the status of the transaction
    const { isLoading: isLoadingERC721Tx, isSuccess: isSuccessERC721Tx } = useWaitForTransaction({
        hash: dataERC721?.hash,
    });

    const handleERC721Click = () => {
        writeERC721?.();
    }

    return <ShowPersonalNFTItemView 
        token={token}
        isLoadingERC721Write={isLoadingERC721Write}
        isLoadingERC721Tx={isLoadingERC721Tx}
        isSuccessERC721Tx={isSuccessERC721Tx}
        isPrepareERC721Error={isPrepareERC721Error}
        isERC721Error={isWriteERC721Error}
        prepareERC721Error={prepareERC721Error}
        errorERC721={writeERC721Error}
        handleERC721Click={handleERC721Click}
        txHashERC721={dataERC721?.hash}
        prepareErrorERC721Short={prepareErrorERC721Short}
        metadata={metadata}
        decodedDetails={decodedDetails}
    />;
}


export default ShowPersonalNFTItemController;