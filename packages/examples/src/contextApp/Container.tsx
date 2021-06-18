import { createContext, ReactChild, useContext, useMemo } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import {
  loopNodes,
  useAppState,
  RenderNode,
  ACTIONS,
} from "../hooks/useAppReduce";
import NodeComponent from "../components/Node";

function RenderNodes() {
  const { nodes } = useContext(StateContext);
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

function Controls() {
  const dispatch = useContext(ControlsContext);
  return useMemo(
    () => (
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch({ type: ACTIONS.INCREMENT_VALUES })}
          >
            incrementValues
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_TIMER_CYCLE })}
          >
            toggleTimeCycle
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch({ type: ACTIONS.ADD_NODE })}
          >
            addNode
          </Button>
        </Grid>
      </Grid>
    ),
    []
  );
}
Controls.whyDidYouRender = true;

interface StateContext {
  nodes: Array<RenderNode>;
}

interface StateProviderProps {
  value: StateContext;
  children: ReactChild;
}

const StateContext = createContext({
  nodes: [] as Array<RenderNode>,
});

const StateProvider = (props: StateProviderProps) => {
  const Children = useMemo(() => props.children, []);
  return <StateContext.Provider {...props}>{Children}</StateContext.Provider>;
};
type ControlsContext = (action: { type: string; payload?: any }) => void;

interface ControlsProviderProps {
  value: ControlsContext;
  children: ReactChild;
}

const ControlsContext = createContext(
  (action: { type: string; payload?: any }) => {
    console.log(action);
  }
);

const ControlsProvider = (props: ControlsProviderProps) => {
  return <ControlsContext.Provider {...props} />;
};
function Container() {
  const { state, dispatch } = useAppState(100, 4, false);
  return (
    <ControlsProvider value={dispatch}>
      <StateProvider value={{ nodes: state.nodes }}>
        <Grid
          container
          direction="column"
          spacing={3}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Controls />
          </Grid>
          <Grid item>
            <RenderNodes />
          </Grid>
        </Grid>
      </StateProvider>
    </ControlsProvider>
  );
}

export default Container;
