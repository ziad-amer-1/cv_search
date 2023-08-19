import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { HashRouter } from "react-router-dom"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css"

axios.defaults.baseURL = "http://127.0.0.1:5000"
axios.defaults.headers.common["Authorization"] =
  window.localStorage.getItem("token")

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
