import * as Home from "./home/home.js";
import * as Header from "./partials/header.js";
import * as Modal from "./partials/modal.js";
import * as Product from "./product/productHandle.js";
import * as Upload from "./upload/upload.js";
import * as Cart from "./cart/cart.js";
import * as Checkout from "./checkout/checkout.js";
import * as Sidebar from "./account/sideBar.js";
import * as Profile from "./account/profile/profile.js";
import * as Address from "./account/addresses/address.js";
import * as Purchase from "./account/purchase/purchase.js";

export async function clickedHandle(event) {
    let element = event.target;

    const listAttrs = [
        { attr: "home-attr", js: Home },
        { attr: "header-attr", js: Header },
        { attr: "modal-attr", js: Modal },
        { attr: "product-attr", js: Product },
        { attr: "upload-attr", js: Upload },
        { attr: "cart-attr", js: Cart },
        { attr: "checkout-attr", js: Checkout },
        { attr: "sidebar-attr", js: Sidebar },
        { attr: "profile-attr", js: Profile },
        { attr: "address-attr", js: Address },
        { attr: "purchase-attr", js: Purchase },
    ];

    while (element.tagName !== "BODY") {
        for (let listAttrItem of listAttrs) {
            if (element.hasAttribute(listAttrItem.attr)) {
                const elementHref = await listAttrItem.js.pageHandle(element, event);
                return elementHref;
            }
        }

        element = element.parentNode;
    }
}
