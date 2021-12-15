export function saveHistory(searchInput) {
    if (!localStorage.getItem('history') && searchInput) {
        localStorage.setItem('history', JSON.stringify([searchInput]));
    }
    let listHistory = JSON.parse(localStorage.getItem('history'));
    if (searchInput) {
        if (listHistory.length < 10) {
            if (!listHistory.includes(searchInput)) {
                listHistory.push(searchInput);
            }
        } else {
            listHistory.shift();
            listHistory.push(searchInput);
        }
        localStorage.setItem('history', JSON.stringify(listHistory));
    }
}