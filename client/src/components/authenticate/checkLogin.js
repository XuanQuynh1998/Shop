export async function checkLoginUser() {
    return await $.ajax({
        url: "/api/user",
    });
}
