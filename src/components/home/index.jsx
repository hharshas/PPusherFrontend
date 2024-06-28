import React from "react";
import { useAuth } from "../../contexts/authContext";
import { auth } from "../../firebase/firebase";
import { Navigate, Link } from "react-router-dom";

const Home = () => {
  const { currentUser, userLoggedIn } = useAuth();
  // console.log(currentUser)
  return (
    <div className="text-2xl font-bold pt-14">
      Hello{" "}
      {currentUser.displayName ? currentUser.displayName : currentUser.email},
      you are now logged in.
    </div>
  );
};

export default Home;
