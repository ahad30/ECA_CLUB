

const Skeleton = () => {


  return (
    <>
    


      <div
        role="status"
        className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="h-7 bg-gray-300 rounded dark:bg-gray-600 w-full mb-3"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="pt-4">
                <td className="flex justify-between mt-5 items-center gap-5">
                  <div className="h-4 w-10 lg:w-24 md:w-12 bg-gray-300 rounded dark:bg-gray-600 mb-2.5"></div>
                  <div className="w-10 lg:w-32 md:w-12 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-10 lg:w-32 md:w-12 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="h-4 w-10 lg:w-24 md:w-12 bg-gray-300 rounded dark:bg-gray-600 mb-2.5"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="sr-only">Loading...</span>
      </div>
        </>
  );
};

export default Skeleton;