import React, { useState, useEffect } from 'react'; 
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";
import { BlobServiceClient } from '@azure/storage-blob';

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
        const account = "ecftranslatorapp";
        const sas = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-04-05T03:09:28Z&st=2024-04-04T19:09:28Z&spr=https&sig=7R7BdJ7WWB%2F075e3m5qoss48I%2BflKV81FZyOqr3Kmvg%3D";
        const containerName = "notes-source-ai-files";
        const blobName = "SKM_C450i24031413410_0008.pdf";

        const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/${sas}`);

        async function fetchBlobContent() {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(blobName);

            // Get blob content
            const downloadBlockBlobResponse = await blobClient.download();
            const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
            setBlobContent(downloaded);
        }

        // Function to convert blob to string
        async function blobToString(blob) {
            const fileReader = new FileReader();
            return new Promise((resolve, reject) => {
                fileReader.onloadend = (ev) => {
                    resolve(ev.target.result);
                };
                fileReader.onerror = reject;
                fileReader.readAsText(blob);
            });
        }
        // Fetch blob content
        fetchBlobContent();
    }, []);

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
