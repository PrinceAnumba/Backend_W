const stripe = require("stripe")(process.env.STRIPE_KEY);

("use strict");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { email, products } = ctx.request.body;
    console.log(process.env.STRIPE_KEY);
    if (!products || !Array.isArray(products)) {
      ctx.response.status = 400; // Bad Request
      const dat = console.log(products);
      return { error: "Invalid products data", dat };
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
        cancel_url: `${process.env.CLIENT_URL}?success=false`,
        line_items: lineItems, // Corrected field name
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "TG", "NG", "FR", "GH"],
        },
        payment_method_types: ["card"], // Corrected field name
      });

      await strapi.service("api::order.order").create({
        data: {
          products: products,
          stripeId: session.id,
          email: ctx.request.body.email
        },
      });

      return { stripeSession: session };
    } catch (err) {
      ctx.response.status = 500;
      return err;
    }
  },
}));
