let errorMessages = {
    login: `<div class="ui negative message"><i class="close icon"></i><div class="header">Invalid E-mail address or password</div><p>Please try again</p></div>`,
    signUp: `<div class="ui negative message"><i class="close icon"></i><div class="header">Unable to register user with this email address.</div><p>Please try using a different email.</p></div>`,
    profile: `<div class="ui negative message"><i class="close icon"></i><div class="header">Unable to update profile.</div><p>Please make sure no field is left empty.</p></div>`,
    profileUpdated: `<div class="ui positive message"><i class="close icon"></i><div class="header">Profile Updated!</div><p>Your information was successfully saved.</p></div>`
}

module.exports = errorMessages