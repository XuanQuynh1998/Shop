import { reRenderCart } from "../product/cartProducts.js";

export function reRenderCartItems(items, id) {
    const cartList = document.querySelector(".header__cart-list-item");
    const cartItems = cartList.querySelector("input[value='" + id + "']").closest(".header__cart-item");

    reRenderCart(cartItems);
    items.remove();
}

export async function removeCartItem(productId, quantity) {
    const result = await $.ajax({
        url: `/cart/remove/${productId}/${quantity}`,
    });

    return result;
}

export function hideHeaderSortTablet() {
    const headerSort = document.querySelector(".header__sort-bar");
    const appContainer = document.querySelector(".app__container");
    const width = window.matchMedia("(max-width: 1023px)");
    if (width.matches) {
        appContainer.style.marginTop = "var(--header-height)";
    }
    headerSort.style.display = "none";
}

export function showHeaderSortTablet() {
    const headerSort = document.querySelector(".header__sort-bar");
    const width = window.matchMedia("(max-width: 1023px)");
    if (width.matches) {
        headerSort.style.display = "flex";
    } else {
        headerSort.style.display = "none !important";
    }
}
