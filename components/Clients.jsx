const Clients = ({ clients = [] }) => {
  return (
    <div className="ml-4 bg-white rounded-lg shadow-lg h-[100%] w-[95%] sm:w-[90%] md:w-[50%] lg:w-[20%] px-2 overflow-hidden">
      <div className="overflow-y-auto h-full">
        {clients.map((item) => {
          const firstName = item.username?.split(" ")[0] || "User";

          return (
            <h3
              key={item.id}
              className="text-gray-700 text-sm px-2 w-full truncate"
            >
              <span className="inline lg:hidden">{firstName}</span>
              <span className="hidden lg:inline">{item.username}</span>
            </h3>
          );
        })}
      </div>
    </div>
  );
};

export default Clients;