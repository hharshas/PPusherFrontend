import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import List from "./list";

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
                      {profile.liked.length ? profile.liked.length : "NULL"}
                    </div>
                  </div>
                </div>
                <List items={profile.liked} />
              </article>
              <article className="flex max-w-xl flex-col items-start justify-between">
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    added Songs
                  </h3>
                  <div className="flex items-center gap-x-4 text-xs">
                    <div className="text-gray-300">
                      {profile.songs.length ? profile.songs.length : "NULL"}
                    </div>
                  </div>
                </div>
                <List items={profile.songs} />
              </article>
              <article className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <time className="text-gray-500">0 </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-600">
                    <span className="absolute inset-0" />
                    {profile.favorite}
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

// <!-- component -->
// <div class="bg-gray-100">
//     <div class="max-w-sm mx-auto my-10">
//         <div class="bg-white shadow-lg rounded-lg overflow-hidden">
//             <ul class="divide-y divide-gray-200">
//                 <li class="p-3 flex justify-between items-center user-card">
//                     <div class="flex items-center">
//                         <img class="w-10 h-10 rounded-full" src="https://unsplash.com/photos/oh0DITWoHi4/download?force=true&w=640" alt="Christy">
//                         <span class="ml-3 font-medium">Christy</span>
//                     </div>
//                     <div>
//                         <button class="text-gray-500 hover:text-gray-700">
//                             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
//                             </svg>
//                         </button>
//                     </div>
//                 </li>
//
//             </ul>
//         </div>
//     </div>
// </div>
