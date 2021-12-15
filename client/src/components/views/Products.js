import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.productId = params.id.split('/')[0];
    }

    async getHtml() {
        const product = await $.ajax({
            url: '/api/products/' + this.productId,
        });

        if (product) {
            this.setTitle(product.name)
            return Handlebars.templates['showProduct'](product)
        } else {
            return '<div class="app__container"><h1>404 Not Found</h1></div>';
        }
    }
}