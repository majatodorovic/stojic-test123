import { useRouter } from "next/router";
import styles from "../Filter.module.scss";

const CheckboxFilter = ({ filter }) => {
  const router = useRouter();

  const checkedChanged = ({ target }) => {
    let newQuery = { ...router.query };

    let currentValues = newQuery[filter.key]
      ? Array.isArray(newQuery[filter.key])
        ? [...newQuery[filter.key]]
        : [newQuery[filter.key]]
      : [];

    if (target.checked) {
      if (!currentValues.includes(target.value)) {
        currentValues.push(target.value);
      }
    } else {
      currentValues = currentValues.filter((val) => val !== target.value);
    }

    if (currentValues.length > 0) {
      newQuery[filter.key] = currentValues;
    } else {
      delete newQuery[filter.key];
    }

    newQuery.strana = 0;

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {(filter?.params?.items ?? []).map((item) => {
        const filterKey = router.query[filter.key];

        let checked;

        if (
          filterKey &&
          ((Array.isArray(filterKey) &&
            filterKey.find((i) => i === item.key)) ||
            filterKey === item.key)
        ) {
          checked = 1;
        } else checked = 0;

        return (
          <div key={item.id}>
            <input
              type="checkbox"
              name={item.label}
              checked={checked}
              onChange={(e) => {
                checkedChanged(e);
              }}
              value={
                filter?.params?.use_field
                  ? item[filter?.params?.use_field]
                  : item.key
              }
              id={`chbx-${item.id}`}
            />
            <label className={styles.checkboxLabel} htmlFor={`chbx-${item.id}`}>
              {item.label}
            </label>
          </div>
        );
      })}
    </>
  );
};

export default CheckboxFilter;
