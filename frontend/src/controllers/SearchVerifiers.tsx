import axios, { AxiosError } from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";
import { SearchVerifierView, ShowVerifiersView } from "../views";


const SearchVerifierFromAddressController = () => {

    const [verifierAddress, setVerifierAddress] = useState("");
    
    /* OLD ON-CHAIN Query
    const [vr_address, vr_abi] = useVerificationRegistryData();

    const { data: verifierInfo, isError, isLoading } = useContractRead({
        addressOrName: vr_address,
        contractInterface: vr_abi,
        functionName: 'getVerifier',
        args: [verifierAddress],
        enabled: (ethers.utils.isAddress(verifierAddress)),
        onError(error) {
            console.log(error);
        }
    })
    */

    const { address, isConnecting, isDisconnected } = useAccount();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AxiosError>();
    const [verifiers, setVerifiers] = useState<IVerifier[]>([]);
    const [filterDid, setFilterDid] = useState("");


    
    useEffect(() => {
        axios.post(
            'https://api.thegraph.com/subgraphs/name/mmatteo23/monokee_thegraph',
            {
                query: `
                {
                    verifiers(orderBy: name, where: {did_contains: "${filterDid}", address_contains: "${verifierAddress.toLowerCase()}"}) {
                        did
                        address
                        name
                        id
                        signer
                        url
                    }
                }
                `
            }
        )
        .then((result) => {
            //console.log(result);
            setVerifiers(result.data.data?.verifiers);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setError(error);
        });
    }, [verifierAddress, filterDid]);

    return <ShowVerifiersView
        verifiers={verifiers} 
        setVerifierAddress={setVerifierAddress}
        setFilterDid={setFilterDid}
        loading={loading}
    />
};

export default SearchVerifierFromAddressController;