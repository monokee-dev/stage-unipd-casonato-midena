import { useState } from "react";
import { useContractRead } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";
import WidgetCountView from "../views/WidgetCountView";

const VerifierCountController = () => {
    
    const [count, setCount] = useState(Number);

    const [ vr_address, vr_abi] = useVerificationRegistryData();

    const { data, isError, isLoading } = useContractRead({
        addressOrName: vr_address,
        contractInterface: vr_abi,
        functionName: 'getVerifierCount',
    })

    //if(data) console.log(data);

    return <WidgetCountView count={data?data.toString():"-"} description={"# Verifiers"} icon={undefined} />;
};

export default VerifierCountController;