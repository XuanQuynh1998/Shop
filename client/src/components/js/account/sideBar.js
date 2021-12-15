import { getProfileData } from "./profile/profileHandle.js";
import { getAddresses } from "./addresses/addressHandle.js";
import { getOrder } from "../checkout/checkoutHandle.js";
import { checkLoginUser } from "../../authenticate/checkLogin.js";

export function pageHandle(element, event) {
    const listProfileAttr = ["profile", "addresses", "purchase"];

    let result;
    listProfileAttr.some((attr) => {
        if (attr.match(element.getAttribute("sideBar-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const setHistory = (pathname) => {
        const url = "/account/" + pathname;
        history.pushState(null, null, url);
    };

    const pathname = location.pathname.split("/").pop();

    switch (result[0]) {
        case "profile": {
            event.preventDefault();
            if (pathname !== "profile") {
                setHistory("profile");

                getProfileData().then((profileData) => {
                    const profileHtml = Handlebars.templates["profile"](profileData);
                    document.querySelector(".account-section").innerHTML = profileHtml;
                });
            }
            break;
        }

        case "addresses": {
            event.preventDefault();
            if (pathname !== "addresses") {
                setHistory("addresses");

                getAddresses().then((addressesData) => {
                    const addressesHtml = Handlebars.templates["addresses"](addressesData);
                    document.querySelector(".account-section").innerHTML = addressesHtml;
                });
            }
            break;
        }

        case "purchase": {
            event.preventDefault();
            setHistory("purchase");

            getOrder().then((purchaseData) => {
                const purchaseHtml = Handlebars.templates["purchase"](purchaseData);
                document.querySelector(".account-section").innerHTML = purchaseHtml;
            });
            break;
        }
    }
    this.setSidebarLayout();
}

export async function setSidebarLayout() {
    const checkLogin = await checkLoginUser();
    if (!checkLogin.hasOwnProperty("user")) {
        return;
    }
    const activatedElement = document.querySelector(".active");
    const pathname = location.pathname.split("/").pop();
    activatedElement.classList.remove("active");

    if (pathname === "profile") {
        const dropDownMenu = document.querySelector(".user-sidebar-menu__dropdown-body-item");
        dropDownMenu.firstElementChild.classList.add("active");
        return;
    }

    if (pathname === "addresses") {
        const addressesTab = document.querySelector('[sidebar-attr="addresses"]');
        addressesTab.classList.add("active");
        return;
    }

    if (pathname === "purchase") {
        const purchaseTab = document.querySelector('[sidebar-attr="purchase"]');
        purchaseTab.classList.add("active");
        return;
    }
}
