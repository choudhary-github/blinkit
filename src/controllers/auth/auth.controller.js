import 'dotenv/config.js';
import { Customer, DeliveryPartner } from '../../models/index.js';
import jwt from 'jsonwebtoken';

// Updated generateToken function that doesn't handle the response directly
const generateToken = async (user) => {
  if (!user.isActivated) {
    throw new Error('User is not activated');
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '3d' }
  );

  return { accessToken, refreshToken };
};

// Customer Login
export const loginCustomer = async (req, res) => {
  try {
    const phoneNumber = req.body?.phoneNumber;

    if (!phoneNumber) {
      return res.status(400).send({ message: 'Phone number is mandatory' });
    }

    let customer = await Customer.findOne({ phoneNumber });

    if (!customer) {
      customer = new Customer({
        phoneNumber,
        isActivated: true, // Assuming the customer is activated after creation
      });
      await customer.save();
    }

    if (!customer.isActivated) {
      return res
        .status(401)
        .send({ message: 'You are not authorized to login' });
    }

    const { accessToken, refreshToken } = await generateToken(customer);

    return res.status(200).send({
      message: customer
        ? 'Login Successful'
        : 'User created and Login Successful',
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' });
  }
};

// Delivery Partner Login
export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: 'Email and Password are mandatory' });
    }

    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).send({ message: 'Delivery partner not found' });
    }

    // For demonstration purposes: comparing passwords directly (use bcrypt in production)
    if (password !== deliveryPartner.password) {
      return res.status(400).send({ message: 'Invalid Credentials' });
    }

    if (!deliveryPartner.isActivated) {
      return res
        .status(401)
        .send({ message: 'You are not authorized to login' });
    }

    const { accessToken, refreshToken } = await generateToken(deliveryPartner);

    return res.status(200).send({
      message: 'Login Successful',
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send({ message: 'Refresh token is required' });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    let user;

    if (decodedToken.role === 'CUSTOMER') {
      user = await Customer.findById(decodedToken.userId);
    } else if (decodedToken.role === 'DELIVERYPARTNER') {
      user = await DeliveryPartner.findById(decodedToken.userId);
    } else {
      return res.status(403).send({ message: 'Invalid Role' });
    }

    if (!user) {
      return res.status(403).send({ message: 'Refresh token is invalid' });
    }

    if (!user.isActivated) {
      return res
        .status(401)
        .send({ message: 'You are not authorized to login' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateToken(
      user
    );

    return res.status(200).send({
      message: 'Token refreshed',
      accessToken,
      newRefreshToken,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(403).send({ message: 'Refresh token is invalid' });
  }
};

export const fetchUser = async (req, res) => {
  const { userId, role } = req.user;

  let user;

  if (role === 'CUSTOMER') {
    user = await Customer.findById(userId);
  } else if (role === 'DELIVERYPARTNER') {
    user = await DeliveryPartner.findById(userId);
  } else {
    return res.status(403).send({ message: 'Invalid Role' });
  }

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  return res.status(200).send({ message: 'User fetched successfully', user });
};
