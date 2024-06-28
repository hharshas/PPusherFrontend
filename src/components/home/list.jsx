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
        className="p-3 flex justify-between items-center user-card hover:bg-gray-800"
      >
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full sm:block hidden"
            src="https://icon-library.com/images/song-icon-png/song-icon-png-25.jpg"
            alt="Christy"
          />
          <span className="ml-3 font-medium">{item.fileName}</span>
        </div>
          <audio className="w-[120px] mx-4" controls>
            <source src={item.dataURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
      </li>
    );
  });

  return (
    <div className=" max-w-full min-w-72  mx-auto my-10">
      <div className=" shadow-lg rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-700">{listitems} </ul>
      </div>
    </div>
  );
};

export default List;
