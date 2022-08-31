import { ApolloError } from "@apollo/client";
import { Box, Center, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import Moment from 'react-moment';
import axios, { AxiosError } from "axios";
import { lazy } from "react";
import { ShowPersonalNFTItemView } from "../views";
import { ShowPersonalNFTItemController } from "../controllers";

Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';


/* Old metadata extraction
function extractNFTsMetadata(tokens: IERC721Token[]) {
    if (tokens === undefined)
        return [];

    var results: IERC721Metadata[] = [];
    tokens.map(async (token, key) => {
        const res = await fetch(token.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"));
        const json = await res.json();

        console.log("JSON #", key, json);
        results[key] = (JSON.parse(JSON.stringify(json))) as IERC721Metadata;
    });

    return results;
}
*/

const ShowPersonalNFTsView = ({
    tokens,
    loading,
    error
}: {
    tokens: IERC721Token[],
    loading: boolean,
    error: AxiosError | undefined
}) => {

    return <>
        <Heading>Your minted NFTs</Heading>

        <Text>
            To see your NFT on your Metamask wallet (only mobile app version) you have to insert
            the contract address and the token id.
        </Text>

        {
            loading &&
            <Center>
                <Spinner
                    thickness='5px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Center>
        }
        {error && <div>Error: {error.message}</div>}

        <ul className="nft-list">
            {
                tokens?.length ? (
                    tokens.map((token, key) => {
                        return <ShowPersonalNFTItemController token={token} key={key} />
                    })
                ) : <p>Seems you don't have any tokens</p>
            }
        </ul>
    </>;
};

export default ShowPersonalNFTsView;