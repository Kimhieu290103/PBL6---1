import Login from "./pages/login/Login";
import Register from "./pages/register/Register"; // Có thể bỏ nếu không cần
import Chat from "./pages/DaiVietChat/DaiVietChat";
import CharacterSelection from "./pages/CharacterSelection/CharacterSelection";
import PaymentPage from "./pages/PaymentPage/PaymentPage"
import ChangePass from "./pages/ChangePass/ChangePass"
import Recharge from "./pages/Recharge/Recharge"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const queryClient = new QueryClient();

  const LayoutWithoutBars = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
     // return <Navigate to="/login"/>;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><LayoutWithoutBars /></ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <CharacterSelection />,
        },
        {
          path: "/chat/:id",
          element: <Chat />,
        },
        {
          path: "/changepass",
          element: <ChangePass />,
        },
        {
          path: "/payment/:id", // Nếu không cần, có thể xóa dòng này
          element: <PaymentPage />,
        },
        {
          path: "/recharge", // Nếu không cần, có thể xóa dòng này
          element: <Recharge />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register", // Nếu không cần, có thể xóa dòng này
      element: <Register />,
    },

  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
