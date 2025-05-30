import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./components/AuthContext/AuthContext";



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Provider store={store}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </Provider>
      </BrowserRouter>
    </AuthProvider>    
  </React.StrictMode>
);
    
