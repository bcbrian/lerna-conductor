import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { RenderNode } from "../hooks/useAppState";

const useStyles = makeStyles({
  node: {
    padding: "20px",
    color: "#fff",
  },
});

export default function NodeComponent({ node }: { node: RenderNode }) {
  const classes = useStyles();
  return (
    <Grid item>
      <Paper
        elevation={3}
        className={classes.node}
        style={{ background: "#663399" }}
      >
        <Grid
          container
          direction="column"
          spacing={3}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography className={classes.node} variant="h4">
              {node.value}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} justify="center" alignItems="center">
          {node.data.children}
        </Grid>
      </Paper>
    </Grid>
  );
}
