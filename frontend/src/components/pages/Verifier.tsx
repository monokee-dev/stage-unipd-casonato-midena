import { Navigate, Route, Routes } from 'react-router-dom';
import SideNav from '../SideNav';
import { Verifications, Verifiers } from './subpages';

export default function Verifier() {

    const links: {[key: string]: string;} = {
        "verifications": "Verfications",
        "verifiers": "Verifiers"
    }

    return (
        <Routes>
            <Route path="/" element={<SideNav links={links}/>}>
                <Route path="*" element={<Navigate to="verifications" replace={true} />}/>
                <Route path="" element={<Navigate to="verifications" replace={true} />} />
                <Route path="verifications" element={<Verifications />} />
                <Route path="verifiers" element={<Verifiers />}/>
            </Route>
        </Routes>
    );
}
