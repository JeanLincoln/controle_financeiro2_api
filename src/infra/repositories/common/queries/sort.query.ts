export const sortQuery = (sortBy: string, sortOrder: string) => {
  const hasASubLevel = sortBy.includes(".");

  if (!hasASubLevel) return { [sortBy]: sortOrder };

  const sortObjectArray = sortBy.split(".");
  const formattedObject = sortObjectArray.reduce((acc, key: string, index) => {
    if (index === sortObjectArray.length - 1) {
      return { [key]: sortOrder };
    }

    return { [key]: acc };
  }, {});
  return formattedObject;
};
