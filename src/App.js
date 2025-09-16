import React from 'react';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css';
import Header from './pages/includes/Header.js';
import Footer from './pages/includes/Footer.js';
import RoutePath from "./routes/RoutePath";

function App() {
  console.log('public url: ', process.env.PUBLIC_URL)
  return (
    <div className="App">
      <BrowserRouter>
       <Header/>
       <RoutePath />
       <Footer/>

      </BrowserRouter>

      
    </div>
  );
}

export default App;
