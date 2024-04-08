import React, { useState, useEffect } from 'react';
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";
import { BlobServiceClient } from '@azure/storage-blob';

const StyledCard = styled(Card)`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledIframeContainer = styled.div`
  flex: 1;
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

    const [iframeSrc, setIframeSrc] = useState('');
    useEffect(() => {
        const blobSasUrl = "https://ecftranslatorapp.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-04-18T05:41:52Z&st=2024-04-01T21:41:52Z&spr=https&sig=f0pbuGqjDY84WFsCbEUcuG1iReUWe2Zxsh7GccFBxpY%3D";

        // Create a new BlobServiceClient
        const blobServiceClient = new BlobServiceClient(blobSasUrl);

        const containerName = "notes-source-ai-files";
        const blobName = document.metadata_storage_name;

        async function fetchBlobContent(inputBase64) {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(inputBase64);

            // Get blob content
            const downloadBlockBlobResponse = await blobClient.download();
            const blob = await downloadBlockBlobResponse.blobBody; // Get the Blob object directly
            return URL.createObjectURL(blob); // Pass the Blob object to createObjectURL
        }

        fetchBlobContent(blobName).then((blobContentUrl) => {
            setIframeSrc(blobContentUrl);
        });
    }, []);

    return (
        <StyledCard>
            <StyledCardContent>
                <StyledCardContentImage>
                    {/*<StyledImg*/}
                    {/*    // image={document.image_url}*/}
                    {/*    title={document.metadata_title}*/}
                    {/*    alt={document.metadata_storage_file_extension}*/}
                    {/*/>*/}
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {shortenTitle(document.metadata_title)}
                        <br />
                        Image Path: {blobContent}
                    </Typography>
                </StyledCardContentImage>
            </StyledCardContent>
            <StyledIframeContainer>
                <iframe src={iframeSrc}></iframe>
            </StyledIframeContainer>
        </StyledCard>
    );
}



