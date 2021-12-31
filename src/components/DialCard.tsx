import * as React from "react";
import { Card, Typography, Box, Grid, Link } from "@mui/material";
import convertHexToRGB from "../utils/convertHexToRGB";
import { SortableElement, SortableContainer } from "react-sortable-hoc";
import { Dial } from "../types";

interface SortableCardProps extends React.ComponentProps<typeof Grid> {
  dial: Dial;
}

export const SortableCard = SortableElement<SortableCardProps>(
  ({ dial, ...rest }: SortableCardProps) => {
    const rgbColor = convertHexToRGB(dial.color);
    const bgColor = rgbColor
      ? `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b}, 0.8)`
      : dial.color;
    const hoverBgColor = rgbColor
      ? `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b}, 1)`
      : dial.color;

    const [header, subtitle] = splitLink(dial.alias);

    const http_pattern = /^http[s]*:\/\/.+/i;
    let link = dial.link;
    if (!link.match(http_pattern)) {
      link = `https://${link}`;
    }

    return (
      <Grid {...rest} item xs={12} sm={6} md={4}>
        <Link
          sx={{
            whiteSpace: "nowrap",
          }}
          draggable={false}
          href={link}
        >
          <Card
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius,
              display: "block",
              paddingTop: "56.25%",
              position: "relative",
              transition: "background-color .15s linear",
              backgroundColor: bgColor,
              "&:hover": {
                backgroundColor: hoverBgColor,
              },
            }}
          >
            <Box
              component="div"
              overflow="hidden"
              sx={{
                padding: (theme) => theme.spacing(2),
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                maxWidth: "100%",
              }}
            >
              <Typography
                draggable={false}
                sx={{
                  textOverflow: "ellipsis",
                  pointerEvents: "none",
                  overflow: "hidden",
                  userSelect: "none",
                }}
                variant="h3"
              >
                {header}
              </Typography>
              <Typography
                draggable={false}
                sx={{
                  textOverflow: "ellipsis",
                  pointerEvents: "none",
                  overflow: "hidden",
                  textAlign: "end",
                  userSelect: "none",
                }}
                variant="h6"
              >
                {subtitle}
              </Typography>
            </Box>
          </Card>
        </Link>
      </Grid>
    );
  }
);

interface SortableCardContainerProps {
  children?: React.ReactNode;
}

export const SortableCardContainer =
  SortableContainer<SortableCardContainerProps>(
    ({ children }: SortableCardContainerProps) => {
      return (
        <Grid container spacing={3}>
          {children}
        </Grid>
      );
    }
  );

const splitLink = (content: string) => {
  const result = content.split(".");
  return result;
};
