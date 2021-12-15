import AbstractView from "./AbstractView.js";
import { getAddresses } from "../js/account/addresses/addressHandle.js";
import { checkLoginUser } from "../authenticate/checkLogin.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("My Shop | Thanh Toán");
    }

    async getHtml() {
        const checkLogin = await checkLoginUser();
        if (!checkLogin.user) {
            return Handlebars.templates["requireLogin"]();
        }

        const checkoutProductInfo = await $.ajax({
            url: "/checkout/checkout_product",
        });

        const listAddresses = await getAddresses();
        let defaultAddressInfo = listAddresses.addresses.find((address) => address.setDefault === true);

        defaultAddressInfo.address = defaultAddressInfo.address.join(", ");

        const quantity = checkoutProductInfo[0].length;

        checkoutProductInfo["quantity"] = quantity;
        checkoutProductInfo["defaultAddressInfo"] = defaultAddressInfo;
        Handlebars.partials = Handlebars.templates;
        return Handlebars.templates["checkout"](checkoutProductInfo);
    }
}
