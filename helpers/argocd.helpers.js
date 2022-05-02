const dagre = require('dagre')

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  const nodeWidth = 200
  const nodeHeight = 70

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? 'left' : 'top'
    node.sourcePosition = isHorizontal ? 'right' : 'bottom'

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    }

    return node
  })

  return { nodes, edges }
}

const nodeEdges = (content, name) => {
  const res = content.nodes

  const initialNodes = res.map((node) => {
    return {
      id: node.uid,
      position: { x: 0, y: 0 },
      data: {
        name: node.name,
        kind: node.kind,
        health: node.health ? node.health.status : 'Unknown',
        namespace: node.namespace,
        version: node.version,
        group: node.group
      },
      type: 'customNode'
    }
  })
  initialNodes.push({
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      name
    },
    type: 'customNode'
  })
  const initialEdges = []
  res.forEach((node, index) => {
    if (node.parentRefs) {
      node.parentRefs.forEach((r) => {
        initialEdges.push({
          id: `${node.uid}-${r.uid}`,
          target: node.uid,
          source: r.uid,
          animated: true,
          type: 'smoothstep'
        })
      })
    } else {
      initialEdges.push({
        id: index,
        target: node.uid,
        source: '1',
        animated: true,
        type: 'smoothstep'
      })
    }
  })

  return getLayoutedElements(initialNodes, initialEdges)
}

module.exports = {
  nodeEdges,
  getLayoutedElements
}
