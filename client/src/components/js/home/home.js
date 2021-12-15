import * as Pagination from "../../utils/pagination.js";
import * as SortProducts from "../../utils/sort.js";

export function pageHandle(element, event) {
    const listHomeAttr = ["data-link", "pagination-button", "pagination-number", "sort-button", "sort-price"];

    let result;

    const getCurrentPage = () => {
        let currentPage = new URL(location.href).searchParams.get("page");

        if (currentPage === null) {
            currentPage = "1";
        } else {
            currentPage = currentPage.split("/")[0];
        }
        return parseInt(currentPage);
    };

    listHomeAttr.some((attr) => {
        if (attr.match(element.getAttribute("home-attr"))) {
            result = [attr, element];
            return true;
        }
    });

    switch (result[0]) {
        case "data-link":
            event.preventDefault();
            return result[1].href;

        case "pagination-button":
            return Pagination.paginationHandle(getCurrentPage(), result[1]);

        case "pagination-number":
            const currentPage = result[1].innerText;
            return Pagination.paginationHandle(currentPage, result[1]);

        case "sort-button":
            event.preventDefault();
            return SortProducts.sortProducts(result[1]);

        case "sort-price":
            event.preventDefault();
            return SortProducts.sortByPrice(result[1]);
    }
}
