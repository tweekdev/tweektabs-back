const UserService = require('./user.service');
const Email = require('./../utils/email');

/**
 * Get all users
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.getUsers = async (req, res) => {
  try {
    let users = await UserService.getUsers();
    res.status(201).json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      statusCode: 404,
      message: 'Users not found',
    });
  }
};

/**
 * Get the last seven users
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.getLastSevenUsers = async (req, res) => {
  try {
    let users = await UserService.getLastSevenUsers();
    res.status(201).json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
  } catch (error) {
    res.status(404).send({
      statusCode: 404,
      message: 'User not found',
    });
  }
};

/**
 * Get user by id
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.getUserById = async (req, res) => {
  try {
    let users = await UserService.getUserById(req.params.id);
    res.status(201).json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
  } catch (error) {
    res.status(404).send({
      statusCode: 404,
      message: 'User not found',
    });
  }
};

/**
 * function Signup
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.signup = async (req, res) => {
  try {
    let user = await UserService.signup(req.body, req.file);
    const url = 0;
    await new Email(user, url).sendWelcome();
    res.status(201).json({
      userId: user.userId,
      email: user.email,
      token: user.token,
      role: user.role,
      pseudo: user.pseudo,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * function login
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {
    let user = await UserService.login(req.body);
    const url = 0;
    await new Email(user, url).sendLogin();
    res.status(201).json({
      userId: user.userId,
      email: user.email,
      token: user.token,
      role: user.role,
      pseudo: user.pseudo,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * function Update user
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  try {
    let user = await UserService.updateUser(req.params.uid, req.body, req.file);
    res.status(200).json({ user: (await user).toObject({ getters: true }) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * function Update user
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  try {
    let user = await UserService.updateUser(req.params.uid, req.body, req.file);
    res.status(200).json({ user: (await user).toObject({ getters: true }) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * function Update user password
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.updateUserPassword = async (req, res) => {
  try {
    let user = await UserService.updateUserPassword(req.params.uid, req.body);
    const url = `https://tweektabs.eu/`;
    await new Email(user, url).sendUpdatePassword();
    res.status(200).json({
      status: 'success',
      message: 'Mot de passe mis à jour!',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * function D'envoie d'un token de reset mot de passe
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.forgotPassword = async (req, res) => {
  try {
    let data = await UserService.forgotPassword(req.body);
    const resetURL = `https://tweektabs.eu/${req.hostname}/resetPassword/${data.token}`;
    await new Email(data, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * function reset de mot de passe par token
 * @param { Request } req Express Request
 * @param { Response } res Express Response
 * @returns {Promise<void>}
 */
exports.resetPassword = async (req, res) => {
  try {
    let token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    let user = await UserService.resetPassword(token, req.body);
    const url = `${req.protocol}://${req.get('host')}${req.hostname}/`;
    await new Email(user, url).sendUpdatePassword();
    res.status(200).json({
      status: 'success',
      message: 'Mot de passe réinitialisé!',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
