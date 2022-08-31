
import { useContractRead } from "wagmi";
import useVerificationRegistryData from "../hooks/useVerificationRegistryData";
import WidgetCountView from "../views/WidgetCountView";

const VerificationRecordCountController = () => {

    const [ vr_address, vr_abi] = useVerificationRegistryData();

    const { data, isError, isLoading } = useContractRead({
        addressOrName: vr_address,
        contractInterface: vr_abi,
        functionName: 'getVerificationCount',
    })

    return <WidgetCountView count={data?data.toString():"-"} description={"# Verification Records"} icon={undefined} />;
};

export default VerificationRecordCountController;