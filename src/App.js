// // src/App.js
// import React from 'react';
// import GraphExplorer from './components/GraphExplorer';
// import './App.css';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         <GraphExplorer />
//       </div>
//     </div>
//   );
// }

// export default App;

import React from "react";
import NeovisTest from "./NeovisTest";

const App = () => {
  return (
    <div>
      <h1>Testing Neovis.js Connection</h1>
      <NeovisTest />
    </div>
  );
};

export default App;
