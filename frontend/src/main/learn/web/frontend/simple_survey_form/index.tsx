import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import App from './App';
import AppII from "./AppII";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppII/>
  </StrictMode>,
)
