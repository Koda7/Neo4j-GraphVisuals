import neo4j from 'neo4j-driver';

const uri = 'bolt://localhost:7687'; 
const user = 'neo4j'; 
const password = 'neo_test'; 

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
    const nodeMap = new Map();

    result.records.forEach(record => {
      const sourceNode = record.get('n');
      const targetNode = record.get('m');
      const relationship = record.get('r');

      if (!nodeMap.has(sourceNode.identity.toString())) {
        nodeMap.set(sourceNode.identity.toString(), {
          id: sourceNode.identity.toString(),
          label: sourceNode.labels[0],
          ...sourceNode.properties
        });
      }

      if (!nodeMap.has(targetNode.identity.toString())) {
        nodeMap.set(targetNode.identity.toString(), {
          id: targetNode.identity.toString(),
          label: targetNode.labels[0], 
          ...targetNode.properties
        });
      }

      links.push({
        source: sourceNode.identity.toString(),
        target: targetNode.identity.toString(),
        type: relationship.type
      });
    });

    nodes.push(...nodeMap.values());

    console.log("Nodes:", nodes);
    console.log("Links:", links);

    return { nodes, links };
  } finally {
    await session.close();
  }
};

// testing neo4j service