import mongoose from "mongoose";

//* Base User Schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["CUSTOMER", "ADMIN", "DELIVERYPARTNER"],
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
});

//* Customer Schema

const customerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["CUSTOMER"],
    default: "CUSTOMER",
  },
  liveLocation: {
    latitude: { type: Number },
    longitutude: { type: Number },
  },
  address: {
    type: String,
  },
});

//* Delivery Partner Schema

const deliveryPartnerSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["DELIVERYPARTNER"],
    default: "DELIVERYPARTNER",
  },
  liveLocation: {
    latitude: { type: Number },
    longitutude: { type: Number },
  },
  address: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});

//* Admin Schema

const adminSchema = new mongoose.Schema({
  ...userSchema.obj,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN"],
    default: "ADMIN",
  },
});

const Customer = mongoose.model("Customer", customerSchema);
const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);
const Admin = mongoose.model("Admin", adminSchema);

export { Customer, DeliveryPartner, Admin };
