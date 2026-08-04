import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="max-w-3xl mx-auto -mt-10 bg-white shadow-lg rounded-xl p-3 flex">

      <input
        type="text"
        placeholder="Search jobs..."
        className="flex-1 outline-none px-4"
      />

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
        <Search size={20} />
        Search
      </button>

    </div>
  );
};

export default SearchBar;