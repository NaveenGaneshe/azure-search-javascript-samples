import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import styled from "@emotion/styled";

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

    const decideBase64 = (input) => {
        var atob = require('atob');
        var output = atob(input);
        return output;
    }

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
                      <br/>
                      Image Path: {decideBase64(document.metadata_storage_path)}
          </Typography>
        </CardContent>
          <iframe src={decideBase64(document.metadata_storage_path)}></iframe>
      </StyledCardActionArea>
    </StyledCard>
  );
}
