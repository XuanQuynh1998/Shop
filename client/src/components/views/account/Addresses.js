import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
    }

    async getHtml() {
        return Handlebars.templates["addresses"]();
    }
}
