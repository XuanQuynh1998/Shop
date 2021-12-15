import AbstractView from "../AbstractView.js";
import { checkLoginUser } from "../../authenticate/checkLogin.js";
import { getCartProducts } from "../../js/product/cartProducts.js";
import { getAvatarUrl } from "../../js/account/sidebarHandle.js";

export default class extends AbstractView {
    constructor() {
        super();
    }

    async getHtml() {
        const userdata = await checkLoginUser();
        if (userdata.hasOwnProperty("user")) {
            const username = userdata.user.username;
            const avatarUrl = await getAvatarUrl();
            let cartProducts = await getCartProducts(username);
            cartProducts = cartProducts.reverse();

            const userInfo = {
                username,
                avatar: avatarUrl,
                cart: cartProducts,
            };

            Handlebars.partials = Handlebars.templates;
            return Handlebars.templates["header"](userInfo);
        }
        return Handlebars.templates["header"]();
    }
}
