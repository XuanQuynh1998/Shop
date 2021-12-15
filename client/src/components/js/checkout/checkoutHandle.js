import { getCartProducts } from "../product/cartProducts.js";
import { cartProductHtml } from "../others/htmlTemplates.js";

export async function order(checkoutData) {
    const response = await $.ajax({
        type: "POST",
        url: "/checkout/order",
        data: { checkoutData },
    });

    return response;
}

export async function getOrder() {
    const orderData = await $.ajax({
        url: "/checkout/get_order",
    });

    return orderData;
}

export async function setAddress(addressId) {
    const response = await $.ajax({
        type: "POST",
        url: "/checkout/set_address",
        data: { addressId },
    });

    return response;
}

export async function orderSuccess() {
    const cartNotice = document.querySelector(".header__cart-notice");
    const cartList = document.querySelector(".header__cart-list-item");
    const cartHaveItem = document.querySelector(".header__cart-list--have-items");

    const convertCurrency = (input) => {
        if (!input) input = 0;
        return `${input.toLocaleString()}đ`;
    };

    const response = await $.ajax({
        url: "/cart/remove_all",
    });

    const cartItems = await getCartProducts();
    console.log(cartItems);

    if (!cartItems.length) {
        const cartNoItem = document.querySelector(".header__cart-list--no-cart");

        cartNoItem.style.display = "block";
        cartHaveItem.style.display = "none";
        cartNotice.style.display = "none";
        return Handlebars.templates["orderSuccess"]();
    }

    console.log(123);

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
    cartNotice.innerText = cartItems.length;
    cartHaveItem.style.display = "block";

    return Handlebars.templates["orderSuccess"]();
}
