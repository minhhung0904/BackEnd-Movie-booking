const NewSchema = require('./schema-mg')


exports.create = async fields => {
    const newi = await NewSchema.create(fields)

    return newi
}

exports.getList = async limit => {
    const data = await NewSchema.find().sort({createdAt: -1}).limit(limit).lean()

    return data
}
