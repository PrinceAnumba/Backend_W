"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

/**
 * customization controller
 */

module.exports = createCoreController(
  "api::customization.customization",
  ({ strapi }) => ({
    async create(ctx) {
      const variables = {
        // Pass any variables required by your Mailjet template
        email: `${JSON.parse(ctx.request.body.data).email}`,
        image: `${JSON.parse(ctx.request.body.data).image_link}`,
      };
      const emailData = {
        to: "worebercaisse@gmail.com", // Recipient email address
        subject: "New Customization Request", // Email subject
        // Define email body content using the request data
        // html: `
        //         <p>Hi,</p>
        //         <p>Someone has submitted a new customization request on Woreber.</p>
        //         <p><strong>Details:</p>
        //         <ul>

        //         <li>Email: ${JSON.parse(ctx.request.body.data).email}</li>

        //         <li>Image Uploaded: </li>

        //         <!-- Add more details from the request data here,
        //             you can use string interpolation or template literals -->
        //         </ul>
        //         <p>For more information, please check the submitted data in the Strapi admin panel.</p>
        //         <p>Thanks,</p>
        //         <p>Woreber Team</p>
        //     `,

        TemplateID: 5488052,
        Variables: {
          // Pass any variables required by your Mailjet template
          email: `${JSON.parse(ctx.request.body.data).email}`,
          image: `${JSON.parse(ctx.request.body.data).image_link}`,
        },
      };
      const data = await super.create(ctx);
      console.log(JSON.parse(ctx.request.body.data));
      // Send email after successful data creation
      await strapi.plugins.email.services.email.send({ ...emailData });

      return data;
    },
  })
);

//
