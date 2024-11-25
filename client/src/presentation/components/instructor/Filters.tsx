const Filters: React.FC = () => {
    return (
      <select className="bg-white border rounded-md p-2 text-sm">
        <option value="all">All Categories</option>
        <option value="development">Development</option>
        <option value="design">Design</option>
      </select>
    );
  };
  
  export default Filters;
  