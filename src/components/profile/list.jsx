const List = ({ items, files }) => {
  console.log("rendering list");
  if (items) {
    console.log(items);
  } else {
    console.log(files);
    const newarr = files.map((item, index) => {
      return { name: item.fileName };
    });
    items = newarr;
    console.log(items);
  }

  const listitems = items.map((item, index) => {
    return (
      <li
        key={index}
        className="p-3 flex justify-between items-center user-card"
      >
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full"
            src="https://unsplash.com/photos/oh0DITWoHi4/download?force=true&w=640"
            alt="Christy"
          />
          <span className="ml-3 font-medium">{item.name}</span>
        </div>
        <div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </li>
    );
  });

  return (
    <div className=" max-w-full min-w-72  mx-auto my-10">
      <div className="bg-gray-700 shadow-lg rounded-lg overflow-scroll">
        <ul className="divide-y divide-gray-700">{listitems} </ul>
      </div>
    </div>
  );
};

export default List;
