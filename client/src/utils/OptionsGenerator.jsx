
export const OptionsGenerator = (arr) => {
  if (Array.isArray(arr)) {
    const options = arr?.map((item) => ({
      value: item?.name,
      label: item?.name,
    }));
    return options;
  } else {
    return [];
  }
};
