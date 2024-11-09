import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProblemPage from './pages/Problem';
import ProblemsPage from './pages/Problems.tsx';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import SignUp from './components/authentication/Signup.tsx';
import AuthLayout from "./components/common/AuthLayout.tsx";
import Login from './components/authentication/Login.tsx';
import Home from './pages/Home.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // Optional: adds a default route for "/"
        element: <AuthLayout authentication={false}><Home /></AuthLayout>, // Change this to your desired default component
      },
      {
        path: "problems",
        element: <AuthLayout authentication={true}><ProblemsPage /></AuthLayout>,
      },
      {
        path: "problems/:problemId",
        element: <AuthLayout authentication={true}><ProblemPage /></AuthLayout>,
      },
      {
        path: "sign-up",
        element: <AuthLayout authentication={false}><SignUp /></AuthLayout>,
      },
      {
        path: "login",
        element: <AuthLayout authentication={false}><Login /></AuthLayout>,
      },
      {
        path: "dashboard",
        element: <AuthLayout authentication={true}><Dashboard /></AuthLayout>,
      },
      {
        path: "*", // Catch-all for undefined routes
        element: <ErrorPage/>, // Replace with your 404 component
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
