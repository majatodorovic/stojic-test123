import Image from "next/legacy/image";
import { useState, useEffect } from "react";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./ProductBoxComplexSmall.module.scss";
import { currencyFormat } from "../helpers/functions";
import { useGlobalAddToCart } from "../helpers/globals";
import { ApiHandler } from "../helpers/api";

const ProductBoxComplexSmall = ({
  product_id,
  noBorder = "",
  className = "",
  biggerImg = "",
  isSpecialOffer = false,
}) => {
  const [addToCart] = useGlobalAddToCart();
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    const api = ApiHandler();

    api
      .get(`/product-details/basic-data/${product_id}`)
      .then((response) => {
        setProduct(response?.payload?.data?.item);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });

    api
      .get(`/product-details/gallery/${product_id}`)
      .then((response) => {
        setProductImage(response?.payload);
      })
      .catch((error) => {
        console.error("Error fetching product images:", error);
      });
  }, [product_id]);

  // if (isLoading) {
  //   return (
  //     <div>
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className={`${classes.container} ${classes[className]}`}>
      <div className={`${classes.wrapp}`}>
        {!isSpecialOffer && product?.categories ? (
          <a
            href={`/kategorije/${product?.categories[0]?.id}`}
            className={classes["category-name"]}
          >
            {product?.categories[0]?.name ?? ""}
          </a>
        ) : (
          <h5>Specijalna ponuda</h5>
        )}
        <a
          href={`/proizvod/${product?.slug}`}
          className={classes["product-name"]}
        >
          {product?.basic_data?.name ?? ""}
        </a>
      </div>

      <a
        href={`/proizvod/${product?.slug}`}
        className={
          productImage?.image?.length <= 0
            ? `${classes.noImg} ${classes["product-img"]} ${classes[noBorder]} ${classes[biggerImg]}`
            : `${classes["product-img"]} ${classes[noBorder]} ${classes[biggerImg]}`
        }
      >
        {productImage?.gallery[0]?.image && (
          <Image
            alt={product?.basic_data?.slug}
            src={productImage?.gallery[0]?.image || "/images/logo.webp"}
            priority
            layout="fill"
            sizes="100vw, 100%"
            className={classes.img}
          />
        )}
      </a>
      <p className="text-start row2 mb-1">
        {product?.basic_data?.short_description}
      </p>
      <div>
        {product?.inventory?.inventory_defined ? (
          <div className={classes.inventorystatusholder}>
            <Image
              src={"/icons/available.png"}
              alt="Stojic elektrik"
              width={16}
              height={16}
            />
            <p className={classes.availabletext}>Dostupno</p>
          </div>
        ) : (
          <div className={classes.inventorystatusholder}>
            <Image
              src={"/icons/unavailable.png"}
              alt="AKT"
              width={16}
              height={16}
            />
            <p className={classes.unavailabletext}>Trenutno nije dostupno</p>
          </div>
        )}
        <div className={classes.price}>
          {!product?.price?.discount?.active && (
            <p className={classes["no-old-price"]} />
          )}
          {product?.price?.discount?.active &&
            product?.price?.price?.original > 0 && (
              <p className={classes["old-price"]}>
                {currencyFormat(
                  product?.price?.price?.original,
                  product?.price?.currency
                )}
              </p>
            )}
          <p className={classes["new-price"]}>
            {currencyFormat(
              product?.price?.discount?.active
                ? product?.price?.price?.discount
                : product?.price?.price?.original,
              product?.price?.currency
            )}
          </p>
        </div>

        {product?.price?.discount?.active &&
          product?.price?.price?.original > 0 && (
            <div className={classes.discount}>
              <span>
                {product.price.price.discount < product.price.price.original
                  ? `-${Math.round(
                      ((product.price.price.original -
                        product.price.price.discount) /
                        product.price.price.original) *
                        100
                    )}%`
                  : `+${Math.round(
                      ((product.price.price.discount -
                        product.price.price.original) /
                        product.price.price.original) *
                        100
                    )}%`}
              </span>
            </div>
          )}

        {(productImage?.stickers ?? []).map((sticker) => (
          <div className={classes["top-deal"]} key={sticker.slug}>
            <span>{sticker.name}</span>
          </div>
        ))}

        {!isSpecialOffer ? null : product?.id?.price?.discount?.amount ? ( // </div> //   <Image alt="fav-heart" src={heartImg} /> // > //   onClick={() => addToWishList(product?.id)} //   className={classes['fav-heart']} // <div
          <div className={classes.percentSale}>
            {product?.id?.price?.discount?.amount}
          </div>
        ) : null}
      </div>

      {(product?.id?.stickers ?? []).map((sticker) => (
        <div className={classes["top-deal"]} key={sticker.slug}>
          <span>{sticker.name}</span>
        </div>
      ))}

      {product?.inventory?.inventory_defined &&
      product?.price?.price_defined ? (
        <div className={classes["add-to-cart"]}>
          <div
            className={classes["add-to-cart-image"]}
            onClick={() => addToCart(product?.id, 1)}
          >
            <FontAwesomeIcon icon={faBagShopping} color="white" />
          </div>
        </div>
      ) : (
        <div className={classes["add-to-cartT"]}>
          <a
            href={`/kontakt?id=${product?.id}&&name=${product?.basic_data?.name}`}
          >
            <div className={classes["add-to-cart-imagel"]}>
              <FontAwesomeIcon icon={faEnvelope} color="white" />
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductBoxComplexSmall;
