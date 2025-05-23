import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Image from "next/legacy/image";
import classes from "./ProductDetails.module.scss";
import { currencyFormat } from "../helpers/functions";
import { useGlobalAddToCart, useGlobalAddToWishList } from "../helpers/globals";

const Specifications = dynamic(() => import("./Specifications"));
const RecomendedProducts = dynamic(() => import("./RecomendedProducts"));
const ProductDetailsSlider = dynamic(() => import("./ProductDetailsSlider"));
const PlusMinusInput = dynamic(() => import("./PlusMinusInput"));

const ProductDetails = ({
  productData,
  gallery,
  specifications,
  description,
}) => {
  // Holds the selected additional option
  const [additional, setAdditional] = useState("info");
  // State that holds amount of products
  const [productAmount, setProductAmount] = useState(1);

  const [globalAddToCart, loading] = useGlobalAddToCart();

  const [addToWishList, isLoadingWish] = useGlobalAddToWishList();

  const [printClicked, setPrintClicked] = useState(false);

  const addToCart = () => {
    if (Number(productData?.inventory?.amount) > 0) {
      globalAddToCart(productData.id, productAmount);
      setProductAmount(1);
    }
  };

  const pagePrintClicked = () => {
    setPrintClicked(true);
  };

  useEffect(() => {
    if (printClicked) {
      window.print();
      setPrintClicked(false);
    }
  }, [printClicked]);

  return (
    <div className={`${classes["product-details-holder"]}`}>
      <div className={`row ${classes["grid-print"]}`}>
        <div
          className={`${`${classes["slider-holder"]} col-xl-5 col-lg-4 col-md-12`}`}
        >
          <ProductDetailsSlider
            isLoadingWish={isLoadingWish}
            images={gallery.gallery}
            addToWishList={() => addToWishList(productData?.id)}
            onClick={pagePrintClicked}
          />
        </div>
        <div
          className={`${`${classes["info-holder"]} col-xl-7 col-lg-8 col-md-12`}`}
        >
          <h3>{productData?.basic_data?.name}</h3>
          <ul className={`${classes["code-list"]}`}>
            <li>
              <span>Šifra artikla:</span>
              {productData?.basic_data?.sku}
            </li>
            <li>
              <span>Barcode:</span>
              {productData?.basic_data?.barcode}
            </li>
          </ul>
          <ul className={`${classes["delivery-list"]}`}>
            <li>
              Dostupnost:{" "}
              <span
                className={`${
                  classes[
                    Number(productData?.inventory?.inventory_defined)
                      ? "stock"
                      : "no-stock"
                  ]
                }`}
              >
                {productData?.inventory?.status}
              </span>
            </li>
            <li>
              Rok isporuke: <span>5 dana</span>
            </li>
            <li>
              Dostava: <span>Besplatna za porudžbine preko 10.000RSD</span>
            </li>
          </ul>

          <ul className={`${classes.shortDesc}`}>
            <li>
              <span>Kratak opis:</span>

              {productData?.basic_data?.short_description
                ? productData?.basic_data?.short_description
                : "/"}
            </li>
          </ul>

          <ul className={classes["price-list"]}>
            {/* Prikazivanje stare cene samo ako je popust aktivan i originalna cena postoji */}
            {productData?.price?.discount?.active &&
              productData?.price?.price?.original > 0 && (
                <li className={classes["old-price"]}>
                  {currencyFormat(
                    productData?.price?.price?.original,
                    productData?.price?.currency
                  )}
                </li>
              )}

            {/* Prikazivanje nove cene, ili originalne cene ako popust nije aktivan */}
            <li className={classes.price}>
              {currencyFormat(
                productData?.price?.discount?.active
                  ? productData?.price?.price?.discount
                  : productData?.price?.price?.original,
                productData?.price?.currency
              )}

              {/* Prikazivanje procenta popusta samo ako je popust aktivan */}
              {productData?.price?.discount?.active &&
                productData?.price?.price?.original > 0 && (
                  <span className={classes.discount}>
                    {" ("}-
                    {Math.round(
                      ((productData.price.price.original -
                        productData.price.price.discount) /
                        productData.price.price.original) *
                        100
                    )}
                    % {")"}
                  </span>
                )}
            </li>
          </ul>
          {Number(productData?.inventory?.amount) > 0 ? (
            // Ako proizvod ima lager, ali nema cenu
            productData?.price?.price_defined === false ? (
              <div className="d-flex">
                <div className={`${classes["button-add-to-cart-holdero"]}`}>
                  <a
                    href={`/kontakt?id=${productData?.id}&&name=${productData?.basic_data?.name}`}
                    className={classes.button} // Koristi istu klasu kao dugme
                  >
                    <div className={`${classes["img-holder"]}`}>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ color: "white" }}
                      />
                    </div>
                    <p style={{ whiteSpace: "nowrap" }}>Pošaljite upit</p>
                  </a>
                </div>
              </div>
            ) : (
              // Ako proizvod ima lager i cenu
              <div className="d-flex align-items-center">
                <div className={`${classes["button-quantity-holder"]}`}>
                  <div className={`${classes["button-quantity"]}`}>
                    <PlusMinusInput
                      className={classes["amount-input"]}
                      amount={productAmount}
                      setCount={setProductAmount}
                    />
                  </div>
                </div>
                <div className={`${classes["button-add-to-cart-holder"]}`}>
                  {loading ? (
                    <button
                      className={`${classes.button} ${classes["button-loading"]}`}
                      type="button"
                    >
                      <Image
                        src="/images/loading-buffering.gif"
                        alt="Loading"
                        width={200}
                        height={200}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={addToCart}
                      className={classes.button}
                      type="button"
                    >
                      <div className={`${classes["img-holder"]}`}>
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          style={{ color: "#fff" }}
                        />
                      </div>
                      Dodaj u korpu
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            // Ako proizvod NEMA dostupnu količinu
            <div className="d-flex ">
              <div className={`${classes["button-add-to-cart-holdero"]}`}>
                <a
                  href={`/kontakt?id=${productData?.id}&&name=${productData?.basic_data?.name}`}
                  className={classes.button} // Koristi istu klasu kao dugme
                >
                  <div className={`${classes["img-holder"]}`}>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ color: "white" }}
                    />
                  </div>
                  <p style={{ whiteSpace: "nowrap" }}>Proverite dostupnost</p>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Specifications
        specifications={specifications}
        description={description}
      />
      {/* {recommendedProducts && recommendedProducts.length > 0 && ( */}
      {/* 	<RecomendedProducts recommendedProducts={recommendedProducts} /> */}
      {/* )} */}
    </div>
  );
};

export default ProductDetails;
