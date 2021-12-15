const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: String,
    password: String,
    profile: {
        avatar: {
            type: String,
            default: "https://lh3.googleusercontent.com/d/1YjsnvDeH0jbVa3_xRNuZLM44zDiSm-EN",
        },
        name: String,
        phone: String,
        gender: String,
        birthday: String,
    },
    addresses: [
        {
            address: Array,
            fullName: String,
            phone: String,
            setDefault: { type: Boolean, default: false },
        },
    ],
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
