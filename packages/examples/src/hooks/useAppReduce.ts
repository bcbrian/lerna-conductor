import { useEffect, useReducer } from "react";

export interface RenderNode {
  id: number;
  value: number;
  parentId: number | null;
  data: any; // used for rendering...
}
export interface AppState {
  nodes: Array<RenderNode>;
  shouldTimeCycle: boolean;
  debug: boolean;
  mod: number;
  time: number;
}
export interface AppContextStruct {
  state: AppState;
  dispatch: (action: {type:string, payload?:any}) => void;
}

export function loopNodes(
  nodes: Array<RenderNode>,
  id: number | null,
  parentNode: RenderNode | null,
  cb: (
    node: RenderNode,
    parentNode: RenderNode | null,
    nodes: Array<RenderNode>
  ) => boolean
) {
  nodes
    .filter((node) => node.parentId === id)
    .forEach((node) => {
      if (cb(node, parentNode, nodes)) {
        loopNodes(nodes, node.id, node, cb);
      }
    });
}

const getInitialState = ({
  nodes,
  shouldTimeCycle,
  time,
  mod,
  debug,
}: Partial<AppState>) => ({
  nodes: nodes || [
    { id: 0, value: 0, parentId: null, data: {} },
    { id: 1, value: 0, parentId: 0, data: {} },
  ],
  shouldTimeCycle: shouldTimeCycle || false,
  time: time || 100,
  mod: mod || 4,
  debug: debug || false,
});

export const ACTIONS = {
  TOGGLE_TIMER_CYCLE: "toggleTimeCycle",
  ADD_NODE: "addNode",
  INCREMENT_VALUES: "incrementValues",
};
function reducer(state: AppState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case ACTIONS.TOGGLE_TIMER_CYCLE:
      return { ...state, shouldTimeCycle: !state.shouldTimeCycle };
    case ACTIONS.ADD_NODE:
      // generate a node
      const id = state.nodes.length;
      const value = 0;
      const parentId =
        Math.random() > 0.75
          ? null
          : Math.floor(Math.random() * state.nodes.length);

      return {
        ...state,
        nodes: [...state.nodes, { id, value, parentId, data: {} }],
      };
    case ACTIONS.INCREMENT_VALUES:
      if (state.debug) {
        console.log("INCREMENT_VALUES:", state);
      }

      // TODO: currently mutates... make it return a nre one?
      loopNodes(state.nodes, null, null, (node, parentNode, nodes) => {
        if (
          parentNode === null ||
          (parentNode !== null && parentNode?.value % state.mod === 0)
        ) {
          node.value += 1;
          return true;
        }
        return false;
      });

      return { ...state, nodes: [...state.nodes] };
    default:
      throw new Error();
  }
}

export function useAppState(
  time: number,
  mod: number = 4,
  debug: boolean = false
): AppContextStruct {
  const [state, dispatch] = useReducer(
    reducer,
    getInitialState({ time, mod, debug })
  );

  useEffect(() => {
    let handle: ReturnType<typeof setTimeout>;
    if (state.shouldTimeCycle) {
      handle = setTimeout(
        () => dispatch({ type: ACTIONS.INCREMENT_VALUES }),
        state.time
      );
    }
    return () => clearTimeout(handle);
  }, [state.nodes, dispatch, state.shouldTimeCycle]);

  return {
    state,
    dispatch,
  };
}
