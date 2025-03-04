import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const RangeSlider = dynamic(() => import("rsuite/RangeSlider"));

const RangeFilter = ({ filter }) => {
  const router = useRouter();
  const onRangeChange = (value) => {
    let newQuery = { ...router.query };

    newQuery.strana = 0;

    newQuery[filter.key] = value;
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  let filterKey = router.query[filter.key];

  if (filterKey) {
    filterKey = filterKey.map((val) => Number(val));
  }

  const [selectedValue, setSelectedValue] = useState();

  useEffect(() => {
    setSelectedValue(
      filterKey?.length === 2
        ? filterKey
        : [Number(filter.params.min), Number(filter.params.max)]
    );
  }, [router.query[filter.key]]);

  return (
    <div>
      <RangeSlider
        min={Number(filter.params.min)}
        max={Number(filter.params.max)}
        value={selectedValue}
        defaultValue={[Number(filter.params.min), Number(filter.params.max)]}
        onChange={(value) => {
          setSelectedValue(value);
        }}
        onChangeCommitted={(value) => {
          setSelectedValue(value);
          onRangeChange(value);
        }}
      />
      <div>
        <span>od: {selectedValue?.[0]}</span>
        <span> do: {selectedValue?.[1]}</span>
      </div>
    </div>
  );
};

export default RangeFilter;
