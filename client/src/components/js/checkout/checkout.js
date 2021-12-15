import * as checkoutHandle from "./checkoutHandle.js";
import { currentAddressHtml, changeAddressHtml } from "../others/htmlTemplates.js";
import { getAddresses } from "../account/addresses/addressHandle.js";

export async function pageHandle(element, event) {
    const listCheckoutAttr = ["order", "confirm-no-cart", "item-link", "change-address", "submit-address", "back"];
    let result;

    listCheckoutAttr.some((attr) => {
        if (attr.match(element.getAttribute("checkout-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    switch (result[0]) {
        case "order": {
            const allCheckoutProduct = document.querySelectorAll(".checkout-product-item__container");
            const message = document.querySelector(".checkout-product-payment__message-input").value;
            const addressId = document
                .querySelector(".checkout-info__customer-container")
                .querySelector("#address-id").value;

            const checkoutProductData = [...allCheckoutProduct].map((checkoutProduct) => {
                let slug = checkoutProduct.querySelector(".checkout-product-id").value;
                let quantity = +checkoutProduct.querySelector(".checkout-product-item__quantity").innerText;
                return { productId: slug, quantity: quantity };
            });

            const checkoutData = {
                message: message,
                checkoutProduct: checkoutProductData,
                addressInfo: addressId,
            };

            const orderResponse = await checkoutHandle.order(checkoutData);
            if (orderResponse.success) {
                event.preventDefault();
                const appContent = document.querySelector(".app__content");
                const orderSuccessHtml = await checkoutHandle.orderSuccess();

                appContent.innerHTML = orderSuccessHtml;
            }
            break;
        }

        case "confirm-no-cart": {
            return "/cart";
        }

        case "item-link": {
            event.preventDefault();
            return result[1].href;
        }

        case "change-address": {
            const checkoutInfo = document.querySelector(".checkout-info");
            const currentAddressInfo = document.querySelector(".checkout-info__customer-container");

            const listAddress = await getAddresses();

            const addressData = listAddress.addresses.map((addressItem) => {
                addressItem.address = addressItem.address.join(", ");
                return addressItem;
            });

            sessionStorage["prevAddress"] = currentAddressInfo.outerHTML;

            const listAddressHtml = changeAddressHtml(addressData);
            currentAddressInfo.remove();

            checkoutInfo.insertAdjacentHTML("beforeend", listAddressHtml);
            break;
        }

        case "submit-address": {
            const addressId = document
                .querySelector(".checkout-info__list-address-radio:checked")
                .parentNode.querySelector(".address-id").value;
            const listAddress = document.querySelector(".checkout-info__list-address-container");
            const checkoutInfo = document.querySelector(".checkout-info");

            const addressData = await checkoutHandle.setAddress(addressId);

            if (addressData.success) {
                listAddress.remove();
                const addressHtml = currentAddressHtml(addressData.addressInfo[0]);
                checkoutInfo.insertAdjacentHTML("beforeend", addressHtml);
            }
            break;
        }

        case "back": {
            const checkoutInfo = document.querySelector(".checkout-info");
            const listAddress = document.querySelector(".checkout-info__list-address-container");

            const prevAddress = sessionStorage.getItem("prevAddress");

            listAddress.remove();
            checkoutInfo.insertAdjacentHTML("beforeend", prevAddress);

            break;
        }
    }
}
