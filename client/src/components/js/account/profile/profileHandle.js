export async function uploadUserInfo(formData) {
    const uploadResult = await $.ajax({
        type: "POST",
        url: "/user_info/profile/update",
        contentType: false,
        processData: false,
        enctype: "multipart/form-data",
        data: formData,
    });

    return uploadResult;
}

export async function getProfileData() {
    const profileData = await $.ajax({
        url: "/user_info/profile",
    });

    return profileData;
}
