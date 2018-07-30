module.exports = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "pkizeev@gmail.com", // generated ethereal user
    pass: "p244w0rdp244w0rd" // generated ethereal password
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
};
