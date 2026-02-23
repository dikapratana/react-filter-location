import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import FilterPage from "../pages/filter-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <FilterPage />,
      },
    ],
  },
]);

export default router;
