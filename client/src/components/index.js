import Home from "./views/Home.js";
import Search from "./views/Search.js";
import Products from "./views/Products.js";
import Upload from "./views/Upload.js";
import Cart from "./views/Cart.js";
import Checkout from "./views/Checkout.js";
import UserSidebar from "./views/account/UserSidebar.js";
import Header from "./views/partials/Header.js";
import Footer from "./views/partials/Footer.js";
import Modal from "./views/partials/Modal.js";
import * as Pagination from "./utils/pagination.js";
import * as Image from "./utils/image.js";
import * as SortProducts from "./utils/sort.js";
import { clickedHandle } from "./js/clickedHandle.js";
import { keyPressed } from "./js/keyPressed.js";
import { showCartProducts } from "./js/product/cartProducts.js";
import { setSidebarLayout } from "./js/account/sideBar.js";
import { hideHeaderSortTablet, showHeaderSortTablet } from "./js/cart/cartHandle.js";

//cd client/src/resources
//handlebars -m templates/ > templates/templates.js

const pathToRegex = (path) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getCurrentPage = () => {
    const currentPage = new URL(location.href).searchParams.get("page");

    if (currentPage === null) {
        return 1;
    }
    return parseInt(currentPage.split("/")[0]);
};

const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

    return Object.fromEntries(
        keys.map((key, i) => {
            return [key, values[i]];
        })
    );
};

let isLoadedPartials = false;

const loadPartials = async () => {
    const header = new Header();
    const footer = new Footer();
    const modal = new Modal();

    document.querySelector(".app").insertAdjacentHTML("afterbegin", await header.getHtml());
    document.querySelector(".app").insertAdjacentHTML("beforeend", await footer.getHtml());
    document.querySelector(".modal").innerHTML = await modal.getHtml();
    showCartProducts();
    isLoadedPartials = true;
};

const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/products/:id", view: Products },
        { path: "/all", view: Search },
        { path: "/cart", view: Cart },
        { path: "/checkout", view: Checkout },
        { path: "/account/:userPage", view: UserSidebar },
        { path: "/upload", view: Upload },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route,
            result: location.pathname.match(pathToRegex(route.path)),
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

    if (!match) {
        location.pathname = routes[0].path;
    }

    const view = new match.route.view(getParams(match));

    const removeAllElements = (elements) => {
        while (elements.length > 0) {
            elements[0].remove();
        }
    };

    const loadFullPage = async () => {
        let results = await Promise.all([loadPartials(), view.getHtml()]);
        const appContainerHtml = results[1].toString();
        document.querySelector(".header").insertAdjacentHTML("afterend", appContainerHtml);
    };

    const loadAppContainer = async () => {
        const appContainer = document.getElementsByClassName("app__container");
        removeAllElements(appContainer);
        document.querySelector(".header").insertAdjacentHTML("afterend", await view.getHtml());
    };

    const setLayout = () => {
        const currentPath = match.route.path;
        const pageNumber = document.querySelector(".home-filter__page-number");

        if (currentPath === routes[0].path || currentPath === routes[2].path) {
            if (pageNumber !== null && !isNaN(getCurrentPage())) {
                const allPages = pageNumber.innerText;
                Pagination.checkPaginationButton(getCurrentPage(), allPages);
            }
            SortProducts.buttonSortLayout();
            showHeaderSortTablet();
        } else {
            hideHeaderSortTablet();
        }

        if (currentPath === routes[1].path) {
            Image.zoomImg();
        }

        if (currentPath === routes[5].path) {
            setSidebarLayout();
        }
    };

    isLoadedPartials ? await loadAppContainer() : await loadFullPage();
    setLayout();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", async (e) => {
        const href = await clickedHandle(e);
        if (href) {
            navigateTo(href);
        }
    });

    document.body.addEventListener("keyup", (e) => {
        e.preventDefault();
        keyPressed(e.key);
    });
    router();
});
