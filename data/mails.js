const genResetMail = data => {
  const { host, token, email } = data;
  return {
    to: email,
    from: "passwordreset@demo.com",
    subject: "Node.js Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://${host}/reset/${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };
};

const genAuthEmail = data => {
  const { host, hash, email } = data;
  return {
    to: email,
    subject: "Hello ✔",
    text: "E-mail Подтверждение",
    html: `<a href="http://${host}/action/activate?q=${hash}">Verify!</a>`
  };
};

module.exports = { genResetMail, genAuthEmail };
