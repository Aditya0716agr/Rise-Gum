import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RiseGumLanding from "./components/RiseGumLanding";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RiseGumLanding />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;