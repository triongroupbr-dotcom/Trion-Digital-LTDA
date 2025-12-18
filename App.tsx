import React from "react";
import FunnelController from "./components/FunnelController";

const App: React.FC = () => {
  return (
    <div className="antialiased min-h-screen bg-black text-red-400">
      <FunnelController />
    </div>
  );
};

export default App;