import AbstractView from "./AbstractView.js";
import {paginationController} from '../utils/pagination.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Search');
    }

    async getHtml() {
        const searchKey = new URL(location.href).searchParams.get('s');
        let currentPage = new URL(location.href).searchParams.get('page');
        let sortBy = new URL(location.href).searchParams.get('sortBy');
        let type = new URL(location.href).searchParams.get('type');
        let listSort = {};
        const sortType = [
            {by: 'pop', type: 'default'},
            {by: 'time', type: 'default'},
            {by: 'sales', type: 'default'},
            {by: 'price', type: type}
        ];

        sortType.forEach(item => {
            if (item.by === sortBy) {
                listSort['by'] = item.by;
                listSort['type'] = item.type;
            }
        })
        const numberProductsPerPage = 10;
        if (!currentPage) currentPage = 1;
        currentPage = parseInt(currentPage);
        if(!currentPage || currentPage < 1)  return '<div class="app__container"><h1>404 Not Found</h1></div>';

        const listProducts = await $.ajax({
            url: `/api/products/search/${currentPage}/${listSort.by}/${listSort.type}/${searchKey}`,
        });

        const numberProducts = listProducts[0];
        let allPages = Math.ceil(parseInt(numberProducts) / numberProductsPerPage);
        if (!currentPage || currentPage > allPages || isNaN(currentPage) || !searchKey) {
            return '<div class="app__container"><h1>Không tìm thấy sản phẩm nào</h1></div>';
        };

        const products = listProducts[1]
        const arrayNumberPagination = paginationController(currentPage, allPages);

        products['key'] = searchKey;
        products['productsFound'] = numberProducts;
        products['page'] = currentPage;
        products['allPages'] = allPages;
        products['paginationNumber'] = arrayNumberPagination;
        Handlebars.partials = Handlebars.templates;
        return Handlebars.templates['search'](products);
    }
}