import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MetricPage from "./pages/MetricPage/MetricPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import ProductEdit from "./pages/ProductEdit/ProductEdit";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/products/:id" element={<ProductEdit />} />
              <Route path="/metrics" element={<MetricPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
