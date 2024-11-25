interface SearchBarProps {
    onSearch: (term: string) => void;
  }
  
  const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
      <div className="flex items-center gap-2 bg-white rounded-md shadow-sm p-2">
        <input
          type="text"
          placeholder="Search in your courses..."
          className="w-full px-4 py-2 outline-none text-sm border-none"
          onChange={(e) => onSearch(e.target.value)}
        />
        <button className="p-2 text-gray-600">
          <i className="material-icons">search</i>
        </button>
      </div>
    );
  };
  
  export default SearchBar;
  