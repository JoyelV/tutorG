const SortBy: React.FC = () => {
    return (
      <select className="bg-white border rounded-md p-2 text-sm">
        <option value="latest">Latest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    );
  };
  
  export default SortBy;
  