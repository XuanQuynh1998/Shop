const User = require("../models/User");
const Checkout = require("../models/Checkout");
const imageHandler = require("../utils/imageHandler");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const phoneValidation = (phone) => {
    return phone.match("^[0-9]*$") && phone.length >= 10;
};

const nameValidation = (name) => {
    return name.match(/^[A-Za-z\s]+$/);
};

const checkDate = (Date) => {
    const day = +Date.split("/")[0];
    const month = +Date.split("/")[1];
    const year = +Date.split("/")[2];

    console.log(day, month, year);

    const listOfMonthsHas30Day = [4, 6, 9, 11];

    const isLeapYear = (year) => {
        if ((year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
            return true;
        }
        return false;
    };

    if (listOfMonthsHas30Day.includes(month)) {
        if (day > 30) {
            return false;
        }
    }

    if (month === 2) {
        if (day > 29) {
            return false;
        } else {
            if (!isLeapYear(year)) {
                if (day > 28) {
                    return false;
                }
            }
        }
    }
    return true;
};

class UserInfoController {
    async profile(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const userInfo = await User.find(
                    { username: username },
                    {
                        _id: 0,
                        username: 1,
                        profile: 1,
                        address: 1,
                    }
                );
                res.json(...userInfo);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateProfile(req, res, next) {
        const getCurrentAvatarId = async (username) => {
            const userProfile = await User.findOne({ username: username }, { profile: 1 });
            const avatarUrl = userProfile.profile.avatar;

            return avatarUrl.split("/").pop();
        };

        try {
            if (req.user) {
                const username = req.user.username;
                const defaultAvatarId = "1YjsnvDeH0jbVa3_xRNuZLM44zDiSm-EN";
                const googleDriveFolderId = "1HqjBPhlsgpuJJVcgcY6v9F-gMlEar1mB";

                const upload = multer({ dest: "./uploads/" }).single("avatar");
                upload(req, res, async function () {
                    let userProfile = req.body;
                    if (!phoneValidation(userProfile.phone) || !checkDate(userProfile.birthday)) {
                        return res.json({ success: false });
                    }

                    if (req.file) {
                        const currentAvatarId = await getCurrentAvatarId(username);
                        if (currentAvatarId !== defaultAvatarId) {
                            await imageHandler.removePreAvatar(currentAvatarId);
                        }

                        const avatarUrl = await imageHandler.uploadImage(googleDriveFolderId);
                        userProfile["avatar"] = avatarUrl;

                        await User.findOneAndUpdate({ username: username }, { profile: userProfile });
                        return res.json({
                            success: true,
                            avatarUrl: avatarUrl,
                        });
                    }
                    await User.updateOne(
                        { username: username },
                        {
                            "profile.name": userProfile.name,
                            "profile.phone": userProfile.phone,
                            "profile.gender": userProfile.gender,
                            "profile.birthday": userProfile.birthday,
                        }
                    );
                    return res.json({ success: true });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getUserAvatar(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const userProfile = await User.findOne({ username: username }, { profile: 1 });
                return res.json(userProfile.profile.avatar);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getUsername(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                return res.json(username);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllUserAddresses(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const userInfo = await User.findOne({ username: username }, { addresses: 1 });

                return res.json(userInfo);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getUserAddresses(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const addressesId = req.params.id;

                const userInfo = await User.findOne(
                    {
                        username: username,
                        "addresses._id": addressesId,
                    },
                    { "addresses.$": 1 }
                );

                return res.json(userInfo);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async setDefaultAddresses(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const addressId = req.body.addressId;

                // Remove defaut address
                await User.updateOne(
                    {
                        username: username,
                        addresses: { $elemMatch: { setDefault: true } },
                    },
                    { $set: { "addresses.$.setDefault": false } }
                );

                // Add defaut address
                await User.updateOne(
                    {
                        username: username,
                        addresses: { $elemMatch: { _id: addressId } },
                    },
                    { $set: { "addresses.$.setDefault": true } }
                );

                return res.json({ success: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
    async getLocation(req, res, next) {
        try {
            const locationType = req.params.type;
            const locationJsonPath = path.join("./", "json", "location.json");
            const locationJsonBuffer = fs.readFileSync(locationJsonPath);

            const locationJson = JSON.parse(locationJsonBuffer);

            switch (locationType) {
                case "province": {
                    const listProvinces = locationJson.map((locationItem) => {
                        return locationItem.Name.replace("Tỉnh ", "").replace("Thành phố ", "");
                    });

                    return res.json(listProvinces);
                }

                case "district": {
                    const currentProvince = req.query.province;
                    if (currentProvince) {
                        const provinceInfo = locationJson.filter((locationItem) => {
                            return locationItem.Name.includes(currentProvince);
                        });

                        const listDistrictsInfo = provinceInfo[0].Districts;

                        const listDistricts = listDistrictsInfo.map((district) => {
                            return district.Name;
                        });

                        return res.json(listDistricts);
                    }
                    break;
                }

                case "ward": {
                    const currentProvince = req.query.province;
                    const currentDistrict = req.query.district;
                    if (currentProvince && currentDistrict) {
                        const provinceInfo = locationJson.filter((locationItem) => {
                            return locationItem.Name.includes(currentProvince);
                        });

                        const listDistrictsInfo = provinceInfo[0].Districts;

                        const currentDistrictInfo = listDistrictsInfo.filter((district) => {
                            return district.Name.includes(currentDistrict);
                        });

                        const listwardInfo = currentDistrictInfo[0].Wards;

                        const listWards = listwardInfo.map((ward) => {
                            return ward.Name;
                        });

                        return res.json(listWards);
                    }
                    break;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async setLocation(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const upload = multer().any();

                upload(req, res, async function (err) {
                    let newAddressInfo = req.body;
                    if (!phoneValidation(newAddressInfo.phone) || !nameValidation(newAddressInfo.fullName)) {
                        return res.json({ success: false });
                    }

                    if (newAddressInfo) {
                        newAddressInfo.address = JSON.parse(newAddressInfo.address);

                        if (JSON.parse(newAddressInfo.setDefault)) {
                            await User.updateOne(
                                {
                                    username: username,
                                    addresses: { $elemMatch: { setDefault: true } },
                                },
                                { $set: { "addresses.$.setDefault": false } }
                            );
                        }

                        await User.updateOne({ username: username }, { $push: { addresses: newAddressInfo } });

                        return res.json({ success: true });
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async editLocation(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const upload = multer().any();

                upload(req, res, async function (err) {
                    const editAddressData = req.body;
                    if (!phoneValidation(editAddressData.phone) || !nameValidation(editAddressData.fullName)) {
                        return res.json({ success: false });
                    }

                    editAddressData.address = JSON.parse(editAddressData.address);
                    editAddressData.setDefault = JSON.parse(editAddressData.setDefault);

                    if (editAddressData.setDefault) {
                        await User.updateOne(
                            {
                                username: username,
                                addresses: { $elemMatch: { setDefault: true } },
                            },
                            { $set: { "addresses.$.setDefault": false } }
                        );
                    }

                    await User.updateOne(
                        { username: username, "addresses._id": editAddressData.addressId },
                        { $set: { "addresses.$": editAddressData } }
                    );

                    return res.json({ success: true });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async removeLocation(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const addressId = req.params.id;

                await User.updateOne({ username: username }, { $pull: { addresses: { _id: addressId } } });

                return res.json({ success: true });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async searchOrder(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const searchKey = req.query.key;

                const searchResult = await Checkout.find({ username: username, $text: { $search: `${searchKey}` } });

                console.log(searchResult);

                return res.json({ success: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new UserInfoController();
