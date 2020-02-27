import * as React from "react";
import { Dial } from "../types";
import { makeStyles, Card, Typography, Box, Link } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: (props: { backgroundColor: string }) => ({
    paddingTop: "56.25%",
    position: "relative",
    backgroundColor: props.backgroundColor
  }),
  centered: {
    padding: theme.spacing(2),
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    maxWidth: "100%"
  },
  header: {
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  subtitle: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    textAlign: "end"
  }
}));

const splitLink = (content: string) => {
  const result = content.split(".");
  return result;
};

interface DialCardProps {
  dial: Dial;
}

export const DialCard: React.SFC<DialCardProps> = ({ dial }) => {
  const classes = useStyles({ backgroundColor: dial.color });
  console.log(dial.color);
  const [header, subtitle] = splitLink(dial.alias);

  return (
    <Link href={dial.link}>
      <Card className={classes.root}>
        <Box component="div" overflow="hidden" className={classes.centered}>
          <Typography className={classes.header} variant="h3">
            {header}
          </Typography>
          <Typography className={classes.subtitle} variant="h6">
            {subtitle}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};
