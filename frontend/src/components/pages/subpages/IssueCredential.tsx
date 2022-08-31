import { 
    Select, Textarea, Heading, Input, Button, Box, HStack, FormControl, FormLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Custodian, Signatory, utils } from "ssikit-sdk";

export default function IssueCredential() {

    let [privateRevocationToken, setPrivateRevocationToken] = useState<string>("");
    let [publicRevocationToken, setPublicRevocationToken] = useState<string>("");

    let emptyProofConfig = { 
        verifierDid: "",
        issuerVerificationMethod: "",
        domain: "",
        nonce: "",
        proofPurpose: "",
        credentialId: "",
        issueDate: "",
        validDate: "",
        expirationDate: "",
        dataProviderIdentifier: ""
    };

    let proofConfigDefault = JSON.stringify(emptyProofConfig, null, 2);
    let credentialDataDefault = JSON.stringify({
        credentialStatus: {
            id: `http://localhost:${utils.apiPortSignatory}/v1/revocations/${publicRevocationToken}`, 
            type: "SimpleCredentialStatus2022"
        }
    }, null, 2)

    let [templates, setTemplates] = useState<string[]>([]);
    let [templateGet, setTemplateGet] = useState<string>("");
    let [templateForm, setTemplateForm] = useState<string>("");
    let [userDIDs, setUserDIDs] = useState<string[]>([]);
    let [issuerDID, setIssuerDID] = useState<string>("");
    let [subjectDID, setSubjectDID] = useState<string>("");
    let [proofType, setProofType] = useState<utils.ProofType>("LD_PROOF");
    let [proofConfig, setProofConfig] = useState<string>(proofConfigDefault);
    let [credentialData, setCredentialData] = useState<string>(credentialDataDefault);
    let [issuedCredential, setIssuedCredential] = useState<string>("");

    const mySetVCTemplate = async (templateId: string) => {
        let template = await Signatory.getVCTemplate(templateId);
        setTemplateGet(JSON.stringify(template, null, 4));
    }

    const fetchData = async () => {
        let vcTemplates = await Signatory.getVCTemplateIDs();
        setTemplates(vcTemplates);
        setTemplateForm(vcTemplates[0]);
        await mySetVCTemplate(vcTemplates[0]);
        await initUserDIDs();
    }

    const truncateDid = (did: string) => {
        return did.substring(0, 15) + '...' + did.substring(did.length - 10);
    }

    const initUserDIDs = async () => {
        let userDIDs = await Custodian.getDIDs();
        setUserDIDs(userDIDs);
        setIssuerDID(userDIDs[0]);
    }

    const handleInputChangeGetTemplate = async (e: any) => {
        let index = e.target.selectedIndex;
        let templateId = templates[index];
        setTemplateForm(templateId);
        await mySetVCTemplate(templateId);
    }

    const createRevocationTokens = () => {
        let privateToken = utils.createBaseToken();
        setPrivateRevocationToken(privateToken);
        let publicToken = utils.deriveRevocationToken(privateToken);
        setPublicRevocationToken(publicToken);
    }

    const issueCredential = async () => {
        let pcObject = JSON.parse(proofConfig);
        pcObject.issuerDid = issuerDID;
        pcObject.subjectDid = subjectDID;
        pcObject.proofType = proofType;
        let credentialDataField = JSON.parse(credentialData)
        let request = {
            templateId: templateForm,
            config: pcObject as utils.ProofConfig,
            credentialData: credentialDataField,
        } as utils.IssueCredentialRequest;
        let issuedCredential = await Signatory.issueCredential(request);
        setIssuedCredential(JSON.stringify(issuedCredential, null, 4));
    }

    useEffect(() => {
        fetchData();
    } ,[])

    useEffect(() => {
        setCredentialData(credentialDataDefault)
    } ,[publicRevocationToken])

    return (
        <Box id='main-container' className="with-navbar">
            <Heading as='h2' mb="0.5em">
                Issue a credential
            </Heading>
            <HStack w="100%">
                <Box id='IssueCredentialForm' w='100%' mr='1em'>
                    <FormControl isRequired>
                        <FormLabel mt='1em'>Select Template ID:</FormLabel>
                        <Select 
                            w='50%'
                            onChange={handleInputChangeGetTemplate}
                            variant="filled"
                        >
                            {templates.map((template, index) => (
                                <option key={index} value={template}>{template}</option>
                            ))}
                        </Select>
                        <FormLabel mt='1em'>Your DID:</FormLabel>
                        <Select
                            value={issuerDID}
                            onChange={(e) => setIssuerDID(e.target.value)}
                            width='50%'
                            variant="filled"
                        >
                            {userDIDs.map((did, index) => (
                                <option key={index} value={did}>{truncateDid(did)}</option>
                            ))}
                        </Select>
                        <FormLabel mt='1em'>Subject DID:</FormLabel>
                        <Input 
                            value={subjectDID}
                            onChange={(e) => setSubjectDID(e.target.value)}
                            placeholder='did:example:123456789' 
                            width='50%'
                            variant="filled"
                        />
                        <FormLabel mt='1em'>Select a Proof Type:</FormLabel>
                        <Select
                            value={proofType}
                            onChange={(e) => setProofType(e.target.value as utils.ProofType)}
                            w='50%'
                            variant="filled"
                        >
                            <option value='LD_PROOF'>LD_PROOF</option>
                            <option value='JWT'>JWT</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel mt='1em'>Proof Config parameters:</FormLabel>
                        <Textarea
                            value={proofConfig}
                            onChange={(e) => setProofConfig(e.target.value)}
                            h='21em'
                            variant="filled"
                        />
                        <FormLabel mt='1em'>Other credential data:</FormLabel>
                        <Button onClick={() => createRevocationTokens()}>
                            Create revocation tokens
                        </Button>
                        <Input 
                            isReadOnly 
                            value={privateRevocationToken}
                            placeholder='Your private revocation token (save it)'
                            isDisabled={privateRevocationToken?false:true}
                            mt='0.5em'
                            variant="filled"
                        />
                        <Textarea
                            value={credentialData}
                            onChange={(e) => setCredentialData(e.target.value)}
                            mt='0.5em' h='20em'
                            variant="filled"
                        />
                    </FormControl>
                </Box>
                <Box id='template-and-issued' w='100%' ml='1em'>
                    <Box>
                        <Heading as='h3' mb='0.5em'>
                            Selected template
                        </Heading>
                        <Textarea defaultValue={templateGet}
                            mt='0.5em' h='30em'
                            variant="filled"
                            readOnly
                        />
                    </Box>
                    <Box>
                        <Heading as='h3' mb='0.5em' mt='1em'>
                            Issued credential:
                        </Heading>
                        <Textarea defaultValue={issuedCredential} 
                            variant="filled" 
                            h='30em'
                            readOnly
                        />
                    </Box>
                </Box>
            </HStack>
            <Box w="100%">
                <Button onClick={issueCredential}
                    colorScheme='blue' mt='1em' w='8em' size='lg'
                >
                    Issue
                </Button>
            </Box>
        </Box>
    );
}
