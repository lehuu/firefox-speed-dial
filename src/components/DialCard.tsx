import * as React from "react";
import { makeStyles, Card, Typography, Box, Grid } from "@material-ui/core";
import convertHexToRGB from "../utils/convertHexToRGB";
import { SortableElement, SortableContainer } from "react-sortable-hoc";
import { Dial } from "../types";

const useStyles = makeStyles((theme) => ({
  root: (props: { backgroundColor: string }) => {
    const rgb = convertHexToRGB(props.backgroundColor);

    const bgColor = rgb
      ? `rgba(${rgb.r},${rgb.g},${rgb.b}, 0.8)`
      : props.backgroundColor;
    const hoverBgColor = rgb
      ? `rgba(${rgb.r},${rgb.g},${rgb.b}, 1)`
      : props.backgroundColor;

    return {
      whiteSpace: "nowrap",
      "&> .MuiCard-root": {
        display: "block",
        paddingTop: "56.25%",
        position: "relative",
        transition: "background-color .15s linear",
        backgroundColor: bgColor,
      },
      "&:hover >.MuiCard-root": {
        backgroundColor: hoverBgColor,
      },
      "& *": {
        pointerEvents: "none",
      },
    };
  },
  centered: {
    padding: theme.spacing(2),
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    maxWidth: "100%",
  },
  header: {
    textOverflow: "ellipsis",
    pointerEvents: "none",
    overflow: "hidden",
    userSelect: "none",
  },
  subtitle: {
    textOverflow: "ellipsis",
    pointerEvents: "none",
    overflow: "hidden",
    textAlign: "end",
    userSelect: "none",
  },
}));

interface SortableCardProps extends React.ComponentProps<typeof Grid> {
  dial: Dial;
}

export const SortableCard = SortableElement<SortableCardProps>(
  ({ dial, ...rest }: SortableCardProps) => {
    const classes = useStyles({ backgroundColor: dial.color });
    const [header, subtitle] = splitLink(dial.alias);

    const http_pattern = "/^http[s]*://[w]+/i";
    let link = dial.link;
    if (!link.match(http_pattern)) {
      link = `http://${link}`;
    }

    return (
      <Grid {...rest} item xs={12} sm={6} md={4}>
        <a className={classes.root} draggable={false} href={link}>
          <Card>
            <Box component="div" overflow="hidden" className={classes.centered}>
              <Typography
                draggable={false}
                className={classes.header}
                variant="h3"
              >
                {header}
              </Typography>
              <Typography
                draggable={false}
                className={classes.subtitle}
                variant="h6"
              >
                {subtitle}
              </Typography>
            </Box>
          </Card>
        </a>
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
