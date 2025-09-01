export const sidebarGenerator = (arr) => {
  const sidebarGeneratorModified = arr.reduce((acc, item) => {
    if (item?.path && item.label) {
      acc?.push({
        key: item?.path,
        icon: item?.icon,
        label: item?.label,
        permissionName: item?.permissionName,
      });
    }
    if (item?.children) {
      acc?.push({
        key: item?.label,
        label: item?.label,
        icon: item?.icon,
        children: item?.children.map((child) => ({
          key: child?.path,
          label: child?.label,
          permissionName: child?.permissionName,
        })),
      });
    }
    return acc;
  }, []);
  return sidebarGeneratorModified;
};
