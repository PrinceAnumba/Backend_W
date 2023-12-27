("use strict");
const axios = require("axios");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const {
      transaction_id,
      amount,
      currency,
      description,
      customer_name,
      customer_surname,
      customer_phone_number,
      customer_email,
      customer_address,
      customer_city,
      customer_country,
      customer_state,
      customer_zip_code,
      message,
      cart,
    } = ctx.request.body; // Get form data from request body

    // Validate form data (amount, currency, etc.)

    // Prepare CinetPay request data
    const cnetpayData = {
      // Include relevant data from form (amount, currency, etc.)
      transaction_id,
      amount,
      currency,
      description,
      customer_name,
      customer_surname,
      customer_phone_number,
      customer_email,
      customer_address,
      customer_city,
      customer_country,
      customer_state,
      lock_phone_number: false,
      customer_zip_code,
      apikey: process.env.CINETPAY_APIKEY, // Your CinetPay API key
      site_id: process.env.CINETPAY_SITE_ID, // Your CinetPay site ID
      notify_url: process.env.FRONTEND_URL, // URL to receive payment notifications
      return_url: `${process.env.FRONTEND_URL}`, // URL to redirect user after payment
      channels: "ALL", // Available payment channels (can be customized)
    };
    console.log(cnetpayData.return_url)

    try {
          const createdOrder = await strapi.service("api::order.order").create({
            data: {
              amount,
              currency,
              description,
              customer_name,
              customer_surname,
              customer_phone_number,
              customer_email,
              customer_address,
              customer_city,
              customer_country,
              customer_state,
              lock_phone_number: false,
              customer_zip_code,
              transaction_id: cnetpayData.transaction_id,
              message,
              cart,
            },
          });
          return ctx.send({
            message: "Order created successfully!",
            id: createdOrder.id,
            // paymentUrl: response.data.data.payment_url,
            // paymentToken: response.data.data.payment_token,
            // (Optional) Include initial payment status if desired
          });
    } catch (error) {
      console.error("Error submitting checkout form:", error);
        return ctx.badRequest({
          message: "Error submitting checkout form.",
          error,
        });
    }

    // Make POST request to CinetPay API
    // try {
    //   const response = await axios.post(
    //     "https://api-checkout.cinetpay.com/v2/payment",
    //     cnetpayData,
    //     { headers: { "Content-Type": "application/json" } }
    //   );

    //   if (response.status === 200) {
    //     // Success! Create order and redirect user
    //     await strapi.service("api::order.order").create({
    //       data: {
    //         amount,
    //         currency,
    //         description,
    //         customer_name,
    //         customer_surname,
    //         customer_phone_number,
    //         customer_email,
    //         customer_address,
    //         customer_city,
    //         customer_country,
    //         customer_state,
    //         lock_phone_number: false,
    //         customer_zip_code,
    //         transaction_id: response.data.api_response_id,
    //         message,
    //         cart,
    //       },
    //     });

       
    //     return ctx.send({
    //       message: "Order created successfully!",
    //       paymentUrl: response.data.data.payment_url,
    //       paymentToken: response.data.data.payment_token,
    //        // (Optional) Include initial payment status if desired
    //     });
    //   } else {
    //     // Log detailed response information in case of a 400 error
    //     console.error("CinetPay API Error:", response.status, response.data);

    //     // Handle error
    //     return ctx.badRequest({
    //       message: "Error creating order!",
    //       error: response.data,
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error submitting checkout form:", error);
    //   return ctx.badRequest({
    //     message: "Error submitting checkout form.",
    //     error,
    //   });
    // }
  },
}));
