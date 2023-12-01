const stripe = require("stripe")(process.env.STRIPE_KEY);

("use strict");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { email, products, phoneNumber } = ctx.request.body;

    if (!products || !Array.isArray(products)) {
      ctx.response.status = 400; // Bad Request
      return { error: "Invalid products data" };
    }

    const lineItems = await Promise.all(
      products.map(async (product) => {
        const item = await strapi
          .service("api::product.product")
          .findOne(product.id);
        console.log(item);
        return {
          price_data: {
            currency: "xof",
            product_data: {
              name: item.Title,
            },
            unit_amount: item.Price,
          },
          quantity: product.quantity,
        };
      })
    );

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/OnlineShop/PaymentSuccess`,
        cancel_url: `${process.env.CLIENT_URL}/OnlineShop/PaymentFailed`,
        line_items: lineItems,
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "TG", "NG", "FR", "GH"],
        },
        phone_number_collection: {
          enabled: true,
        },
        customer_email: email,
        payment_method_types: ["card"],
      });

      // Listen for the checkout.session.completed webhook event
      stripe.on("checkout.session.completed", async (event) => {
        const session = event.data;
        const customerEmail = session.customer_details;
        console.log(customerEmail);
      });

      await strapi.service("api::order.order").create({
        data: {
          products: products,
          stripeId: session.id,
          email: email, // Store the customer email in the order object
          phone_number: phoneNumber, // Store the customer's phone number in the order object
        },
      });

      return { stripeSession: session };
    } catch (err) {
      ctx.response.status = 500;
      return console.log(err);
    }
  },
}));
