import AbstractView from "./AbstractView.js";
import { getCartProducts } from "../js/product/cartProducts.js";
import { checkLoginUser } from "../authenticate/checkLogin.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("My Shop | Giỏ Hàng");
    }

    async getHtml() {
        const checkLogin = await checkLoginUser();
        if (!checkLogin.user) {
            return Handlebars.templates["requireLogin"]();
        }

        Handlebars.partials = Handlebars.templates;
        const cartProducts = await getCartProducts();
        return Handlebars.templates["viewCart"](cartProducts);
    }
}
