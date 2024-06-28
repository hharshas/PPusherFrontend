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

// const Profile = () => {
//   const [profile, setprofile] = useState();
//   const { currentUser, userLoggedIn } = useAuth();

//   useEffect(() => {
//     getprofile(currentUser.accessToken, setprofile);
//     // console.log(profile);
//   }, [currentUser]);
//   return (
//     <>
//       {!userLoggedIn && <Navigate to={"/login"} replace={true} />}
//       {"pf"}
//     </>
//   );
// };

export default function Profile() {
  const [profile, setprofile] = useState();
  const { currentUser, userLoggedIn } = useAuth();

  useEffect(() => {
    getprofile(currentUser.accessToken, setprofile);
    // console.log(profile);
  }, [currentUser]);

  return (
    <>
      {!userLoggedIn && <Navigate to={"/login"} replace={true} />}
      {!profile ? (
        <></>
      ) : (
        <div className="bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                aria-hidden="true"
              >
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop stopColor="#7775D6" />
                    <stop offset={1} stopColor="#E935C1" />
                  </radialGradient>
                </defs>
              </svg>
              <h2 className="text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">
                {profile.name.toUpperCase()}
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-400">
                contributed :
                {profile.songs.length ? profile.songs.length : "NULL"}
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <article className="flex max-w-xl flex-col items-start justify-between">
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    Liked Songs
                  </h3>
                  <div className="flex items-center gap-x-4 text-xs">
                    <div className="text-gray-300">
                      {" "}
                      {profile.liked.length ? profile.liked.length : "NULL"}
                    </div>
                  </div>
                </div>
              </article>
              <article className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="text-gray-500">0</div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    added Songs
                  </h3>
                </div>
              </article>
              <article className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <time className="text-gray-500">0 </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    Favotrite song
                  </h3>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// export default Profile;
