import * as jose from 'jose'
import { Custodian } from 'ssikit-sdk';
import express, { Express, Request, Response } from 'express';
// import "./apis/theGraph";

interface signatureRequest {
    keyId: string;
    message: string;
}

interface verificationRequest {
  verifierDid: string;
  message: jose.GeneralJWSInput;
}

const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/createSignature", async (req: Request, res: Response) => {
    const request: signatureRequest = req.body.data as unknown as signatureRequest;
    const pvtJWK: jose.JWK = await Custodian.exportKey(request.keyId, "JWK", true);
    const privateKey = await jose.importJWK(pvtJWK);
    const jws = await new jose.GeneralSign(
        new TextEncoder().encode(request.message),
    )
        .addSignature(privateKey)
        .setProtectedHeader({ alg: pvtJWK.alg })
        .sign()
    res.send(jws)
})

app.post("/verifySignature", async (req: Request, res: Response) => {
    const request: verificationRequest = req.body.data as unknown as verificationRequest;
    const verifierDid = await Custodian.getDID(request.verifierDid);
    console.log(verifierDid)
    const pubJWK = verifierDid.verificationMethod[0].publicKeyJwk;
    const publicKey = await jose.importJWK(pubJWK);
    const { payload } = await jose.generalVerify(request.message, publicKey)
    let result = new TextDecoder().decode(payload)
    res.send(result)
})
  
const PORT = process.env.PORT || 8080;
  
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});