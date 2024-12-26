const WishlistCard = ({ wishlist, onSelect }) => {
    return (
      <div
        onClick={onSelect}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
      >
        <h3 className="text-lg font-bold mb-2">{wishlist.name}</h3>
        <p className="text-sm text-gray-500">
          Erstellt am: {new Date(wishlist.createdAt).toLocaleDateString()}
        </p>
        <button className="mt-2 text-blue-500 hover:text-blue-700">
          Details ansehen
        </button>
      </div>
    );
  };
  
  export default WishlistCard;
  