const TypeModel = require('./type.model');
/**
 * Request in database for find all type
 * @returns {Promise<[TypeModel]>}
 */
exports.getTypes = async () => {
    try {
        return TypeModel.find({});
    } catch (error) {
        console.error(error);
    }
};

/**
 * Return the type by id
 * @returns {Promise<*>}
 */
exports.getTypeById = async (id) => {
    console.log('/user-by-id');
    try {
        return TypeModel.find({ _id: id });
    } catch (e) {
        throw new Error(e);
    }
};



/**
 * Return type after creation
 * @returns {Promise<*>}
 */
exports.createType = async (type, userData) => {
    console.log(`/create-type-service`);
    let existingType;
    try {
        existingType = await TypeModel.findOne({ name: type.name });
    } catch (e) {
        throw new Error('Ce type existe déja.');
    }
    if (existingType) throw new Error('Ce type existe déja.');

    const createdType = new TypeModel({
        name: type.name,
        creator: userData.userId,
    });

    try {
        return await createdType.save();
    } catch (error) {
        throw new Error(e);
    }
};

/**
 * Return type after update
 * @returns {Promise<*>}
 */
exports.updateType = async (typeData, id) => {
    console.log(`/update-type-service`);
    let type;
    try {
        type = await TypeModel.findById(id);
    } catch (e) {
        throw new Error("Une erreur c'est produite.");
    }
    type.name = typeData.name;
    try {
        return await type.save();
    } catch (e) {
        throw new Error("Une erreur c'est produite.");
    }
}