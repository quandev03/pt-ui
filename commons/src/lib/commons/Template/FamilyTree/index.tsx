import dagre from "dagre";
import { FC, memo, useEffect } from "react";
import ReactFlow, {
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";

const nodeTypes = {
  // circle: CustomerNode,
} satisfies NodeTypes;

const edgeTypes = {
  // dot2: DotEdge2,
} satisfies EdgeTypes;

type Props = {
  data: { nodes: Node[]; edges: Edge[] };
};

const TreeFamily: FC<Props> = ({ data }) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "TB", nodesep: 100, ranksep: 100 });

    data.nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 100, height: 50 });
    });

    data.edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const updatedNodes = data.nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWithPosition.width / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        },
      };
    });

    const updatedEdges = data.edges.map((edge) => ({
      ...edge,
      source: edge.source,
      target: edge.target,
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [data, setEdges, setNodes]);

  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} edgeTypes={edgeTypes} fitView />
    </ReactFlowProvider>
  );
};

export default memo(TreeFamily);
