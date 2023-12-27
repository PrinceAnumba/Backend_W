// config/custom.js
("use strict");


module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "strapi-provider-email-mailjet",
      providerOptions: {
        publicApiKey: process.env.MAILJET_API_KEY, // Use MAILJET_API_KEY defined in server-side environment
        secretApiKey: process.env.MAILJET_API_SECRET,
        // Add other Mailjet configuration options if needed
      },
      settings: {
        defaultFrom: process.env.REACT_PUBLIC_SMTP_DEFAULT_FROM,
        defaultTo: process.env.REACT_PUBLIC_SMTP_DEFAULT_REPLY_TO,
      },
    },
  },
});
 