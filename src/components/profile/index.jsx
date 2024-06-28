import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";

const getprofile = async (token, setprofile) => {
  const headers = {
    accesstoken: token,
  };

  try {
    const res = await axios.get(
      "https://ppusherbackend-u9sl.onrender.com/api/profile/me",
      {
        headers,
      }
    );
    console.log(res);
    setprofile(res.data);
  } catch (err) {
    console.log(err);
  }
};

const Profile = () => {
  const [profile, setprofile] = useState();
  const { currentUser, userLoggedIn } = useAuth();

  useEffect(() => {
    getprofile(currentUser.accessToken, setprofile);
    // console.log(profile);
  }, [currentUser]);
  return (
    <>
      {!userLoggedIn && <Navigate to={"/login"} replace={true} />}
      {"pf"}
    </>
  );
};

export default Profile;
