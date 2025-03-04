import dynamic from "next/dynamic";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import Loader from "rsuite/Loader";
import classes from "./CategoriesPage.module.scss";
import { ApiHandler } from "../../helpers/api";
import { queryKeys, sortKeys } from "../../helpers/const";
import { generateBody } from "../../utils/helper";

const Breadcrumbs = dynamic(() => import("../../components/Breadcrumbs"));
const Filters = dynamic(() => import("../../components/Filters"));
const ProductBoxComplexSmall = dynamic(() =>
  import("../../components/ProductBoxComplexSmall")
);
const Seo = dynamic(() => import("../../components/Seo/Seo"));

const CategoriesPage = ({ categoryData, productsItems, filters }) => {
  const router = useRouter();
  const api = ApiHandler();

  const { asPath, query, isReady } = router;
  const {} = router;

  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sort, setSort] = useState(null);
  const [limit, setLimit] = useState(24);

  useEffect(() => {
    if (!filters && !isReady) return;

    const bodyData = generateBody({ query, filters });

    if (!bodyData) {
      setProductsData(productsItems);
      return;
    }

    if (bodyData.sort) setSort(bodyData.sort);
    if (bodyData.limit) setLimit(bodyData.limit);

    setIsLoading(true);
    api
      .list(`products/category/list/${categoryData?.id}`, { ...bodyData })
      .then((response) => {
        if (response?.payload) setProductsData(response?.payload);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [query, filters, isReady]);

  const pushQuery = (newQuery) => {
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const [page, setPage] = useState(
    query[queryKeys.page] ? parseInt(query[queryKeys.page]) : 1
  );

  const products = productsData?.items;
  const pagination = productsData?.pagination;

  useEffect(() => {
    setProductsData(productsItems);
  }, [router.isFallback]);

  const onSortChange = ({ target }) => {
    const newQuery = query;

    if (target.value != "none") {
      newQuery[queryKeys.sort] = sortKeys[target.value].query;
      newQuery[queryKeys.page] = 1;
      pushQuery(newQuery);
      const [field, direction] = target.value?.split("_");
      setSort({ field, direction });
    } else {
      delete newQuery[queryKeys.sort];
      newQuery[queryKeys.page] = 1;
      pushQuery(newQuery);
      setSort(null);
    }
    setPage(1);
  };

  const onLimitChange = ({ target }) => {
    const newQuery = query;
    newQuery[queryKeys.limit] = target.value;
    newQuery[queryKeys.page] = 1;

    pushQuery(newQuery);

    setLimit(target.value);
    setPage(1);
  };

  const onPageChange = (num) => {
    const newQuery = query;
    newQuery[queryKeys.page] = num;

    pushQuery(newQuery);

    setPage(num);
  };

  if (router.isFallback) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader center content="Loading..." vertical size="lg" />
      </div>
    );
  }
  return (
    <>
      <Seo
        title={categoryData?.basic_data?.name}
        description={`${categoryData?.seo?.description}`}
        ogtitle={`${categoryData?.seo?.title}`}
        ogdescription={`${categoryData?.seo?.description}`}
        ogimage={
          categoryData?.seo.image !== null
            ? categoryData?.seo?.image
            : categoryData?.images?.image
        }
        ogurl={
          categoryData?.seo.url !== null
            ? categoryData?.seo?.url
            : `${process.env.BASE_URL}kategorije/${categoryData?.parents[0]?.id}/${categoryData?.id}`
        }
      />
      <div className={`${classes.categoriespage}`}>
        <div className={`${classes.catBanner}`}>
          <div className="container-fluid">
            {categoryData?.images?.image ? (
              <Image
                src={categoryData.images.image}
                alt={categoryData.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <Image
                src="/images/cartBanner.webp"
                alt="Stojic Elektrik doo"
                layout="fill"
                objectFit="cover"
              />
            )}
            <div className={`${classes.title}`}>
              <h5>{categoryData?.basic_data?.name}</h5>
            </div>
          </div>
        </div>
        <div className="container">
          <Breadcrumbs
            crumbs={categoryData?.parents || []}
            end={{ label: categoryData?.basic_data?.name, path: asPath }}
          />

          <div className={`${classes["mobile-display"]}`}>
            <Accordion className={`${classes["filters-mobile-holder"]}`}>
              <Accordion.Item eventKey="0">
                <Accordion.Header
                  className={`${classes["mobile-filters-heading"]}`}
                >
                  Filteri
                </Accordion.Header>
                <Accordion.Body>
                  <Filters filters={filters} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="row">
            <div className="col-xl-3 col-md-3 col-12">
              <div className={`${classes["desktop-display"]}`}>
                <Filters filters={filters} />
              </div>
            </div>
            <div
              className={`${classes["right-side-container"]} col-xl-9 col-lg-9 col-12 col-sm-12 col-xs-12`}
            >
              <div className={`${classes.controls} row`}>
                <div
                  className={`${classes["number-of-products"]} col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12`}
                >
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <span>
                      {pagination?.total_items}{" "}
                      {pagination?.total_items !== 1 ? "proizvoda" : "proizvod"}
                    </span>
                  )}
                </div>
                <div
                  className={`${classes["sort-container"]} col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6`}
                >
                  <span>Sortiraj:</span>
                  <span>
                    <select
                      name="sort"
                      id="sort"
                      className={classes.select}
                      onChange={onSortChange}
                      value={sort ? `${sort.field}_${sort.direction}` : "none"}
                    >
                      <option
                        value="none"
                        className={`${classes["sort-title"]}`}
                      >
                        Sortirajte
                      </option>
                      {Object.entries(sortKeys).map((item) => (
                        <option value={item[0]} key={item[0]}>
                          {item[1].label}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
                <div
                  className={`${classes["products-per-page"]} col-xl-5 col-lg-4 col-md-3 col-sm-6 col-6`}
                >
                  <span>Prikaži:</span>
                  <span className={classes["select-span"]}>
                    <select
                      name="limit"
                      id="limit"
                      className={classes.select}
                      onChange={onLimitChange}
                      value={limit}
                    >
                      <option value={4} key="4">
                        4
                      </option>
                      <option value={8} key="8">
                        8
                      </option>
                      <option value={12} key="12">
                        12
                      </option>
                      <option value={24} key="24">
                        24
                      </option>
                      <option value={36} key="36">
                        36
                      </option>
                    </select>
                  </span>
                  <span>po strani</span>
                </div>
                {isLoading ? (
                  <div className="gif">
                    <Image
                      src="/images/loading-buffering.gif"
                      alt="Loading"
                      width={200}
                      height={200}
                    />
                  </div>
                ) : (
                  <>
                    <div className={`${classes["product-row"]} row`}>
                      {products?.map((product) => (
                        <div
                          className={`${classes["product-col"]} col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-6 col-12`}
                          key={product.id}
                        >
                          <ProductBoxComplexSmall product_id={product.id} />
                        </div>
                      ))}
                      {products?.length === 0 && (
                        <p>Trenutno nema podataka za prikaz!</p>
                      )}
                    </div>
                    <div className={classes.paginationHolder}>
                      <div>
                        Strana {pagination?.selected_page} od{" "}
                        {pagination?.total_pages}
                      </div>
                      {pagination?.selected_page && (
                        <div className={classes.pagination}>
                          {Array.from(
                            {
                              length: Math.min(
                                5,
                                pagination?.total_pages -
                                  pagination?.selected_page +
                                  3,
                                pagination?.total_pages
                              ),
                            },
                            (x, i) =>
                              i + Math.max(pagination?.selected_page - 2, 1)
                          ).map((num) => (
                            <span
                              key={num}
                              className={`${classes.paginationItem} ${
                                num === pagination?.selected_page &&
                                classes.paginationItemSelected
                              }`}
                              onClick={() => onPageChange(num)}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;

export const getStaticPaths = async () => {
  const api = ApiHandler();

  const data = await api.get(`/categories/product/tree`);

  if (!data || !data.payload) {
    return { paths: [], fallback: true };
  }

  const paths = data.payload
    .filter((category) => category?.id)
    .map((category) => ({
      params: {
        path: [category.id.toString()],
      },
    }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { path } = context.params;

  if (!path || path.length === 0) {
    return {
      notFound: true,
    };
  }

  const categoryId = path[path.length - 1];

  if (!categoryId) {
    return {
      notFound: true,
    };
  }
  const api = ApiHandler();

  try {
    const categoryData = await api.get(
      `/categories/product/single/${categoryId}`
    );

    const productsItems = await api.list(
      `/products/category/list/${categoryId}`
    );

    const filtersData = await api.post(
      `/products/category/filters/${categoryId}`,
      {
        page: 1,
        limit: 50,
        sort: {
          field: "",
          direction: "",
        },
        filters: [],
        render: true,
      }
    );

    if (
      categoryData &&
      categoryData.success &&
      productsItems &&
      productsItems.success &&
      filtersData &&
      filtersData.success
    ) {
      return {
        props: {
          categoryData: categoryData.payload,
          productsItems: productsItems.payload,
          filters: filtersData.payload,
        },
        revalidate: 60,
      };
    } else {
      return { props: { failedToLoad: true } };
    }
  } catch (error) {
    return { props: { failedToLoad: true } };
  }
};

// export const getServerSideProps = async (context) => {
// // 	context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
// // 	const { path } = context.query;
// // 	const id = path[path.length - 1];
// // 	const api = ApiHandler();
// // 	return {
// // 		props: {
// // 			categoryData: await api.get(`/categories/product/single/${id}`).then((response) => response.payload),
// // 			filters: await api.post(`/products/category/filters/${id}`).then((response) => response.payload),
// // 		},
// // 	};
// // };
