import axios, { AxiosError } from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import useTrustedSCRegistryData from "../hooks/useTrustedSCRegistryData";
import { SearchTrustedContractView } from "../views";


const SearchTrustedContractFromAddressController = () => {

    const [contractAddress, setContractAddress] = useState("");
    const [contractName, setContractName] = useState("");
    const [loading, setLoading] = useState(true);
    const [trustedContracts, setTrustedContracts] = useState<ITrustedSmartContract[]>([]);
    const [error, setError] = useState<AxiosError>();

    /*
    const [tsc_address, tsc_abi, contract] = useTrustedSCRegistryData();

    const { data: contractInfo, isError, isLoading } = useContractRead({
        ...contract,
        functionName: 'getContract',
        enabled: (ethers.utils.isAddress(contractAddress)),
        args: [contractAddress == "" ? undefined : contractAddress]
    })
    */

    useEffect(() => {
        axios.post(
            'https://api.thegraph.com/subgraphs/name/mmatteo23/monokee_thegraph',
            {
                query: `
                {
                    trustedSmartContracts(
                        orderBy: lastChangeTime
                        where: {address_contains: "${contractAddress.toLowerCase()}", name_contains: "${contractName}"}
                      ) {
                        address
                        id
                        lastChangeTime
                        name
                        owner
                        trusted
                      }
                }
                `
            }
        )
        .then((result) => {
            //console.log(result);
            setTrustedContracts(result.data.data.trustedSmartContracts);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setError(error);
        });
    }, [contractAddress, contractName]);



    return <SearchTrustedContractView 
        contractsInfo={trustedContracts} 
        setContractAddress={setContractAddress}
        setContractName={setContractName}
        loading={loading}
        error={error}
    />
};

export default SearchTrustedContractFromAddressController;