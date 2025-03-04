import Accordion from "react-bootstrap/Accordion";
import Image from "next/legacy/image";
import Filter from "./Filter/Filter";
import { useRouter } from "next/router";

const Filters = ({ filters }) => {
  const router = useRouter();
  return (
    <div className={`${"filters-holder"}`}>
      <div className={`${"reset-filters"}`}>
        <p
          style={{ cursor: "pointer" }}
          onClick={() => {
            const cleanPath = router.asPath.split("?")[0];
            router.push(cleanPath, undefined, { shallow: true });
          }}
        >
          Resetuj filtere{" "}
          <span className="reset-image">
            <Image
              src="/images/reset.webp"
              alt=""
              className="image"
              width={15}
              height={15}
            />
          </span>
        </p>
      </div>
      <div className={`${"filters"}`}>
        {(filters ?? []).map((filter) => (
          <Accordion defaultActiveKey="0" key={filter.key}>
            <Accordion.Item
              eventKey={filter.key}
              className={`${"custom-accordion"}`}
            >
              <Accordion.Header className={`${"custom-header"}`}>
                <p>{filter.name}</p>
              </Accordion.Header>
              <Accordion.Body>
                <Filter filter={filter} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
        {/* {showSearch && <button onClick={searchProducts}>Pretraži</button>}
        <div className='styleCheckBox'>
          <input
            type='checkbox'
            name='change-filters'
            id='change-filters'
            checked={changeFilters}
            onChange={() => setChangeFilters(!changeFilters)}
          />
          <label htmlFor='change-filters'>Smanjuj filtere</label>
        </div>
        <div className='styleCheckBox'>
          <input
            type='checkbox'
            name='search-button'
            id='search-button'
            checked={showSearch}
            onChange={() => setShowSearch(!showSearch)}
          />
          <label htmlFor='search-button'>Prikazi dugme za pretragu</label>
        </div> */}
      </div>
    </div>
  );
};

export default Filters;
