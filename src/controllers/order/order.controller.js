import {
  Customer,
  Order,
  Branch,
  DeliveryPartner,
} from '../../models/index.js';

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.user;

    const { items, totalPrice, branch } = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);

    if (!customerData) {
      return res.status(404).send({ message: 'Customer not found' });
    }

    const newOrder = new Order({
      customer: userId,
      branch,
      items: items.map((item) => {
        return {
          id: item.id,
          item: item.item,
          count: item.count,
        };
      }),
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || 'No Address Available',
      },
      pickupLocation: {
        latitude: branchData.liveLocation.latitude,
        longitude: branchData.liveLocation.longitude,
        address: branchData.address || 'No Address Available',
      },
    });

    const savedOrder = await newOrder.save();

    return res
      .status(201)
      .send({ message: 'Order created successfully', savedOrder });
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;

    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return res.status(404).send({ message: 'Delivery person not found' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    if (!order.status === 'available') {
      return res.status(400).send({ message: 'Order is not available' });
    }

    order.status = 'confirmed';

    order.deliveryPartner = userId;
    order.deliveryLocation = {
      latitude: deliveryPersonLocation.latitude,
      longitude: deliveryPersonLocation.longitude,
      address: deliveryPersonLocation.address || 'No Address Available',
    };

    const savedOrder = await order.save();

    return res.status(200).send({ message: 'Order confirmed', savedOrder });
  } catch (error) {
    res.status(500).send({ message: 'Failed to confirm order', error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ message: 'Failed to update order status', error });
  }
};
