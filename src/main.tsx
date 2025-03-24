import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProblemPage from "./pages/Problem";
import ProblemsPage from "./pages/Problems.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import SignUp from "./components/authentication/Signup.tsx";
import AuthLayout from "./components/common/AuthLayout.tsx";
import Login from "./components/authentication/Login.tsx";
import Home from "./pages/Home.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ErrorPage from "./pages/ErrorPage";
import AdminApp from "./AdminApp.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import AdminSignIn from "./pages/Admin/AdminSignIn.tsx";
import AdminProblems from "./pages/Admin/AdminProblems.tsx";
import AdminUsers from "./pages/Admin/AdminUsers.tsx";
import AdminAuthLayout from "./components/common/AdminAuthLayout.tsx";
import AdminContests from "./pages/Admin/AdminContests.tsx";
import ContestsPage from "./pages/Contests.tsx";
import ContestPage from "./pages/Contest.tsx";
import ContestRankings from "./pages/ContestRankings.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // Optional: adds a default route for "/"
        element: (
          <AuthLayout authentication={false}>
            <Home />
          </AuthLayout>
        ), // Change this to your desired default component
      },
      {
        path: "problems",
        element: (
          <AuthLayout authentication={true}>
            <ProblemsPage />
          </AuthLayout>
        ),
      },
      {
        path: "contests",
        element: (
          <AuthLayout authentication={true}>
            <ContestsPage />
          </AuthLayout>
        ),
      },
      {
        path: "contests/:contestId",
        element: (
          <AuthLayout authentication={true}>
            <ContestPage />
          </AuthLayout>
        ),
      },
      {
        path: "contests/:contestId/rankings",
        element: (
          <AuthLayout authentication={true}>
            <ContestRankings />
          </AuthLayout>
        ),
      },
      {
        path: "problems/:problemId",
        element: (
          <AuthLayout authentication={true}>
            <ProblemPage />
          </AuthLayout>
        ),
      },
      {
        path: "sign-up",
        element: (
          <AuthLayout authentication={false}>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "dashboard",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: "*", // Catch-all for undefined routes
        element: <ErrorPage />, // Replace with your 404 component
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminApp />,
    children: [
      {
        path: "/admin/dashboard",
        element: (
          <AdminAuthLayout authentication={true}>
            <AdminDashboard />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/signin",
        element: (
          <AdminAuthLayout authentication={false}>
            <AdminSignIn />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <AdminAuthLayout authentication={true}>
            <AdminUsers />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/problems",
        element: (
          <AdminAuthLayout authentication={true}>
            <AdminProblems />
          </AdminAuthLayout>
        ),
      },
      {
        path: "/admin/contests",
        element: (
          <AdminAuthLayout authentication={true}>
            <AdminContests />
          </AdminAuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
