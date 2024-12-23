import { Customer, DeliveryPartner } from '../../models/index.js';

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    let userModel;

    if (user.role === 'CUSTOMER') {
      userModel = Customer;
    } else if (user.role === 'DELIVERYPARTNER') {
      userModel = DeliveryPartner;
    } else {
      return res.status(403).send({ message: 'Invalid Role' });
    }

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    return res
      .status(200)
      .send({ message: 'User updated successfully', updateUser });
  } catch (error) {}
};
