import React, { useState, useEffect } from 'react';
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";
import { BlobServiceClient } from '@azure/storage-blob';

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin: 10px;
  max-height: 18rem;
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
`;

const StyledImg = styled(CardMedia)`
  height: 180px;
  max-width: 120px;
  margin: 0 auto;
`;

const StyledIframeContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const StyledMagnifier = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
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
        const blobServiceClient = new BlobServiceClient(blobSasUrl);
        const containerName = "notes-source-ai-files";
        const blobName = document.metadata_storage_name;

        async function fetchBlobContent(inputBase64) {
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(inputBase64);

            const downloadBlockBlobResponse = await blobClient.download();
            const blob = await downloadBlockBlobResponse.blobBody;
            return URL.createObjectURL(blob);
        }

        fetchBlobContent(blobName).then((blobContentUrl) => {
            setIframeSrc(blobContentUrl);
        });
    }, []);

    const handleMagnifierClick = () => {
        const iframe = document.querySelector('iframe');

        // Example: Increase the size of the iframe
        iframe.style.width = '120%';
        iframe.style.height = '120%';

        // Example: Add a border to visually indicate the magnification
        iframe.style.border = '2px solid red';
    };

    return (
        <StyledCard>
            <StyledCardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {shortenTitle(document.metadata_title)}
                    <br />
                    Image Path: {document.metadata_storage_path}
                </Typography>
            </StyledCardContent>
            <StyledIframeContainer>
                <StyledIframe src={iframeSrc}></StyledIframe>
                <StyledMagnifier onClick={handleMagnifierClick}>+</StyledMagnifier>
            </StyledIframeContainer>
        </StyledCard>
    );
}
