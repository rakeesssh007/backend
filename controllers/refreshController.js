const userDB = {
    users: require("../models/users.json"),
    setUsers: function (data) { this.users = data }
};

const jwt = require('jsonwebtoken');
const path = require('path');
const fsPromises = require('fs').promises;
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const data = await fsPromises.readFile(path.join(__dirname, '..', 'models', 'users.json'), 'utf-8');
    userDB.users = JSON.parse(data);

    const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403);

    const roles = Object.values(foundUser.roles);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '120s' }
            );

            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };
