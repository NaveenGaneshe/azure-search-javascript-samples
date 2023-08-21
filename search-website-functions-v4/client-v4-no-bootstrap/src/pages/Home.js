import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import logo from "../images/cognitive_search.jpg";
import Stack from "@mui/system/Stack";
import styled from "@emotion/styled";

const StyledHomeBox = styled(Box)`
  margin: 5em auto;
  min-height: 30em;
  padding-left: 0px;
  padding-right: 0px;
  max-width: 50%;
  outline: 0px;
  align-items: center;
`;

const StyledImageContainer = styled(Container)`
  width: 500px;
  margin: auto;
`;

const StyledImage = styled.img`
  height: auto;
  width: 100%;
`;

const StyledTypographyContainer = styled(Container)`
  display: flex;
  justify-content: center;
`;
const StyledTypography = styled(Typography)`
  width: 275px;
`;


/* * { outline: 1px solid red; } */

const StyledHomeSearchBox = styled(Box)`
  width: 100%;
  margin: 10px auto;
`;


export default function Home() {
  const navigate = useNavigate();
  const navigateToSearchPage = (q) => {
    console.log(`q: ${q}`);

    if (!q || q === "") {
      q = "*";
    }
    navigate(`/search?q=${q}&page=1`);
  };

  return (
    <>
      <StyledHomeBox className="Home">
        <Stack spacing={2} direction="column">
          <StyledImageContainer>
            <StyledImage src={logo} alt="Cognitive Search" />
          </StyledImageContainer>
          <StyledTypographyContainer>
            <StyledTypography>Powered by Azure Cognitive Search</StyledTypography>
          </StyledTypographyContainer>
          <StyledHomeSearchBox>
            <SearchBar navigateToSearchPage={navigateToSearchPage}></SearchBar>
          </StyledHomeSearchBox>
        </Stack>
      </StyledHomeBox>
    </>
  );
}
