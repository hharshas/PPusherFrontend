import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import List from "./list";
import { initDB, getAllSongs, saveSongToDB } from "../../indexeddb/index";

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

const setcurrentsongs = async (setSongs) => {
  const songs = await getAllSongs();
  setSongs(songs);
  console.log(songs);
};

export default function Profile() {
  const [profile, setprofile] = useState();
  const { currentUser, userLoggedIn } = useAuth();
  const [songs, setSongs] = useState();

  useEffect(() => {
    getprofile(currentUser.accessToken, setprofile);
    setcurrentsongs(setSongs);
  }, [currentUser]);

  return (
    <>
      {!userLoggedIn && <Navigate to={"/login"} replace={true} />}
      {!profile ? (
        <></>
      ) : (
        <div className="bg-gray-900">
          <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
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
              <div className=" flex-col">
                <div>
                  <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:pt-32 lg:text-left">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">
                      {profile.name.toUpperCase()}
                    </h2>
                  </div>
                </div>
                <div>
                  <div className="mx-auto  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16  sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    <article className="flex max-w-xl flex-col items-start ">
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-600">
                          <span className="absolute inset-0" />
                          Liked Songs
                        </h3>
                      </div>
                      <List items={profile.liked} />
                    </article>
                    <article className="flex max-w-xl flex-col items-start ">
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-600">
                          <span className="absolute inset-0" />
                          added Songs
                        </h3>
                      </div>
                      <List items={profile.songs} />
                    </article>
                    <article className="flex max-w-xl flex-col items-start ">
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-600">
                          <span className="absolute inset-0" />
                          current seeds
                        </h3>
                      </div>
                      <List files={songs} />;
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// {/* <div className="bg-gray-900">
//   <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
//     <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
//       <svg
//         viewBox="0 0 1024 1024"
//         className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
//         aria-hidden="true"
//       >
//         <circle
//           cx={512}
//           cy={512}
//           r={512}
//           fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
//           fillOpacity="0.7"
//         />
//         <defs>
//           <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
//             <stop stopColor="#7775D6" />
//             <stop offset={1} stopColor="#E935C1" />
//           </radialGradient>
//         </defs>
//       </svg>
//       <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">

//       </div>
//     </div>
//   </div>
// </div>; */}

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
