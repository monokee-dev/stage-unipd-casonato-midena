
declare interface IVerifier {
    name: string,
    did: string,
    url: string,
    signer: string | undefined,
}

declare interface IVerificationResult {
    subject: string,
    expiration: number,
    jsonResult: string,
    useCase: string,
    signature?: string,
}

declare interface IVerificationRecord {
    uuid: string,
    verifier: string,
    subject: string,
    entryTime: number,
    expirationTime: number,
    revoked: boolean,
    signature: string,
    jsonResult: string,
    indexType: string
}

declare interface ITokenContract {
    id: string,
    name: string,
    symbol: string,
    supportsEIP721Metadata: boolean,
    numTokens: number,
    numOwners: number
}

declare interface IOwner {
    id: string,
    tokens: IERC721Token[],
    numTokens: number
}

declare interface IERC721Token {
    id: string,
    contract: ITokenContract,
    tokenID: number,
    owner: IOwner,
    mintTime: number,
    tokenURI: string
}

declare interface IERC721Metadata {
    name: string,
    description: string,
    image: string,
    details: string
}

declare interface ITrustedSmartContract {
    name: string,
    trusted: boolean,
    lastChangeTime: number,
    address: string,
    owner: string,
}

declare interface signatureRequest {
    keyId: string;
    message: string;
}

declare interface verificationRequest {
    verifierDid: string;
    message: jose.GeneralJWSInput;
}