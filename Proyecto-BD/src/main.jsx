import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SaveImage from "./componentes/SaveImage.jsx";
import Home from "./componentes/Home.jsx";
import BooksData from "./componentes/BooksData";
import InsertBooks from "./componentes/InsertBooks";
import Login from "./componentes/Login";
import Register from "./componentes/Register";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/val1",
    element: <InsertBooks />,
  },
  {
    path: "/val2",
    element: <SaveImage />,
  },
  {
    path: "/val3",
    element: <BooksData />,
  },
  {
    path: "/val4",
    element: <Login />,
  },
  {
    path: "/val5",
    element: <Register/>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
