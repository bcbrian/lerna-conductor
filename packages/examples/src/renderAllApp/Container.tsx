import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import {
  loopNodes,
  useAppState,
  RenderNode,
  IncrementValues,
  ToggleTimeCycle,
  AddNode,
} from "../hooks/useAppState";
import NodeComponent from "../components/Node";

interface RenderNodesProps {
  nodes: Array<RenderNode>;
}

function RenderNodes({ nodes }: RenderNodesProps) {
  const renderedNodes: any = [];

  loopNodes(nodes, null, null, (node, parentNode, nodes): boolean => {
    node.data.children = [];
    const renderNode = <NodeComponent node={node} />;
    if (parentNode) {
      parentNode.data.children.push(renderNode);
    } else {
      renderedNodes.push(renderNode);
    }
    return true;
  });

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      {renderedNodes}
    </Grid>
  );
}

interface ControlProps {
  incrementValues: IncrementValues;
  toggleTimeCycle: ToggleTimeCycle;
  addNode: AddNode;
}

function Controls({ incrementValues, toggleTimeCycle, addNode }: ControlProps) {
  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item>
        <Button variant="contained" color="primary" onClick={incrementValues}>
          incrementValues
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={toggleTimeCycle}>
          toggleTimeCycle
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={addNode}>
          addNode
        </Button>
      </Grid>
    </Grid>
  );
}

function Container() {
  const { nodes, toggleTimeCycle, incrementValues, addNode } = useAppState(
    100,
    4,
    true
  );
  return (
    <Grid
      container
      direction="column"
      spacing={3}
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Controls
          addNode={addNode}
          toggleTimeCycle={toggleTimeCycle}
          incrementValues={incrementValues}
        />
      </Grid>
      <Grid item>
        <RenderNodes nodes={nodes} />
      </Grid>
    </Grid>
  );
}

export default Container;
