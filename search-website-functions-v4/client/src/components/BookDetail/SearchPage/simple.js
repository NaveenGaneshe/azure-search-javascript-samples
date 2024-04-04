import React, { useState, useEffect } from 'react'; 
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";
import { DefaultAzureCredential } from "@azure/identity";
// we're using these objects from the storage sdk - there are others for different needs
import { BlobServiceClient, BlobItem } from "@azure/storage-blob";
const StyledCard = styled(Card)`
  width: 10rem;
  padding: 16px;
  text-align: center;
  margin: 10px;
  inline-block;
  max-height: 18rem;
`;

const StyledCardActionArea = styled(CardActionArea)`
  cursor: pointer;
  &:hover: {
    background-color: #c0ddf5;
  }
`;

const StyledCardContentImage = styled(CardContent)`
  padding: 16px;
  text-align: center;
  height: auto;
`;

const StyledImg = styled(CardMedia)`
  height: 180px;
  max-width: 120px;
  margin: 0 auto;
`;

export default function BookCardSimple({ document }) {
    const shortenTitle = (title) => {
        if (title.length > 20) {
            return title.slice(0, 35) + "...";
        }
        return title;
    };

    const decodeBase64 = (input) => {
        var atob = require('atob');
        var output = atob(input);
        return output;
    }

    const [blobContent, setBlobContent] = useState('');

    useEffect(() => {
        const fetchBlobContent = async () => {
            const blobServiceClient = new BlobServiceClient(
                "https://ecftranslatorapp.blob.core.windows.net/",
                new DefaultAzureCredential()
            );
            const containerClient = blobServiceClient.getContainerClient("notes-source-ai-files");
            const blobClient = containerClient.getBlobClient("SKM_C450i24031413410_0008.pdf");

            const downloadBlockBlobResponse = await blobClient.download();
            const downloaded = (
                await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
            ).toString();
            console.log("Downloaded blob content:", downloaded);
            setBlobContent(downloaded);
        };

        const streamToBuffer = async (readableStream) => {
            return new Promise((resolve, reject) => {
                const chunks = [];
                readableStream.on("data", (data) => {
                    chunks.push(data instanceof Buffer ? data : Buffer.from(data));
                });
                readableStream.on("end", () => {
                    resolve(Buffer.concat(chunks));
                });
                readableStream.on("error", reject);
            });
        };

        fetchBlobContent();
    }, []);

    //useEffect(() => {

    //    const blobStorageClient = new BlobServiceClient(
    //        // this is the blob endpoint of your storage acccount. Available from the portal 
    //        // they follow this format: <accountname>.blob.core.windows.net for Azure global
    //        // the endpoints may be slightly different from national clouds like US Gov or Azure China
    //        "https://ecftranslatorapp.blob.core.windows.net/",
    //        new DefaultAzureCredential()
    //    )
    //    var containerClient = blobStorageClient.getContainerClient("notes-source-ai-files");

    //    const blobClient = containerClient.getBlobClient("SKM_C450i24031413410_0008.pdf");

    //    // Get blob content from position 0 to the end
    //    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    //    const downloadBlockBlobResponse = await blobClient.download();
    //    const downloaded = (
    //        await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    //    ).toString();
    //    console.log("Downloaded blob content:", downloaded);

    //    // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
    //    async function streamToBuffer(readableStream) {
    //        return new Promise((resolve, reject) => {
    //            const chunks = [];
    //            readableStream.on("data", (data) => {
    //                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    //            });
    //            readableStream.on("end", () => {
    //                resolve(Buffer.concat(chunks));
    //            });
    //            readableStream.on("error", reject);
    //        });
    //    }

    //    // this uses our container we created earlier
    //    //var containerClient = blobStorageClient.getContainerClient("your container name");
       
    //    //const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/${sas}`);

    //    //async function fetchBlobContent() {
    //    //    const containerClient = blobServiceClient.getContainerClient(containerName);
    //    //    const blobClient = containerClient.getBlobClient(blobName);

    //    //    // Get blob content
    //    //    const downloadBlockBlobResponse = await blobClient.download();
    //    //    const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
    //    //    setBlobContent(downloaded);
    //    //}

    //    //// Function to convert blob to string
    //    //async function blobToString(blob) {
    //    //    const fileReader = new FileReader();
    //    //    return new Promise((resolve, reject) => {
    //    //        fileReader.onloadend = (ev) => {
    //    //            resolve(ev.target.result);
    //    //        };
    //    //        fileReader.onerror = reject;
    //    //        fileReader.readAsText(blob);
    //    //    });
    //    //}
    //    // Fetch blob content
    //    //fetchBlobContent();
    //}, []);

    return (
        <StyledCard>
            <StyledCardActionArea href={`/details/${document.id}`}>
                <StyledCardContentImage>
                    <StyledImg
                        // image={document.image_url}
                        title={document.metadata_title}
                        alt={document.metadata_storage_file_extension}
                    />
                </StyledCardContentImage>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {shortenTitle(document.metadata_title)}
                        <br />
                        Image Path: {blobContent}
                    </Typography>
                </CardContent>
                {/*<iframe src={decodeBase64(document.metadata_storage_path)}></iframe>*/}
            </StyledCardActionArea>
        </StyledCard>
    );
}
