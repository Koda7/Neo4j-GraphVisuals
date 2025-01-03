import neo4j from 'neo4j-driver';

const uri = 'bolt://localhost:7687'; // Replace with your Neo4j URI
const user = 'neo4j'; // Neo4j username
const password = 'neo_test'; // Neo4j password

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const fetchGraphData = async () => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)-[r]->(m)
      RETURN n, r, m
    `);

    const nodes = [];
    const links = [];
    const nodeMap = new Map(); // Use a Map to avoid duplicate nodes

    result.records.forEach(record => {
      const sourceNode = record.get('n');
      const targetNode = record.get('m');
      const relationship = record.get('r');

      // Add source node if it doesn't already exist
      if (!nodeMap.has(sourceNode.identity.toString())) {
        nodeMap.set(sourceNode.identity.toString(), {
          id: sourceNode.identity.toString(),
          label: sourceNode.labels[0], // assuming a single label
          ...sourceNode.properties
        });
      }

      // Add target node if it doesn't already exist
      if (!nodeMap.has(targetNode.identity.toString())) {
        nodeMap.set(targetNode.identity.toString(), {
          id: targetNode.identity.toString(),
          label: targetNode.labels[0], // assuming a single label
          ...targetNode.properties
        });
      }

      // Add link with source and target node IDs
      links.push({
        source: sourceNode.identity.toString(),
        target: targetNode.identity.toString(),
        type: relationship.type
      });
    });

    // Convert nodeMap values to an array for D3 compatibility
    nodes.push(...nodeMap.values());

    // Log nodes and links to verify
    console.log("Nodes:", nodes);
    console.log("Links:", links);

    return { nodes, links };
  } finally {
    await session.close();
  }
};
