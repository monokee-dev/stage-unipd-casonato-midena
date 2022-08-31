import { useState, useEffect } from 'react';
import { Custodian, utils } from "ssikit-sdk";
import { Navigate, Route, Routes } from 'react-router-dom';
import { Keys, Dids, Credentials} from './subpages';
import SideNav from '../SideNav';

export default function Holder() {

    const [keys, setKeys] = useState<utils.Key[]>([]);
    const [dids, setDids] = useState<string[]>([]);
    const [vcs, setVcs] = useState<string[]>([]);
    const [vcsToPresent, setVcsToPresent] = useState<string[]>([]);
    
    const updateKeys = async () => {
        let keys = await Custodian.getKeys();
        setKeys(keys.reverse());
    }

    const updateDids = async () => {
        let dids = await Custodian.getDIDs();
        setDids(dids.reverse());
    }

    const updateVcs = async () => {
        let vcs = await Custodian.getCredentialIDs();
        setVcs(vcs.reverse());
    }

    useEffect(() => {
        updateKeys();
        updateDids();
        updateVcs();
    }, []);

    const links: {[key: string]: string;} = {
        "keys": "Keys",
        "dids": "DIDs",
        "credentials": "Credentials"
    }

    return (
        <Routes>
            <Route path="/" element={<SideNav links={links}/>}>
                <Route path="*" element={<Navigate to="keys" replace={true} />}/>
                <Route path="" element={<Navigate to="keys" replace={true} />} />
                <Route path="keys" element={<Keys updateKeys={updateKeys} keys={keys} />}/>
                <Route path="dids" element={<Dids updateDids={updateDids} keys={keys} dids={dids} />} />
                <Route path="credentials" element={
                    <Credentials 
                        updateVcs={updateVcs}
                        dids={dids}
                        vcs={vcs}
                        vcsToPresent={vcsToPresent}
                        setVcsToPresent={setVcsToPresent}
                    />
                } />
            </Route>
        </Routes>
    );
}
