

export const routesGenerator = (Routes) => {
  const routeGenerator = Routes.reduce((acc, item) => {
    if (item.path) {
      acc.push({ path: item.path, element: item.element });
    }
    if (item.children) {
      item.children.forEach((i) => {
        acc.push({ path: i.path, element: i.element });
      });
    }
    return acc;
  }, []);
  return routeGenerator;
};
