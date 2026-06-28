import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MathJaxContext } from 'better-react-mathjax'
import App from './App'
import './styles/globals.css'

const mathJaxConfig = {
  loader: { load: ['[tex]/ams', '[tex]/boldsymbol'] },
  tex: {
    packages: { '[+]': ['ams', 'boldsymbol'] },
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MathJaxContext config={mathJaxConfig} version={3}>
        <App />
      </MathJaxContext>
    </BrowserRouter>
  </React.StrictMode>,
)
