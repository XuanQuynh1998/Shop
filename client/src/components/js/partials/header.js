import * as Search from "../../utils/search.js";
import { logout } from "../../authenticate/logout.js";
import { sortProducts } from "../../utils/sort.js";
import { checkLoginUser } from "../../authenticate/checkLogin.js";
import { menuAuthHtml, headerMenuHtml } from "../others/htmlTemplates.js";

export async function pageHandle(element, event) {
    const listHeaderAttr = [
        "search-btn",
        "home-link",
        "item-link",
        "search-input",
        "mobile-search",
        "authentication",
        "logout-btn",
        "view-cart",
        "header-link",
        "menu-link",
        "sort-button",
        "mobile-tablet-price-sort",
        "mobile-tablet-menu",
    ];

    const headerListHistory = document.querySelector(".header__search-history");
    let result;
    listHeaderAttr.some((attr) => {
        if (attr.match(element.getAttribute("header-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    const setLayout = (clickedBtn) => {
        const activatedBtn = document.querySelector(".header__sort-item--active");
        if (activatedBtn) {
            activatedBtn.classList.remove("header__sort-item--active");
        }
        clickedBtn.classList.add("header__sort-item--active");
    };

    switch (result[0]) {
        case "search-btn": {
            event.preventDefault();
            let searchInputValue = document.querySelector(".header__search-input").value;
            headerListHistory.style.display = "none";
            Search.saveHistory(searchInputValue);
            if (searchInputValue) {
                return `/all?s=${searchInputValue}`;
            }
            break;
        }

        case "home-link":
            event.preventDefault();
            return "/";

        case "search-input": {
            event.preventDefault();
            const listHistory = document.querySelector(".header__search-history-list");
            let histories = JSON.parse(localStorage.getItem("history"));
            listHistory.innerHTML = "";
            if (histories) {
                headerListHistory.style.display = "block";
                histories.forEach((history) => {
                    let html = `<li class="header__search-history-item">
                    <a href="/all?s=${history}" header-attr="item-link">${history}</a></li>`;
                    listHistory.insertAdjacentHTML("afterbegin", html);
                });
            }
            break;
        }

        case "item-link": {
            event.preventDefault();
            const searchInput = document.querySelector(".header__search-input");
            searchInput.value = result[1].innerText;
            headerListHistory.style.display = "none";
            return result[1].href;
        }

        case "mobile-search": {
            event.preventDefault();
            const mobileSearch = document.querySelector(".header__search-checkbox");
            if (mobileSearch.hasAttribute("checked")) {
                mobileSearch.removeAttribute("checked");
            } else {
                mobileSearch.setAttribute("checked", "true");
            }
            break;
        }

        case "authentication": {
            event.preventDefault();
            const authFormLogin = document.querySelector("#auth-form-login");
            const authFormRegister = document.querySelector("#auth-form-register");
            document.querySelector(".modal").style.display = "flex";
            document.body.style.overflow = "hidden";
            if (result[1].classList.contains("header-login")) {
                authFormLogin.style.display = "block";
                authFormRegister.style.display = "none";
            }
            if (result[1].classList.contains("header-register")) {
                authFormLogin.style.display = "none";
                authFormRegister.style.display = "block";
            }
            break;
        }

        case "logout-btn": {
            event.preventDefault();
            logout();
            break;
        }

        case "view-cart": {
            event.preventDefault();
            // const headerCartList = document.querySelector(".header__cart-list");
            // headerCartList.style.display = "none";
            return result[1].href;
        }

        case "header-link": {
            event.preventDefault();
            return result[1].href;
        }

        case "menu-link": {
            event.preventDefault();
            const headerMenu = document.querySelector(".header-mobile-menu__options-wrap");
            headerMenu.remove();
            return result[1].href;
        }

        case "sort-button": {
            event.preventDefault();
            const sortHref = sortProducts(result[1]);
            setLayout(result[1]);
            return sortHref;
        }

        case "mobile-tablet-price-sort": {
            event.preventDefault();
            if (location.search === "") {
                return `?page=1&sortBy=price&type=asc`;
            }
            if (location.search.split("&").pop() === "type=desc") {
                return location.href.split("&")[0] + "&sortBy=price" + `&type=asc`;
            }
            setLayout(result[1]);
            return location.href.split("&")[0] + "&sortBy=price" + `&type=desc`;
        }

        case "mobile-tablet-menu": {
            const headerMenu = document.querySelector(".header-mobile-menu__options-wrap");
            const headerMenuContainer = document.querySelector(".header-mobile-menu");

            const checkLogin = await checkLoginUser();

            if (headerMenu) {
                headerMenu.remove();
            } else {
                if (checkLogin.hasOwnProperty("user")) {
                    headerMenuContainer.insertAdjacentHTML("beforeend", headerMenuHtml("Aaa"));
                } else {
                    headerMenuContainer.insertAdjacentHTML("beforeend", menuAuthHtml());
                }
            }
            break;
        }
    }

    if (headerListHistory.style.display === "block") {
        document.body.addEventListener("click", (e) => {
            if (!e.target.classList.contains("header__search-input")) {
                headerListHistory.style.display = "none";
            }
        });
    }
}
