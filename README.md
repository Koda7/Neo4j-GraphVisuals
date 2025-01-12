# Graph Visualization Project

This project provides an interactive graph visualization interface using D3.js. Currently, it uses sample data for testing purposes, with plans to integrate Neo4j database connectivity in the future.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Current Implementation

- The application currently uses sample data defined in the code
- Interactive graph visualization with D3.js
- Features:
  - Zoom in/out functionality
  - Fit to screen
  - Node dragging
  - Node selection with property display
  - Filter view (show only customers)

## Future Plans

- Integration with Neo4j database
- Additional filtering options
- Enhanced relationship visualization
- Custom styling options

## Notes

The Neo4j connection functionality is commented out in the code. Once the Neo4j integration is ready, the connection details will need to be updated with your Neo4j instance information.