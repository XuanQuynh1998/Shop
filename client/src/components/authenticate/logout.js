export function logout() {
    $.ajax({
        url: '/buyer/logout'
    }).done(res => {
        window.location.reload();
    })
}