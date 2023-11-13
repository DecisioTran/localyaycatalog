import { RouterProvider, createHashRouter } from "react-router-dom";
import CatalogList from "./catalog/CatalogList";
import CatalogDetail from "./catalog/CatalogDetail";
import CatalogNew from "./catalog/CatalogNew";
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPageBoundary from "./utils/ErrorPageBoundary";
import ErrorPage from "./utils/ErrorPage";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <ErrorBoundary FallbackComponent={ErrorPageBoundary}><CatalogList /></ErrorBoundary>,
    },
    {
      path: "/catalog",
      element: <ErrorBoundary FallbackComponent={ErrorPageBoundary}><CatalogList /></ErrorBoundary>
    },
    {
      path: "/catalog/:id",
      element: <ErrorBoundary FallbackComponent={ErrorPageBoundary}><CatalogDetail /></ErrorBoundary>
    },
    {
      path: "/catalog/new",
      element: <ErrorBoundary FallbackComponent={ErrorPageBoundary}><CatalogNew /></ErrorBoundary>
    },
    {
      path: "*",
      element: <ErrorPage />
    }
  ],
  {
    future: {
      v7_fetcherPersist: true,
    },
  }
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
