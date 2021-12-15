import { noCartListHtml } from "../others/htmlTemplates.js";
import { cartProductHtml } from "../others/htmlTemplates.js";

export async function addCartProducts(productId, numberProduct, buyNow = false) {
    const addCartProduct = await $.ajax({
        type: "POST",
        url: "/cart/add",
        data: {
            productId: productId,
            numberProduct: numberProduct,
            buyNow: buyNow,
        },
    });
    return addCartProduct;
}

export async function updateCartProducts(cartInfo, action) {
    const updateCartProduct = await $.ajax({
        type: "POST",
        url: "/cart/update",
        data: { cartInfo, action },
    });
    return updateCartProduct;
}

export async function getCartProducts() {
    const getCartProducts = await $.ajax({
        url: `/cart/get_cart`,
    });
    return getCartProducts;
}

export function showCartProducts() {
    const cartListQuantity = document.querySelector(".header__cart-list-item").childElementCount;
    const noCart = document.querySelector(".header__cart-list--no-cart");
    const cartHaveItem = document.querySelector(".header__cart-list--have-items");
    const cartNotice = document.querySelector(".header__cart-notice");

    if (cartListQuantity) {
        cartNotice.innerText = cartListQuantity;
        cartNotice.style.display = "block";
        noCart.style.display = "none";
        cartHaveItem.style.display = "block";
    }
}

export function reRenderCart(cartItem) {
    const noCart = document.querySelector(".header__cart-list--no-cart");
    const cartHaveItem = document.querySelector(".header__cart-list--have-items");
    const cartNotice = document.querySelector(".header__cart-notice");
    const cartList = document.querySelector(".header__cart-list-item");
    const productId = cartItem.querySelector(".product-id").value;

    const cartPageItems = document.querySelectorAll(".cart-item");

    for (let i = 0; i < cartPageItems.length; i++) {
        if (cartPageItems[i].querySelector("input[value='" + productId + "']")) {
            cartPageItems[i].remove();
        }
    }

    const cartContainer = document.querySelector(".cart-container");

    cartItem.remove();

    if (!cartList.childElementCount) {
        cartNotice.style.display = "none";
        cartHaveItem.style.display = "none";
        noCart.style.display = "block";
        if (cartContainer) {
            cartContainer.innerHTML = noCartListHtml();
        }
    } else {
        cartNotice.innerText = cartList.childElementCount;
    }
}

export async function removeCartProducts(addedProduct) {
    const productId = addedProduct.querySelector(".product-id").value;
    const productQuantity = addedProduct.querySelector(".header__cart-item-qnt").innerText;

    const removeCart = await $.ajax({
        url: `/cart/remove/${productId}/${productQuantity}`,
    });

    if (removeCart.success) {
        reRenderCart(addedProduct);
    }
}

export async function renderCart() {
    const convertCurrency = (input) => {
        if (!input) input = 0;
        return `${input.toLocaleString()}đ`;
    };
    const cartList = document.querySelector(".header__cart-list-item");
    const cartItems = await getCartProducts();
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
    showCartProducts();
    return true;
}
