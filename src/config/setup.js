import AdminJS from 'adminjs';
import AdminJSFastify from '@adminjs/fastify';
import * as AdminJSMongoose from '@adminjs/mongoose';
import * as Models from '../models/index.js';
import { authenticate, COOKIE_PASSWORD, sessionStore } from './config.js';
import { dark, light } from '@adminjs/themes';

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ['phoneNumber', 'role', 'isActivated'],
        filterProperties: ['phoneNumber', 'role'],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role'],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ['email', 'role', 'isActivated'],
        filterProperties: ['email', 'role'],
      },
    },
    {
      resource: Models.Branch,
    },
    {
      resource: Models.Product,
    },
    {
      resource: Models.Category,
    },
    {
      resource: Models.Counter,
    },
    {
      resource: Models.Order,
    },
  ],
  branding: {
    companyName: 'Blinkit',
    withMadeWithLove: false,
    favicon:
      'https://res.cloudinary.com/dl31v21kv/image/upload/v1733668641/efdvsizo9fidwlqeqvl1.png',
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light],
  rootPath: '/admin',
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiepassword: COOKIE_PASSWORD,
      cookieName: 'adminjs',
    },
    app,
    {
      store: sessionStore,
      saveUnintialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );
};
