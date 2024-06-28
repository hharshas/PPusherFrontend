import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Landing from "./components/landing";
import Header from "./components/header";
import Home from "./components/home";
import Profile from "./components/profile";
import Upload from "./components/upload";
import { SocketProvider } from "./components/socketcontext";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Landing />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/upload",
      element: <Upload />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <SocketProvider>
      <AuthProvider>
        <Header />
        <AnimatePresence mode="wait">
          <div className="w-full bg-gray-900 h-screen flex flex-col">
          {routesElement}
        </div>
        </AnimatePresence>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App;
