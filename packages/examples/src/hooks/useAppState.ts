import { useCallback, useEffect, useState } from "react";

export interface RenderNode {
  id: number;
  value: number;
  parentId: number | null;
  data: any; // used for rendering...
}
export type SetNodes = (nodes: Array<RenderNode>) => void;
export type IncrementValues = () => void;
export type ToggleTimeCycle = () => void;
export type AddNode = () => void;
export interface AppState {
  nodes: Array<RenderNode>;
  setNodes: SetNodes;
  toggleTimeCycle: ToggleTimeCycle;
  incrementValues: IncrementValues;
  addNode: AddNode;
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

export function useAppState(
  time: number,
  mod: number = 4,
  debug: boolean = false
): AppState {
  const [shouldTimeCycle, setShouldTimeCycle] = useState(false);

  const [nodes, setNodes] = useState([
    { id: 0, value: 0, parentId: null, data: {} },
    { id: 1, value: 0, parentId: 0, data: {} },
  ]);

  const toggleTimeCycle: ToggleTimeCycle = useCallback(
    () => setShouldTimeCycle(!shouldTimeCycle),
    [shouldTimeCycle, setShouldTimeCycle]
  );

  const incrementValues = useCallback(
    (debugString: string): IncrementValues => {
      return () => {
        if (debug) {
          console.log(debugString);
        }

        loopNodes(nodes, null, null, (node, parentNode, nodes) => {
          if (
            parentNode === null ||
            (parentNode !== null && parentNode?.value % mod === 0)
          ) {
            node.value += 1;
            return true;
          }
          return false;
        });

        setNodes([...nodes]);
      };
    },
    [nodes, setNodes]
  );

  useEffect(() => {
    let handle: ReturnType<typeof setTimeout>;
    if (shouldTimeCycle) {
      handle = setTimeout(incrementValues("Timeout Cycle"), time);
    }
    return () => clearTimeout(handle);
  }, [nodes, setNodes, shouldTimeCycle]);

  const addNode = useCallback(() => {
    // generate a node
    const id = nodes.length;
    const value = 0;
    const parentId =
      Math.random() > 0.75 ? null : Math.floor(Math.random() * nodes.length);
    setNodes([...nodes, { id, value, parentId, data: {} }]);
  }, [nodes, setNodes]);

  return {
    nodes,
    setNodes,
    toggleTimeCycle,
    incrementValues: incrementValues("Manual Cycle"),
    addNode,
  };
}
