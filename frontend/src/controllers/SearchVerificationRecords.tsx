import { ethers } from "ethers";
import { Result } from "ethers/lib/utils";
import { useState } from "react";
import { useContractRead } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";
import {SearchVerificationRecordsView} from "../views";


const filterDeletedData = (data: Result) => {
    return data.filter((item) => item.uuid != "0x0000000000000000000000000000000000000000000000000000000000000000");
}

const SearchVerificationRecordsController = () => {

    /**
     * State
     */

    const [verifierAddress, setVerifierAddress] = useState("");
    const [uuid, setUuid] = useState("");
    const [subjectAddress, setSubjectAddress] = useState("");

    /**
     * Contract Data
     */


    const [vr_address, vr_abi] = useVerificationRegistryData();
    const contract = {
        addressOrName: vr_address,
        contractInterface: vr_abi,
    }

    /**
     * Contract Reads
     */

    // Take care! This read function returns a Result and not a Result[]
    const { data: verificationRecords1 } = useContractRead({
        ...contract,
        functionName: 'getVerification',
        enabled: (uuid?.length == 66),
        args: [uuid, "diploma"],
        select: (data) => {
            return filterDeletedData(data);
        },
    });

    const { data: verificationRecords2 } = useContractRead({
        ...contract,
        functionName: 'getVerificationsForSubject',
        enabled: (ethers.utils.isAddress(subjectAddress)),
        args: [subjectAddress, "diploma"],
        select: (data) => {
            return filterDeletedData(data);
        },
    });

    const { data: verificationRecords3 } = useContractRead({
        ...contract,
        functionName: 'getVerificationsForVerifier',
        enabled: (ethers.utils.isAddress(verifierAddress)),
        select: (data) => {
            return filterDeletedData(data);
        },
        args: [verifierAddress, "diploma"],
    });

    let verificationRecords;
    if (uuid) {
        // this is a Result so we have to wrap it in an array.
        verificationRecords = [verificationRecords1];
    }
    if (subjectAddress) {
        verificationRecords = verificationRecords2;
    }
    if (verifierAddress) {
        verificationRecords = verificationRecords3;
    }

    return <SearchVerificationRecordsView 
        verificationRecords={verificationRecords} 
        setUuid={setUuid} 
        setSubjectAddress={setSubjectAddress} 
        setVerifierAddress={setVerifierAddress} 
    />;
}


export default SearchVerificationRecordsController;