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

    // Create SVG and add zoom behavior
    const svg = d3.select(svgRef.current);
    const g = svg.append("g");
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation(sampleData.nodes)
      .force("link", d3.forceLink(sampleData.links).id(d => d.id).distance(200))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = g.selectAll(".link")
      .data(sampleData.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", d => d.type === "PLACED" ? "#4B0082" : "#DC143C")
      .attr("stroke-width", 2);

    const linkLabels = g.selectAll(".link-label")
      .data(sampleData.links)
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", "#555")
      .text(d => d.type);

    const node = g.selectAll(".node")
      .data(sampleData.nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 30)
      .attr("fill", d => colorScale(d.label))
      .style("cursor", "grab")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

    const labels = g.selectAll(".label")
      .data(sampleData.nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", 14)
      .text(d => d.label === "Customer" ? d.name : d.label === "Order" ? d.order_id : d.product_name);

    // Click on background to deselect node
    svg.on("click", () => {
      setSelectedNode(null);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", d => (d.x = Math.max(30, Math.min(width - 30, d.x))))
        .attr("cy", d => (d.y = Math.max(30, Math.min(height - 30, d.y))));

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function dragStarted(event, d) {
      event.sourceEvent.stopPropagation();
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(event.sourceEvent.target).style("cursor", "grabbing");
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(event.sourceEvent.target).style("cursor", "grab");
    }

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
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <svg ref={svgRef} className="w-full h-full"></svg>
      
      {/* Zoom Controls */}
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

      {/* Properties Panel */}
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
`test`
export default D3Graph;