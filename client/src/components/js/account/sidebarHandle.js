export async function getAvatarUrl() {
    const avatarUrl = await $.ajax({
        url: "/user_info/get_avatar",
    });

    return avatarUrl;
}

export async function getUsername() {
    const username = await $.ajax({
        url: "/user_info/get_username",
    });

    return username;
}
