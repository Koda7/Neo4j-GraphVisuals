import React, { useEffect } from 'react';
import NeoVis from 'neovis.js';

const GraphExplorer = () => {
  useEffect(() => {
    // NeoVis configuration
    const config = {
      containerId: "viz",
      neo4j: {
        serverUrl: "bolt://localhost:7687",
        serverUser: "neo4j",
        serverPassword: "got_testing",
      },
      labels: {
        Character: {
          label: "name",
          value: "pagerank",
          group: "community",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: (node) => NeoVis.nodeToHtml(node, ["name", "pagerank"]),
            },
          },
        },
      },
      relationships: {
        INTERACTS: {
          value: "weight",
        },
      },
      initialCypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN *",
      console_debug: true,
    };

    const viz = new NeoVis(config); // Use NeoVis directly here without .default
    viz.render();

    // Optional: Cleanup on component unmount
    return () => {
      viz.clearNetwork();
    };
  }, []);

  return (
    <div>
      <h2>Character Interaction Network</h2>
      <div id="viz" style={{ width: "100%", height: "600px" }}></div>
    </div>
  );
};

export default GraphExplorer;
