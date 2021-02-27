const UserService = require('./user.service');

/**
 * Get all users
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
export const getUsers = async (req, res) => {
    try {
        res.send(await UserService.getUsers());
    } catch (error) {
        res
            .status(404)
            .send(
                {
                    statusCode: 404,
                    message: 'Users not found',
                }
            );
    }
};

/**
 * Get the last seven users
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
export const getLastSevenUsers = async (req, res) => {
    try {
        res.send(UserService.getLastSevenUsers());
    } catch (error) {
        res
            .status(404)
            .send(
                {
                    statusCode: 404,
                    message: 'User not found',
                }
            );
    }
}
