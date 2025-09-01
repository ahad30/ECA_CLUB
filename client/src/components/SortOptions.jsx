import { useComments } from '../context/CommentContext';

const SortOptions = () => {
  const { sortBy, changeSort } = useComments();

  const options = [
    { value: 'newest', label: 'Newest' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-disliked', label: 'Most Disliked' }
  ];

  return (
    <div className="mb-4">
      <label htmlFor="sort" className="mr-2 font-medium">Sort by:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e) => changeSort(e.target.value)}
        className="p-2 border rounded"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;