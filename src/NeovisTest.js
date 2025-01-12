// const neo4j = require('neo4j-driver');

// // Set up the driver with your Neo4j instance details
// const driver = neo4j.driver(
//   'bolt://localhost:7687', // or 'neo4j://localhost:7687'
//   neo4j.auth.basic('koda', 'koda1234'), // replace with the correct username and password
//   { encrypted: 'ENCRYPTION_OFF' } // adjust encryption if necessary
// );

// async function testConnection() {
//   const session = driver.session();

//   try {
//     // Run a simple Cypher query to check the connection
//     const result = await session.run('MATCH (n) RETURN n LIMIT 1');
//     console.log('Connection successful:', result.records);
//   } catch (error) {
//     console.error('Connection failed:', error);
//   } finally {
//     // Close the session and driver
//     await session.close();
//     await driver.close();
//   }
// }

// testConnection();

// NeovisTest.js
// import React, { useEffect } from "react";
// import NeoVis from "neovis.js/dist/neovis";

// const NeovisTest = () => {
//   useEffect(() => {
//     const config = {
//       container_id: "neovis", // Use static ID for container
//       server_url: "bolt://localhost:7687", // Update with your Neo4j URI
//       server_user: "neo4j",                 // Your Neo4j username
//       server_password: "neo_test",     // Your Neo4j password
//       initial_cypher: "MATCH (n) RETURN n LIMIT 5",  // Simple query to test rendering
//     };

//     const viz = new NeoVis(config);

//     try {
//       viz.render();
//       console.log("Neovis rendered successfully");
//     } catch (error) {
//       console.error("Neovis rendering error:", error);
//     }
//   }, []);

//   return <div id="neovis" style={{ width: "100%", height: "800px" }} />;
// };

// import React, { useEffect, useRef } from "react";
// import NeoVis from "neovis.js/dist/neovis";

// const NeovisGraph = () => {
//   const vizRef = useRef(null);

//   useEffect(() => {
//     const config = {
//       container_id: "neovis",
//       server_url: "bolt://localhost:7687",
//       server_user: "neo4j",
//       server_password: "neo_test",
//       arrows: true,
//       initial_cypher: `
//         MATCH (c:Customer)-[p:PLACED]->(o:Order)
//         OPTIONAL MATCH (o)-[r:CONTAINS]->(prod:Product)
//         RETURN c, p, o, r, prod LIMIT 100
//       `,
//       labels: {
//         Customer: { caption: "customer_name", size: 40, color: "#4169E1", font: { size: 16 } },
//         Order: { caption: "order_id", size: 35, color: "#FFA500", font: { size: 16 } },
//         Product: { caption: "product_name", size: 30, color: "#32CD32", font: { size: 16 } }
//       },
//       relationships: {
//         PLACED: { caption: true, thickness: 4, color: "#4B0082" },
//         CONTAINS: { caption: true, thickness: 3, color: "#DC143C" }
//       },
//       physics: {
//         enabled: true,
//         solver: "forceAtlas2Based",
//         forceAtlas2Based: {
//           gravitationalConstant: -2000,
//           centralGravity: 0.3,
//           springLength: 200,
//           springConstant: 0.15
//         },
//         stabilization: { enabled: true, iterations: 150 }
//       }
//     };

//     const initViz = async () => {
//       try {
//         const viz = new NeoVis(config);
//         vizRef.current = viz;

//         viz.registerOnEvent("completed", () => {
//           console.log("Visualization completed");
//           if (viz.network) {
//             viz.network.fit();
//           }
//         });

//         await viz.render();
//         console.log("Render initiated");
//       } catch (error) {
//         console.error("Initialization error:", error);
//       }
//     };

//     initViz();

//     return () => {
//       if (vizRef.current && vizRef.current.network) {
//         vizRef.current.network.destroy();
//         vizRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="graph-container">
//       <div 
//         id="neovis" 
//         style={{ width: "100%", height: "800px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f8f9fa" }} 
//       />
//     </div>
//   );
// };

// export default NeovisGraph;

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// const sampleData = {
//   nodes: [
//     { id: "1", label: "Customer", name: "Alice" },
//     { id: "2", label: "Order", order_id: "1234" },
//     { id: "3", label: "Product", product_name: "Widget" },
//     { id: "4", label: "Customer", name: "Bob" },
//     { id: "5", label: "Order", order_id: "5678" },
//     { id: "6", label: "Product", product_name: "Gadget" },
//     { id: "7", label: "Customer", name: "Carol" },
//     { id: "8", label: "Order", order_id: "9101" },
//     { id: "9", label: "Product", product_name: "Tool" },
//     { id: "10", label: "Customer", name: "Dave" },
//     { id: "11", label: "Order", order_id: "1121" },
//     { id: "12", label: "Product", product_name: "Device" }
//   ],
//   links: [
//     { source: "1", target: "2", type: "PLACED" },
//     { source: "2", target: "3", type: "CONTAINS" },
//     { source: "4", target: "5", type: "PLACED" },
//     { source: "5", target: "6", type: "CONTAINS" },
//     { source: "7", target: "8", type: "PLACED" },
//     { source: "8", target: "9", type: "CONTAINS" },
//     { source: "10", target: "11", type: "PLACED" },
//     { source: "11", target: "12", type: "CONTAINS" }
//   ]
// };

// const D3Graph = () => {
//   const svgRef = useRef();
//   const [selectedNode, setSelectedNode] = useState(null);

//   const updateDimensions = () => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     d3.select(svgRef.current).attr("width", width).attr("height", height);
//   };

//   useEffect(() => {
//     updateDimensions();
//     window.addEventListener("resize", updateDimensions);

//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     // Create SVG and add zoom behavior
//     const svg = d3.select(svgRef.current);
//     const g = svg.append("g");
    
//     const zoom = d3.zoom()
//       .scaleExtent([0.1, 4])
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });

//     svg.call(zoom);

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     const simulation = d3.forceSimulation(sampleData.nodes)
//       .force("link", d3.forceLink(sampleData.links).id(d => d.id).distance(200))
//       .force("charge", d3.forceManyBody().strength(-800))
//       .force("center", d3.forceCenter(width / 2, height / 2));

//     const link = g.selectAll(".link")
//       .data(sampleData.links)
//       .enter()
//       .append("line")
//       .attr("class", "link")
//       .attr("stroke", d => d.type === "PLACED" ? "#4B0082" : "#DC143C")
//       .attr("stroke-width", 2);

//     const linkLabels = g.selectAll(".link-label")
//       .data(sampleData.links)
//       .enter()
//       .append("text")
//       .attr("class", "link-label")
//       .attr("text-anchor", "middle")
//       .attr("font-size", 12)
//       .attr("fill", "#555")
//       .text(d => d.type);

//     const node = g.selectAll(".node")
//       .data(sampleData.nodes)
//       .enter()
//       .append("circle")
//       .attr("class", "node")
//       .attr("r", 30)
//       .attr("fill", d => colorScale(d.label))
//       .style("cursor", "grab")
//       .on("click", (event, d) => {
//         event.stopPropagation();
//         setSelectedNode(d);
//       })
//       .call(d3.drag()
//         .on("start", dragStarted)
//         .on("drag", dragged)
//         .on("end", dragEnded));

//     const labels = g.selectAll(".label")
//       .data(sampleData.nodes)
//       .enter()
//       .append("text")
//       .attr("class", "label")
//       .attr("dy", ".35em")
//       .attr("text-anchor", "middle")
//       .attr("fill", "white")
//       .attr("font-size", 14)
//       .text(d => d.label === "Customer" ? d.name : d.label === "Order" ? d.order_id : d.product_name);

//     // Click on background to deselect node
//     svg.on("click", () => {
//       setSelectedNode(null);
//     });

//     simulation.on("tick", () => {
//       link
//         .attr("x1", d => d.source.x)
//         .attr("y1", d => d.source.y)
//         .attr("x2", d => d.target.x)
//         .attr("y2", d => d.target.y);

//       linkLabels
//         .attr("x", d => (d.source.x + d.target.x) / 2)
//         .attr("y", d => (d.source.y + d.target.y) / 2);

//       node
//         .attr("cx", d => (d.x = Math.max(30, Math.min(width - 30, d.x))))
//         .attr("cy", d => (d.y = Math.max(30, Math.min(height - 30, d.y))));

//       labels
//         .attr("x", d => d.x)
//         .attr("y", d => d.y);
//     });

//     function dragStarted(event, d) {
//       event.sourceEvent.stopPropagation();
//       if (!event.active) simulation.alphaTarget(0.3).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//       d3.select(event.sourceEvent.target).style("cursor", "grabbing");
//     }

//     function dragged(event, d) {
//       d.fx = event.x;
//       d.fy = event.y;
//     }

//     function dragEnded(event, d) {
//       if (!event.active) simulation.alphaTarget(0);
//       d.fx = null;
//       d.fy = null;
//       d3.select(event.sourceEvent.target).style("cursor", "grab");
//     }

//     // Zoom control functions
//     window.zoomIn = () => {
//       svg.transition().call(zoom.scaleBy, 1.5);
//     };

//     window.zoomOut = () => {
//       svg.transition().call(zoom.scaleBy, 0.67);
//     };

//     window.fitToScreen = () => {
//       const bounds = g.node().getBBox();
//       const parent = svg.node().getBoundingClientRect();
//       const fullWidth = parent.width;
//       const fullHeight = parent.height;
      
//       const width = bounds.width;
//       const height = bounds.height;
      
//       const midX = bounds.x + width / 2;
//       const midY = bounds.y + height / 2;
      
//       const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
//       const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

//       svg.transition()
//         .duration(750)
//         .call(zoom.transform, d3.zoomIdentity
//           .translate(translate[0], translate[1])
//           .scale(scale));
//     };

//     return () => {
//       window.removeEventListener("resize", updateDimensions);
//       svg.selectAll("*").remove();
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       <svg ref={svgRef} className="w-full h-full"></svg>
      
//       {/* Zoom Controls */}
//       <div className="absolute top-4 right-4 flex flex-col gap-2">
//         <button 
//           onClick={() => window.zoomIn()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom In"
//         >
//           <ZoomIn className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={() => window.zoomOut()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom Out"
//         >
//           <ZoomOut className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={() => window.fitToScreen()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Fit to Screen"
//         >
//           <Maximize className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Properties Panel */}
//       {selectedNode && (
//         <div className="absolute top-4 left-4 w-64 bg-white p-4 rounded-lg shadow-lg">
//           <h3 className="text-lg font-bold mb-2">{selectedNode.label} Properties</h3>
//           <div className="space-y-2">
//             {Object.entries(selectedNode).map(([key, value]) => {
//               if (key !== 'x' && key !== 'y' && key !== 'fx' && key !== 'fy' && key !== 'index' && key !== 'vx' && key !== 'vy') {
//                 return (
//                   <div key={key} className="flex justify-between">
//                     <span className="text-gray-600">{key}:</span>
//                     <span className="font-medium">{value}</span>
//                   </div>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default D3Graph;

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// const sampleData = {
//   nodes: [
//     { id: "1", label: "Customer", name: "Alice" },
//     { id: "2", label: "Order", order_id: "1234" },
//     { id: "3", label: "Product", product_name: "Widget" },
//     { id: "4", label: "Customer", name: "Bob" },
//     { id: "5", label: "Order", order_id: "5678" },
//     { id: "6", label: "Product", product_name: "Gadget" },
//     { id: "7", label: "Customer", name: "Carol" },
//     { id: "8", label: "Order", order_id: "9101" },
//     { id: "9", label: "Product", product_name: "Tool" },
//     { id: "10", label: "Customer", name: "Dave" },
//     { id: "11", label: "Order", order_id: "1121" },
//     { id: "12", label: "Product", product_name: "Device" }
//   ],
//   links: [
//     { source: "1", target: "2", type: "PLACED" },
//     { source: "2", target: "3", type: "CONTAINS" },
//     { source: "4", target: "5", type: "PLACED" },
//     { source: "5", target: "6", type: "CONTAINS" },
//     { source: "7", target: "8", type: "PLACED" },
//     { source: "8", target: "9", type: "CONTAINS" },
//     { source: "10", target: "11", type: "PLACED" },
//     { source: "11", target: "12", type: "CONTAINS" }
//   ]
// };

// const D3Graph = () => {
//   const svgRef = useRef();
//   const [selectedNode, setSelectedNode] = useState(null);

//   const updateDimensions = () => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     d3.select(svgRef.current).attr("width", width).attr("height", height);
//   };

//   useEffect(() => {
//     updateDimensions();
//     window.addEventListener("resize", updateDimensions);

//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     // Create SVG and add zoom behavior
//     const svg = d3.select(svgRef.current);
//     const g = svg.append("g");
    
//     // Prevent default touch behavior on SVG
//     svg.node().addEventListener('touchstart', e => e.preventDefault(), { passive: false });
//     svg.node().addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    
//     const zoom = d3.zoom()
//       .scaleExtent([0.1, 4])
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });

//     svg.call(zoom);

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     // Create a map to track connected nodes
//     const linkedByIndex = {};
//     sampleData.links.forEach(d => {
//       linkedByIndex[`${d.source},${d.target}`] = 1;
//       linkedByIndex[`${d.target},${d.source}`] = 1;
//     });

//     // Function to check if two nodes are connected
//     const isConnected = (a, b) => {
//       return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
//     };

//     const simulation = d3.forceSimulation(sampleData.nodes)
//       .force("link", d3.forceLink(sampleData.links)
//         .id(d => d.id)
//         .distance(150)) // Reduced distance between connected nodes
//       .force("charge", d3.forceManyBody()
//         .strength(d => -200)) // Reduced repulsion strength
//       .force("center", d3.forceCenter(width / 2, height / 2))
//       // Add collision force to prevent overlap
//       .force("collision", d3.forceCollide().radius(40));

//     const link = g.selectAll(".link")
//       .data(sampleData.links)
//       .enter()
//       .append("line")
//       .attr("class", "link")
//       .attr("stroke", d => d.type === "PLACED" ? "#4B0082" : "#DC143C")
//       .attr("stroke-width", 2);

//     const linkLabels = g.selectAll(".link-label")
//       .data(sampleData.links)
//       .enter()
//       .append("text")
//       .attr("class", "link-label")
//       .attr("text-anchor", "middle")
//       .attr("font-size", 12)
//       .attr("fill", "#555")
//       .text(d => d.type);

//     const node = g.selectAll(".node")
//       .data(sampleData.nodes)
//       .enter()
//       .append("circle")
//       .attr("class", "node")
//       .attr("r", 30)
//       .attr("fill", d => colorScale(d.label))
//       .style("cursor", "grab")
//       .on("click", (event, d) => {
//         event.stopPropagation();
//         setSelectedNode(d);
//       });

//     // Improved drag behavior
//     const drag = d3.drag()
//       .on("start", dragStarted)
//       .on("drag", dragged)
//       .on("end", dragEnded);

//     node.call(drag);

//     const labels = g.selectAll(".label")
//       .data(sampleData.nodes)
//       .enter()
//       .append("text")
//       .attr("class", "label")
//       .attr("dy", ".35em")
//       .attr("text-anchor", "middle")
//       .attr("fill", "white")
//       .attr("font-size", 14)
//       .attr("pointer-events", "none") // Make labels non-interactive
//       .text(d => d.label === "Customer" ? d.name : d.label === "Order" ? d.order_id : d.product_name);

//     // Click on background to deselect node
//     svg.on("click", () => {
//       setSelectedNode(null);
//     });

//     simulation.on("tick", () => {
//       link
//         .attr("x1", d => d.source.x)
//         .attr("y1", d => d.source.y)
//         .attr("x2", d => d.target.x)
//         .attr("y2", d => d.target.y);

//       linkLabels
//         .attr("x", d => (d.source.x + d.target.x) / 2)
//         .attr("y", d => (d.source.y + d.target.y) / 2);

//       node
//         .attr("cx", d => (d.x = Math.max(30, Math.min(width - 30, d.x))))
//         .attr("cy", d => (d.y = Math.max(30, Math.min(height - 30, d.y))));

//       labels
//         .attr("x", d => d.x)
//         .attr("y", d => d.y);
//     });

//     function dragStarted(event, d) {
//       if (!event.active) {
//         simulation.alphaTarget(0.3).restart();
//       }
//       d.fx = d.x;
//       d.fy = d.y;
//       d3.select(this).style("cursor", "grabbing");
//     }

//     function dragged(event, d) {
//       d.fx = event.x;
//       d.fy = event.y;
      
//       // Only move connected nodes slightly
//       sampleData.nodes.forEach(n => {
//         if (n !== d && isConnected(d, n)) {
//           const dx = event.x - d.x;
//           const dy = event.y - d.y;
//           n.x += dx * 0.1;
//           n.y += dy * 0.1;
//         }
//       });
//     }

//     function dragEnded(event, d) {
//       if (!event.active) {
//         simulation.alphaTarget(0);
//       }
//       d.fx = null;
//       d.fy = null;
//       d3.select(this).style("cursor", "grab");
//     }

//     // Zoom control functions
//     window.zoomIn = () => {
//       svg.transition().call(zoom.scaleBy, 1.5);
//     };

//     window.zoomOut = () => {
//       svg.transition().call(zoom.scaleBy, 0.67);
//     };

//     window.fitToScreen = () => {
//       const bounds = g.node().getBBox();
//       const parent = svg.node().getBoundingClientRect();
//       const fullWidth = parent.width;
//       const fullHeight = parent.height;
      
//       const width = bounds.width;
//       const height = bounds.height;
      
//       const midX = bounds.x + width / 2;
//       const midY = bounds.y + height / 2;
      
//       const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
//       const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

//       svg.transition()
//         .duration(750)
//         .call(zoom.transform, d3.zoomIdentity
//           .translate(translate[0], translate[1])
//           .scale(scale));
//     };

//     return () => {
//       window.removeEventListener("resize", updateDimensions);
//       svg.selectAll("*").remove();
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-screen overflow-hidden touch-none">
//       <svg ref={svgRef} className="w-full h-full"></svg>
      
//       {/* Zoom Controls */}
//       <div className="absolute top-4 right-4 flex flex-col gap-2">
//         <button 
//           onClick={() => window.zoomIn()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom In"
//         >
//           <ZoomIn className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={() => window.zoomOut()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom Out"
//         >
//           <ZoomOut className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={() => window.fitToScreen()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Fit to Screen"
//         >
//           <Maximize className="w-6 h-6" />
//         </button>
//       </div>

//       {/* Properties Panel */}
//       {selectedNode && (
//         <div className="absolute top-4 left-4 w-64 bg-white p-4 rounded-lg shadow-lg">
//           <h3 className="text-lg font-bold mb-2">{selectedNode.label} Properties</h3>
//           <div className="space-y-2">
//             {Object.entries(selectedNode).map(([key, value]) => {
//               if (key !== 'x' && key !== 'y' && key !== 'fx' && key !== 'fy' && key !== 'index' && key !== 'vx' && key !== 'vy') {
//                 return (
//                   <div key={key} className="flex justify-between">
//                     <span className="text-gray-600">{key}:</span>
//                     <span className="font-medium">{value}</span>
//                   </div>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default D3Graph;

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const sampleData = {
  nodes: [
    { id: "1", label: "Customer", name: "Alice" },
    { id: "2", label: "Order", order_id: "1234" },
    { id: "3", label: "Product", product_name: "Widget" },
    { id: "4", label: "Customer", name: "Bob" },
    { id: "5", label: "Order", order_id: "5678" },
    { id: "6", label: "Product", product_name: "Gadget" },
    { id: "7", label: "Customer", name: "Carol" },
    { id: "8", label: "Order", order_id: "9101" },
    { id: "9", label: "Product", product_name: "Tool" },
    { id: "10", label: "Customer", name: "Dave" },
    { id: "11", label: "Order", order_id: "1121" },
    { id: "12", label: "Product", product_name: "Device" }
  ],
  links: [
    { source: "1", target: "2", type: "PLACED" },
    { source: "2", target: "3", type: "CONTAINS" },
    { source: "4", target: "5", type: "PLACED" },
    { source: "5", target: "6", type: "CONTAINS" },
    { source: "7", target: "8", type: "PLACED" },
    { source: "8", target: "9", type: "CONTAINS" },
    { source: "10", target: "11", type: "PLACED" },
    { source: "11", target: "12", type: "CONTAINS" }
  ]
};

const D3Graph = () => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showOnlyCustomers, setShowOnlyCustomers] = useState(false);

  const updateDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    d3.select(svgRef.current).attr("width", width).attr("height", height);
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const padding = 50;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const filteredNodes = showOnlyCustomers
      ? sampleData.nodes.filter(node => node.label === "Customer")
      : sampleData.nodes;

    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = showOnlyCustomers
      ? sampleData.links.filter(link =>
          filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
        )
      : sampleData.links;

    const simulation = d3.forceSimulation(filteredNodes)
      .force("link", d3.forceLink(filteredLinks)
        .id(d => d.id)
        .distance(150))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    const link = g.selectAll(".link")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", d => d.type === "PLACED" ? "#4B0082" : "#DC143C")
      .attr("stroke-width", 2);

    const node = g.selectAll(".node")
      .data(filteredNodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 30)
      .attr("fill", d => colorScale(d.label))
      .style("cursor", "grab")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    const labels = g.selectAll(".label")
      .data(filteredNodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", 14)
      .attr("pointer-events", "none")
      .text(d => d.label === "Customer" ? d.name : d.label === "Order" ? d.order_id : d.product_name);

    const drag = d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = Math.max(padding, Math.min(width - padding, event.x));
        d.fy = Math.max(padding, Math.min(height - padding, event.y));
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    svg.on("click", () => {
      setSelectedNode(null);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x = Math.max(padding, Math.min(width - padding, d.x)))
        .attr("cy", d => d.y = Math.max(padding, Math.min(height - padding, d.y)));

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Zoom control functions
    window.zoomIn = () => {
      svg.transition().call(zoom.scaleBy, 1.5);
    };

    window.zoomOut = () => {
      svg.transition().call(zoom.scaleBy, 0.67);
    };

    window.fitToScreen = () => {
      const bounds = g.node().getBBox();
      const parent = svg.node().getBoundingClientRect();
      const fullWidth = parent.width;
      const fullHeight = parent.height;
      
      const width = bounds.width;
      const height = bounds.height;
      
      const midX = bounds.x + width / 2;
      const midY = bounds.y + height / 2;
      
      const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
      const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity
          .translate(translate[0], translate[1])
          .scale(scale));
    };

    return () => {
      window.removeEventListener("resize", updateDimensions);
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [showOnlyCustomers]);

  return (
    <div className="relative w-full h-screen overflow-hidden touch-none">
      <div className="absolute top-4 left-4 z-10">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnlyCustomers}
            onChange={() => setShowOnlyCustomers(!showOnlyCustomers)}
          />
          <span>Show Only Customers</span>
        </label>
      </div>

      <svg ref={svgRef} className="w-full h-full"></svg>
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => window.zoomIn()}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          title="Zoom In"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
        <button 
          onClick={() => window.zoomOut()}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          title="Zoom Out"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
        <button 
          onClick={() => window.fitToScreen()}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          title="Fit to Screen"
        >
          <Maximize className="w-6 h-6" />
        </button>
      </div>

      {selectedNode && (
        <div className="absolute top-4 left-4 w-64 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">{selectedNode.label} Properties</h3>
          <div className="space-y-2">
            {Object.entries(selectedNode).map(([key, value]) => {
              if (key !== 'x' && key !== 'y' && key !== 'fx' && key !== 'fy' && key !== 'index' && key !== 'vx' && key !== 'vy') {
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default D3Graph;

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import { fetchGraphData } from './neo4jService';
// import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// const D3Graph = () => {
//   const svgRef = useRef();
//   const [data, setData] = useState({ nodes: [], links: [] });
//   const zoomRef = useRef(); // Reference to store zoom instance

//   useEffect(() => {
//     const getData = async () => {
//       const graphData = await fetchGraphData();
//       setData(graphData);
//     };

//     getData();
//   }, []);

//   useEffect(() => {
//     const svg = d3.select(svgRef.current);
//     const { nodes, links } = data;

//     if (nodes.length && links.length) {
//       svg.selectAll("*").remove();
//       const width = svgRef.current.clientWidth;
//       const height = svgRef.current.clientHeight;
//       const g = svg.append("g");

//       // Initialize Zoom Behavior
//       const zoom = d3.zoom()
//         .scaleExtent([0.1, 4]) // Allow zoom between 10% and 400%
//         .on("zoom", (event) => {
//           g.attr("transform", event.transform);
//         });
//       svg.call(zoom);
//       zoomRef.current = zoom;

//       // Draw links (relationships)
//       const link = g.selectAll(".link")
//         .data(links)
//         .enter()
//         .append("line")
//         .attr("class", "link")
//         .attr("stroke", "#999")
//         .attr("stroke-width", 2);

//       // Draw nodes
//       const node = g.selectAll(".node")
//         .data(nodes)
//         .enter()
//         .append("circle")
//         .attr("class", "node")
//         .attr("r", 20)
//         .attr("fill", "#ff7f0e");

//       // Add labels
//       const labels = g.selectAll(".label")
//         .data(nodes)
//         .enter()
//         .append("text")
//         .attr("class", "label")
//         .attr("dy", ".35em")
//         .attr("text-anchor", "middle")
//         .attr("fill", "white")
//         .text(d => d.label || d.name || d.id);

//       // Force Simulation with Positioning
//       const simulation = d3.forceSimulation(nodes)
//         .force("link", d3.forceLink(links).id(d => d.id).distance(100))
//         .force("charge", d3.forceManyBody().strength(-300))
//         .force("center", d3.forceCenter(width / 2, height / 2))
//         .on("tick", () => {
//           // Update positions for links and nodes on each tick
//           link
//             .attr("x1", d => d.source.x)
//             .attr("y1", d => d.source.y)
//             .attr("x2", d => d.target.x)
//             .attr("y2", d => d.target.y);

//           node
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y);

//           labels
//             .attr("x", d => d.x)
//             .attr("y", d => d.y);
//         });

//       // Drag Behavior for Nodes
//       const drag = d3.drag()
//         .on("start", (event, d) => {
//           if (!event.active) simulation.alphaTarget(0.3).restart();
//           d.fx = d.x;
//           d.fy = d.y;
//         })
//         .on("drag", (event, d) => {
//           d.fx = event.x;
//           d.fy = event.y;
//         })
//         .on("end", (event, d) => {
//           if (!event.active) simulation.alphaTarget(0);
//           d.fx = null;
//           d.fy = null;
//         });

//       node.call(drag); // Apply drag behavior to nodes
//     }
//   }, [data]);

//   // Zoom control functions
//   const handleZoomIn = () => {
//     d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.5);
//   };

//   const handleZoomOut = () => {
//     d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.67);
//   };

//   const handleFitToScreen = () => {
//     const g = d3.select(svgRef.current).select("g");
//     const bounds = g.node().getBBox();
//     const svgWidth = svgRef.current.clientWidth;
//     const svgHeight = svgRef.current.clientHeight;

//     const width = bounds.width;
//     const height = bounds.height;
//     const midX = bounds.x + width / 2;
//     const midY = bounds.y + height / 2;

//     const scale = 0.8 / Math.max(width / svgWidth, height / svgHeight);
//     const translate = [svgWidth / 2 - scale * midX, svgHeight / 2 - scale * midY];

//     d3.select(svgRef.current)
//       .transition()
//       .duration(750)
//       .call(
//         zoomRef.current.transform,
//         d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
//       );
//   };

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       <svg ref={svgRef} className="w-full h-full"></svg>
      
//       {/* Zoom Controls */}
//       <div className="absolute top-4 right-4 flex flex-col gap-2">
//         <button 
//           onClick={handleZoomIn}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom In"
//         >
//           <ZoomIn className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={handleZoomOut}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom Out"
//         >
//           <ZoomOut className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={handleFitToScreen}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Fit to Screen"
//         >
//           <Maximize className="w-6 h-6" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default D3Graph;

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import { fetchGraphData } from './neo4jService'; // This should be set up to fetch data from Neo4j
// import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// const D3Graph = () => {
//   const svgRef = useRef();
//   const [data, setData] = useState({ nodes: [], links: [] });
//   const [selectedNode, setSelectedNode] = useState(null);

//   const updateDimensions = () => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     d3.select(svgRef.current).attr("width", width).attr("height", height);
//   };

//   useEffect(() => {
//     const getData = async () => {
//       const graphData = await fetchGraphData();
//       setData(graphData);
//     };

//     getData();
//   }, []);

//   useEffect(() => {
//     updateDimensions();
//     window.addEventListener("resize", updateDimensions);

//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     const padding = 50;

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();
//     const g = svg.append("g");

//     const zoom = d3.zoom()
//       .scaleExtent([0.1, 4])
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });
//     svg.call(zoom);

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     const simulation = d3.forceSimulation(data.nodes)
//       .force("link", d3.forceLink(data.links)
//         .id(d => d.id)
//         .distance(150))
//       .force("charge", d3.forceManyBody().strength(-200))
//       .force("center", d3.forceCenter(width / 2, height / 2))
//       .force("collision", d3.forceCollide().radius(40));

//     const link = g.selectAll(".link")
//       .data(data.links)
//       .enter()
//       .append("line")
//       .attr("class", "link")
//       .attr("stroke", d => d.type === "PLACED" ? "#4B0082" : "#DC143C")
//       .attr("stroke-width", 2);

//     // Add link labels for relationship types
//     const linkLabels = g.selectAll(".link-label")
//       .data(data.links)
//       .enter()
//       .append("text")
//       .attr("class", "link-label")
//       .attr("text-anchor", "middle")
//       .attr("font-size", 12)
//       .attr("fill", "#555")
//       .text(d => d.type);

//     const node = g.selectAll(".node")
//       .data(data.nodes)
//       .enter()
//       .append("circle")
//       .attr("class", "node")
//       .attr("r", 30)
//       .attr("fill", d => colorScale(d.label))
//       .style("cursor", "grab")
//       .on("click", (event, d) => {
//         event.stopPropagation();
//         setSelectedNode(d);
//       });

//     // Updated label logic for displaying node names
//     const labels = g.selectAll(".label")
//       .data(data.nodes)
//       .enter()
//       .append("text")
//       .attr("class", "label")
//       .attr("dy", ".35em")
//       .attr("text-anchor", "middle")
//       .attr("fill", "white")
//       .attr("font-size", 14)
//       .attr("pointer-events", "none")
//       .text(d => {
//         if (d.label === "Customer" && d.customer_name) return d.customer_name;
//         if (d.label === "Order" && d.order_id) return d.order_id;
//         if (d.label === "Product" && d.product_name) return d.product_name;
//         return d.label; // Fallback to label name if specific property is missing
//       });

//     const drag = d3.drag()
//       .on("start", (event, d) => {
//         if (!event.active) simulation.alphaTarget(0.3).restart();
//         d.fx = d.x;
//         d.fy = d.y;
//       })
//       .on("drag", (event, d) => {
//         d.fx = Math.max(padding, Math.min(width - padding, event.x));
//         d.fy = Math.max(padding, Math.min(height - padding, event.y));
//       })
//       .on("end", (event, d) => {
//         if (!event.active) simulation.alphaTarget(0);
//         d.fx = null;
//         d.fy = null;
//       });

//     node.call(drag);

//     simulation.on("tick", () => {
//       link
//         .attr("x1", d => d.source.x)
//         .attr("y1", d => d.source.y)
//         .attr("x2", d => d.target.x)
//         .attr("y2", d => d.target.y);

//       linkLabels
//         .attr("x", d => (d.source.x + d.target.x) / 2)
//         .attr("y", d => (d.source.y + d.target.y) / 2);

//       node
//         .attr("cx", d => d.x = Math.max(padding, Math.min(width - padding, d.x)))
//         .attr("cy", d => d.y = Math.max(padding, Math.min(height - padding, d.y)));

//       labels
//         .attr("x", d => d.x)
//         .attr("y", d => d.y);
//     });

//     // Zoom control functions
//     window.zoomIn = () => {
//       svg.transition().call(zoom.scaleBy, 1.5);
//     };

//     window.zoomOut = () => {
//       svg.transition().call(zoom.scaleBy, 0.67);
//     };

//     window.fitToScreen = () => {
//       const bounds = g.node().getBBox();
//       const parent = svg.node().getBoundingClientRect();
//       const fullWidth = parent.width;
//       const fullHeight = parent.height;
      
//       const width = bounds.width;
//       const height = bounds.height;
      
//       const midX = bounds.x + width / 2;
//       const midY = bounds.y + height / 2;
      
//       const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
//       const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

//       svg.transition()
//         .duration(750)
//         .call(zoom.transform, d3.zoomIdentity
//           .translate(translate[0], translate[1])
//           .scale(scale));
//     };

//     return () => {
//       window.removeEventListener("resize", updateDimensions);
//       simulation.stop();
//       svg.selectAll("*").remove();
//     };
//   }, [data]);

//   const convertNeo4jInt = (value) => {
//     return typeof value === "object" && value.low !== undefined ? value.low : value;
//   };

//   return (
//     <div className="relative w-full h-screen overflow-hidden touch-none">
//       <svg ref={svgRef} className="w-full h-full"></svg>
      
//       <div className="absolute top-4 right-4 flex flex-col gap-2">
//         <button 
//           onClick={() => window.zoomIn()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom In"
//         >
//           <ZoomIn className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={() => window.zoomOut()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Zoom Out"
//         >
//           <ZoomOut className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={() => window.fitToScreen()}
//           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
//           title="Fit to Screen"
//         >
//           <Maximize className="w-6 h-6" />
//         </button>
//       </div>

//       {selectedNode && (
//         <div className="absolute top-4 left-4 w-64 bg-white p-4 rounded-lg shadow-lg">
//           <h3 className="text-lg font-bold mb-2">{selectedNode.label} Properties</h3>
//           <div className="space-y-2">
//             {Object.entries(selectedNode).map(([key, value]) => {
//               if (key !== 'x' && key !== 'y' && key !== 'fx' && key !== 'fy' && key !== 'index' && key !== 'vx' && key !== 'vy') {
//                 return (
//                   <div key={key} className="flex justify-between">
//                     <span className="text-gray-600">{key}:</span>
//                     <span className="font-medium">{convertNeo4jInt(value)}</span>
//                   </div>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default D3Graph;

