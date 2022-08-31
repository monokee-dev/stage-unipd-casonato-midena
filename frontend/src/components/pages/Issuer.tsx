import { Navigate, Route, Routes } from 'react-router-dom';
import SideNav from '../SideNav';
import IssueCredential from './subpages/IssueCredential';
import Revocations from './subpages/Revocations';

export default function Issuer() {

    const links: {[key: string]: string;} = {
        "issue-credential": "Issue",
        "revocations": "Revocations"
    }

    return (
        <Routes>
            <Route path="/" element={<SideNav links={links}/>}>
                <Route path="*" element={<Navigate to="issue-credential" replace={true} />}/>
                <Route path="" element={<Navigate to="issue-credential" replace={true} />} />
                <Route path="issue-credential" element={<IssueCredential />}/>
                <Route path="revocations" element={<Revocations />} />
            </Route>
        </Routes>
    );
}
