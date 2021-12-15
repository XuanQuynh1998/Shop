module.exports = {
    sortHandle: function (req) {
        let numberPage = parseInt(req.params.page);
        let sortType = req.params.sort;

        let sortOptions = {};
        const sortList = [
            { type: "time", by: "createdAt", sort_by: "desc" },
            { type: "sales", by: "sold", sort_by: "desc" },
            { type: "price", by: "price", sort_by: "" },
        ];
        sortList.forEach((item) => {
            if (item.type === sortType) {
                if (sortType === "price") {
                    sortOptions[item.by] = req.params.type;
                } else {
                    sortOptions[item.by] = item.sort_by;
                }
            }
        });

        let searchOptions = {
            limit: 10,
            skip: 10 * numberPage - 10,
        };
        return [searchOptions, sortOptions];
    },
};
