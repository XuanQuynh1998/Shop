import AbstractView from "./AbstractView.js";
import { paginationController } from "../utils/pagination.js";

export default class extends AbstractView {
    constructor(params, page) {
        super(params);
        this.setTitle("My Shop");
        this.page = page;
    }

    async getHtml() {
        let currentPage = new URL(location.href).searchParams.get("page");
        let sortBy = new URL(location.href).searchParams.get("sortBy");
        let type = new URL(location.href).searchParams.get("type");

        const sortType = [
            { by: "pop", type: "default" },
            { by: "time", type: "default" },
            { by: "sales", type: "default" },
            { by: "price", type: type },
        ];

        let listSort = {
            by: sortType[0].by,
            type: sortType[0].type,
        };

        sortType.forEach((item) => {
            if (item.by === sortBy) {
                listSort["by"] = item.by;
                listSort["type"] = item.type;
            }
        });

        if (currentPage === null) currentPage = 1;
        currentPage = parseInt(currentPage);
        if (!currentPage || currentPage < 1) return '<div class="app__container"><h1>404 Not Found</h1></div>';

        const listProducts = await $.ajax({
            url: `/api/products/page/${currentPage}/${listSort.by}/${listSort.type}`,
        });
        const numberProductsPerPage = 10;
        const numberProducts = listProducts[0];
        const products = listProducts[1];

        let allPages = Math.ceil(parseInt(numberProducts) / numberProductsPerPage);

        if (!currentPage || currentPage > allPages || isNaN(currentPage)) {
            return '<div class="app__container"><h1>404 Not Found</h1></div>';
        }
        const arrayNumberPagination = paginationController(currentPage, allPages);

        products["page"] = currentPage;
        products["allPages"] = allPages;
        products["paginationNumber"] = arrayNumberPagination;
        Handlebars.partials = Handlebars.templates;
        return Handlebars.templates["home"](products);
    }
}
