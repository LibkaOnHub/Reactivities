import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// načtení modulu s hlavní komponetou
import App from './App.tsx'

// font pro Material UI
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// vložení hlavní komponenty do HTML prvku root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
