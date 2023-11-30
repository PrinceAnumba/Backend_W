'use strict';

/**
 * customization service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customization.customization');
