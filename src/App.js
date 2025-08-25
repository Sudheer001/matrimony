import React from 'react';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css';
import Header from './pages/includes/Header.js';
import Footer from './pages/includes/Footer.js';
import Home from './pages/Home.js';
import MatrimonyForm from './pages/MatrimonyForm.js';
import ProfileView from "./pages/ProfileView.js";
// import About from './pages/About.js';
// import Services from './pages/Services.js';
// import Tariff from './pages/Tariff.js';
// import GalleryPage from './pages/GalleryPage.js';
// import Contact from './pages/Contact.js';

function App() {
  console.log('public url: ', process.env.PUBLIC_URL)
  return (
    <div className="App">
      <BrowserRouter>
       <Header/>
      <Routes>
         <Route path={process.env.PUBLIC_URL+'/'} element={<Home/>} />
         <Route path={process.env.PUBLIC_URL+'/Matrimony'} element={<MatrimonyForm/>} />
         <Route path={process.env.PUBLIC_URL+"/profile/:id"} element={<ProfileView />} />
         {/* 
         <Route path={process.env.PUBLIC_URL+'/Services'} element={<Services/>} />
         <Route path={process.env.PUBLIC_URL+'/Tariff'} element={<Tariff/>} />
         <Route path={process.env.PUBLIC_URL+'/GalleryPage'} element={<GalleryPage/>} />
         <Route path={process.env.PUBLIC_URL+'/Contact'} element={<Contact/>} /> */}
      </Routes>
       <Footer/>

      </BrowserRouter>

      
    </div>
  );
}

export default App;
