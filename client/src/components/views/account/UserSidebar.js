import AbstractView from "../AbstractView.js";
import { getProfileData } from "../../js/account/profile/profileHandle.js";
import { getAvatarUrl, getUsername } from "../../js/account/sidebarHandle.js";
import * as addressesHandle from "../../js/account/addresses/addressHandle.js";
import { getOrder } from "../../js/checkout/checkoutHandle.js";
import { checkLoginUser } from "../../authenticate/checkLogin.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.userPage = params.userPage;
    }

    async getHtml() {
        const checkLogin = await checkLoginUser();
        if (!checkLogin.user) {
            return Handlebars.templates["requireLogin"]();
        }

        const render = async (data) => {
            const avatarUrl = await getAvatarUrl();
            const username = await getUsername();
            data["avatar"] = avatarUrl;
            data["username"] = username;

            Handlebars.partials = Handlebars.templates;
            return Handlebars.templates["userSidebar"](data);
        };

        switch (this.userPage) {
            case "profile": {
                const userInfo = await getProfileData();
                userInfo["page"] = "profile";

                return render(userInfo);
            }

            case "addresses": {
                const addresses = await addressesHandle.getAddresses();

                addresses["page"] = "addresses";
                return render(addresses);
            }

            case "purchase": {
                const purchaseOrder = await getOrder();

                purchaseOrder["page"] = "purchase";
                return render(purchaseOrder);
            }

            default: {
                location.pathname = "/account/profile";
            }
        }
    }
}
