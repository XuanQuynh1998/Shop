export function checkPaginationButton(currentPage, allPages) {
    currentPage = parseInt(currentPage);
    allPages = parseInt(allPages);
    // const allPages = +document.querySelector('.home-filter__page-number').innerText;
    if (currentPage === 1) {
        document.querySelector(".home-filter__prev-btn").classList.add("home-filter__page-btn--disabled");
        document.querySelector(".pagination-item__link-left-btn").classList.add("home-filter__page-btn--disabled");
    }
    if (currentPage === allPages) {
        document.querySelector(".home-filter__next-btn").classList.add("home-filter__page-btn--disabled");
        document.querySelector(".pagination-item__link-right-btn").classList.add("home-filter__page-btn--disabled");
    }
    document.querySelectorAll(".pagination-item").forEach((element) => {
        if (parseInt(element.firstElementChild.innerText) === currentPage) {
            element.classList.add("pagination-item--active");
        }
    });
}

export function paginationHandle(currentPage, element) {
    currentPage = parseInt(currentPage);
    const searchKey = new URL(location.href).searchParams.get("s");
    const sortBy = new URL(location.href).searchParams.get("sortBy");
    const sortType = new URL(location.href).searchParams.get("type");
    if (element.classList.contains("home-filter__page-btn") || element.classList.contains("pagination-item__link")) {
        if (
            element.classList.contains("home-filter__next-btn") ||
            element.classList.contains("pagination-item__link-right-btn")
        ) {
            currentPage += 1;
        }
        if (
            element.classList.contains("home-filter__prev-btn") ||
            element.classList.contains("pagination-item__link-left-btn")
        ) {
            currentPage -= 1;
        }
    }
    if (searchKey) {
        if (sortBy) {
            if (sortType) {
                return `?s=${searchKey}&page=${currentPage}&sortBy=${sortBy}&type=${sortType}`;
            }
            return `?s=${searchKey}&page=${currentPage}&sortBy=${sortBy}`;
        }
        return `?s=${searchKey}&page=${currentPage}`;
    }
    if (sortBy) {
        if (sortType) {
            return `?page=${currentPage}&sortBy=${sortBy}&type=${sortType}`;
        }
        return `?page=${currentPage}&sortBy=${sortBy}`;
    }
    return `?page=${currentPage}`;
}

export function paginationController(page, allPages) {
    let arrayNumberPagination;

    function createArray(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }

    if (allPages <= 5) {
        arrayNumberPagination = createArray(1, allPages);
    }
    if (allPages > 5) {
        if (page < 5) {
            arrayNumberPagination = createArray(1, 5);
            arrayNumberPagination.push("...");
        }
        if (page >= 5 && allPages <= 7) {
            arrayNumberPagination = createArray(1, allPages);
        }
        if (allPages > 7) {
            if (page === 5) {
                arrayNumberPagination = createArray(1, page + 2);
                arrayNumberPagination.push("...");
            }
            if (page > 5) {
                if (page < allPages - 2) {
                    arrayNumberPagination = [];
                    arrayNumberPagination.push(1, 2, "...");
                    arrayNumberPagination = arrayNumberPagination.concat(createArray(page - 2, page + 2));
                    arrayNumberPagination.push("...");
                }
                if (page >= allPages - 2) {
                    arrayNumberPagination = [];
                    arrayNumberPagination.push(1, 2, "...");
                    arrayNumberPagination = arrayNumberPagination.concat(createArray(allPages - 4, allPages));
                }
            }
        }
    }
    return arrayNumberPagination;
}
