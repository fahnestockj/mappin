import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './pages';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
