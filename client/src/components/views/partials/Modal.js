import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
    }

    async getHtml() {
        return  Handlebars.templates['modal']();
    }
}