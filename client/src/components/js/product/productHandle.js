import { checkLoginUser } from "../../authenticate/checkLogin.js";
import * as CartProducts from "./cartProducts.js";
import { cartProductHtml } from "../others/htmlTemplates.js";

export async function pageHandle(element, event) {
    const listProductAttr = ["adjust-product", "input-product", "add-to-cart", "remove-cart-product", "buy-now"];

    let result;
    let inputNumberProduct = document.querySelector(".item__quantity-input-number");
    const cartList = document.querySelector(".header__cart-list-item");
    const modal = document.querySelector(".modal");
    const productId = location.pathname.split("/")[2];

    listProductAttr.some((attr) => {
        if (attr.match(element.getAttribute("product-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const convertCurrency = (input) => {
        if (!input) input = 0;
        return `${input.toLocaleString()}đ`;
    };

    const reRenderCart = async () => {
        const cartList = document.querySelector(".header__cart-list-item");
        const cartItems = await CartProducts.getCartProducts();
        cartList.innerHTML = "";
        cartItems.forEach((item) => {
            let itemHtml = cartProductHtml(
                item.name,
                item.quantity,
                convertCurrency(item.price),
                item.images[0],
                item.slug
            );
            cartList.insertAdjacentHTML("afterbegin", itemHtml);
        });
        return true;
    };

    const toastHandle = () => {
        const toast = document.querySelector(".toast");

        toast.style.display = "block";

        setTimeout(() => {
            toast.style.display = "none";
        }, 1200);

        if (toast.style.display === "block") {
            document.body.addEventListener("click", (e) => {
                toast.style.display = "none";
            });
        }
    };

    const showLoginForm = () => {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
        document.querySelector("#auth-form-login").style.display = "block";
    };

    switch (result[0]) {
        case "adjust-product": {
            const remainProduct = parseInt(document.querySelector(".show-product-info__detail-remain").innerText);
            if (result[1].classList.contains("item__quantity-number--plus")) {
                if (parseInt(inputNumberProduct.value) < remainProduct) {
                    inputNumberProduct.value = parseInt(inputNumberProduct.value) + 1;
                }
            }
            if (result[1].classList.contains("item__quantity-number--minus")) {
                if (parseInt(inputNumberProduct.value) > 1) {
                    inputNumberProduct.value = parseInt(inputNumberProduct.value) - 1;
                }
            }
            break;
        }

        case "input-product": {
            const remainProduct = parseInt(document.querySelector(".show-product-info__detail-remain").innerText);
            let prevNumberProduct = 1;
            result[1].addEventListener("input", (e) => {
                if (e.target.value) {
                    if (e.target.value > remainProduct) {
                        inputNumberProduct.value = remainProduct;
                        prevNumberProduct = e.target.value;
                    } else {
                        inputNumberProduct.value = e.target.value.replace(/^0+/, "").replace(/[^0-9]/g, "");
                        prevNumberProduct = e.target.value.replace(/^0+/, "").replace(/[^0-9]/g, "");
                    }
                }
            });

            result[1].addEventListener("blur", (e) => {
                if (inputNumberProduct.value === "") {
                    inputNumberProduct.value = prevNumberProduct;
                }
            });
            break;
        }

        case "add-to-cart": {
            event.preventDefault();

            const checkLogin = await checkLoginUser();
            if (checkLogin.hasOwnProperty("user")) {
                const numberProduct = Number(inputNumberProduct.value);
                const addCartResponse = await CartProducts.addCartProducts(productId, numberProduct);
                if (addCartResponse.success) {
                    const reRenderCartResponse = await reRenderCart();
                    if (reRenderCartResponse) {
                        CartProducts.showCartProducts();
                        toastHandle();
                    }
                }
            } else {
                showLoginForm();
            }
            break;
        }

        case "remove-cart-product": {
            event.preventDefault();
            const addedProduct = result[1].closest(".header__cart-item");
            CartProducts.removeCartProducts(addedProduct);
            break;
        }

        case "buy-now": {
            const checkLogin = await checkLoginUser();
            if (checkLogin.hasOwnProperty("user")) {
                const quantity = inputNumberProduct.value;
                const buyNow = true;

                const addCartResponse = await CartProducts.addCartProducts(productId, quantity, buyNow);

                if (addCartResponse.success) {
                    const reRenderCartResponse = await reRenderCart();
                    if (reRenderCartResponse) {
                        CartProducts.showCartProducts();
                        return "/cart";
                    }
                }
            } else {
                showLoginForm();
            }
            break;
        }
    }
}
