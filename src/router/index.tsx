import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import FilterPage, { loader } from "../pages/filter-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <FilterPage />,
        loader,
        hydrateFallbackElement: (
          <div className="grid min-h-screen place-items-center text-sm text-neutral-500">
            Loading...
          </div>
        ),
      },
    ],
  },
]);

export default router;
