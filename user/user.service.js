const { UserModel } = require('./user.model');

/**
 * Request in database for find all user
 * without password
 * @returns {Promise<[UserModel]>}
 */
export const getUsers = async () => {
    return UserModel.find({}, {password: -1}).populate({
        path: 'role',
        select: 'name'
    });
};

/**
 * Return the last seven users
 * @returns {Promise<*>}
 */
export const getLastSevenUsers = async () => {
    // L'ordre de requète est très important,
    // tu sort pour tire et seulement ensuite tu limit à 7
    // Et seulement après tu populate.

    /**
     * La façon dont tu l'avait fait
     * tu populate TOUTE la db
     * tu limite sur les 7 users qui arrive dans la db
     * et seulement ensuite tu sort sur c'est 7, tu n'aurai jamais le bon
     * résultat et t'façon, c'était pas bon
     */
    return UserModel.find({}, {password: -1})
        .sort({date_inscription: -1})
        .limit(7)
        .populate({
            path: 'role',
            select: 'name'
        })
};
