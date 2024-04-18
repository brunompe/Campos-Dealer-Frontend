import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Customers from "./pages/Customers.tsx";
import Sales from "./pages/Sales.tsx";
import Products from "./pages/Products.tsx";
import App from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/sales",
        element: <Sales />,
      },
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="bg-[#151518] text-[#A1A1AA] min-h-screen ">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
