import { Select } from 'antd';

const SortOptions = ({ value, onChange, options = [] }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="font-medium text-gray-700">Sort by:</label>
      <Select
        value={value}
        onChange={onChange}
        style={{ minWidth: 160 }}
        options={options}
      />
    </div>
  );
};

export default SortOptions;