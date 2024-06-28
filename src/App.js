import Login from "./components/auth/login";
import Register from "./components/auth/register";

import Landing from "./components/landing";
import Header from "./components/header";
import Home from "./components/home";
import Profile from "./components/profile";
import Upload from "./components/upload";
import { SocketProvider } from "./components/socketcontext";

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
    }
  ];
  let routesElement = useRoutes(routesArray);
  return (
<<<<<<< HEAD
    <AuthProvider>
      <Header />
      <div className="w-full bg-gray-900 h-screen flex flex-col">
        {routesElement}
      </div>
    </AuthProvider>
=======
    <SocketProvider>
      <AuthProvider>
        <Header />
        <div className="w-full h-screen flex flex-col">{routesElement}</div>
      </AuthProvider>
    </SocketProvider>

>>>>>>> e58eaba9790816af43279b545b868d3558e5655f
  );
}

export default App;
