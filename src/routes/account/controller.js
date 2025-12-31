const { Account, Profile } = require('../../resources')
const { utils, errors, Debug } = require('../../libs')
const htmlTemplate = require('./html-template')

const debug = Debug()
const {
    NotFoundError,
    DataError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
    DuplicatedError,
} = errors

exports.register = async ctx => {
    const item = ctx.request.body

    const account = {
        gmail: item.gmail,
        password: item.password,
    }

    const check = await Account.Model.getAccountByGmail(item.gmail)

    if (check) {
        throw new DuplicatedError('Gmail đã được sử dụng')
    }

    const accountId = await Account.Model.createAccount(account)

    const profile = {
        ...item,
        accountId: accountId,
    }

    delete profile.gmail
    delete profile.password

    await Profile.Model.createProfile(profile)

    ctx.body = 'success'
}

exports.login = async ctx => {
    const { gmail, password } = ctx.request.body

    const account = await Account.Model.getAccountByGmail(gmail)

    if (!account) {
        throw new ValidationError('User not found')
    }

    if (!utils.verifyPassword(password, account.hashPassword)) {
        throw new ValidationError('Password is incorrect')
    }

    delete account.hashPassword

    const profile = await Profile.Model.getProfileByAccountId(account._id)
    if (!profile) {
        throw new ValidationError('User not found')
    }

    if (profile.isDeleted == true) {
        throw new PermissionError('Account is locked by admin.Please contact us to resolve')
    }

    ctx.body = {
        ...profile,
        isAdmin: false,
        accessToken: utils.generateAccessToken(profile),
        refreshToken: utils.generateRefreshToken(profile),
    }
}

exports.changePassword = async ctx => {
    const { oldPassword, newPassword } = ctx.request.body
    const profile = ctx.state.profile

    await Account.Model.changePassword(profile.accountId, oldPassword, newPassword)

    ctx.body = 'success'
}

exports.forgotPassword = async ctx => {
    const { gmail } = ctx.request.body

    const account = await Account.Model.getAccountByGmail(gmail)

    if (!account || account.isDeleted) {
        throw new NotFoundError('Not fount gmail')
    }

    const token = utils.randomAsciiString(6)
    debug.log(key)

    const gmailSubject = 'Reset password - App cinema'

    utils.sendMail(gmail, gmailSubject, null, htmlTemplate.verifyForgotPassword(gmail, token))

    ctx.body = 'success'
}

exports.verifyTokenForgotPassword = async ctx => {
    ctx.body = 'success'
}

async function checkToken(key, token) {}
