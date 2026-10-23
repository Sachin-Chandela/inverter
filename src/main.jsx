import { render } from 'preact'
import './index.css'
import App from './App.jsx'
import './css/Login.css'

import { BrowserRouter } from 'react-router-dom'

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)