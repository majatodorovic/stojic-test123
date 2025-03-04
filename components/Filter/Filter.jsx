import CheckboxFilter from "./components/CheckboxFilter";
import RangeFilter from "./components/RangeFilter";

const Filter = ({ filter }) => {
  switch (filter.type) {
    case "range":
      return <RangeFilter filter={filter} />;
    default:
      return <CheckboxFilter filter={filter} />;
  }
};

export default Filter;
