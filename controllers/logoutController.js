const userDB = {
    users: require("../models/users.json"),
    setUsers: function (data) { this.users = data }
};

const path = require('path');
const fsPromises = require('fs').promises;

const handleLogout = async (req, res) => {
    console.log("Logout route called");

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(200).json({ message: "No active login session" });
    }

    const refreshToken = cookies.jwt;
    const data = await fsPromises.readFile(path.join(__dirname, '..', 'models', 'users.json'), 'utf-8');
    userDB.users = JSON.parse(data);
    const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: "none", secure: true });
        return res.status(200).json({ message: "No user matched token. Cookie cleared." });
    }

    const otherUsers = userDB.users.filter(person => person.refreshToken !== refreshToken);
    const currentUser = { ...foundUser, refreshToken: "" };
    userDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(userDB.users, null, 2)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: "none", secure: true });
    res.status(200).json({ message: "Logout successful" });
};
module.exports = { handleLogout };
