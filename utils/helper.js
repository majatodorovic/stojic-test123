export const generateFilterForBody = (query, filterList) => {
  let filters = [];
  if (Array.isArray(filterList)) {
    filterList.forEach((item) => {
      if (query[item.key]) {
        filters.push({
          column: item.key,
          value: {
            selected: Array.isArray(query[item.key])
              ? query[item.key]
              : [query[item.key]],
          },
        });
      }
    });
  }
  return filters;
};

export const generateBody = ({ query, filters }) => {
  const filterForBody = generateFilterForBody(query, filters);

  let bodyData = {};

  bodyData = {
    ...bodyData,
    limit: query?.prikaz ? Number(query?.prikaz) : 24,
  };

  bodyData = { ...bodyData, page: query?.strana ? Number(query?.strana) : 0 };

  bodyData = {
    ...bodyData,
    filters: filterForBody.length > 0 ? filterForBody : [],
  };

  if (query?.redosled) {
    let field;
    let direction;
    switch (query?.redosled) {
      case "cena_rastuce":
        field = "price";
        direction = "asc";
        break;
      case "cena_opadajuce":
        field = "price";
        direction = "desc";
        break;
      case "novo":
        field = "new";
        direction = "asc";
        break;
      case "staro":
        field = "new";
        direction = "desc";
        break;
      case "naziv_rastuce":
        field = "name";
        direction = "asc";
        break;
      case "naziv_opadajuce":
        field = "name";
        direction = "desc";
        break;
      case "na_stanju_rastuce":
        field = "inventory";
        direction = "asc";
        break;
      case "na_stanju_opadajuce":
        field = "inventory";
        direction = "desc";
        break;
      default:
        break;
    }

    bodyData = { ...bodyData, sort: { field, direction } };
  } else {
    bodyData = { ...bodyData, sort: { field: "", direction: "" } };
  }

  if (Object.keys(bodyData).length === 0) {
    return false;
  }

  return (bodyData = {
    ...bodyData,
    render: false,
  });
};
