const User = require('./User');
const Plot = require('./Plot');
const HouseDesign = require('./HouseDesign');
const Inquiry = require('./Inquiry');
const OwnerInfo = require('./OwnerInfo');
const Settings = require('./Settings');

// Define associations
User.hasMany(Inquiry, { foreignKey: 'user_id', as: 'inquiries' });
Inquiry.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Plot.hasMany(Inquiry, { foreignKey: 'plot_id', as: 'inquiries' });
Inquiry.belongsTo(Plot, { foreignKey: 'plot_id', as: 'plot' });

// Plot-HouseDesign relationship
Plot.hasMany(HouseDesign, { foreignKey: 'plot_id', as: 'houseDesigns' });
HouseDesign.belongsTo(Plot, { foreignKey: 'plot_id', as: 'plot' });

module.exports = {
  User,
  Plot,
  HouseDesign,
  Inquiry,
  OwnerInfo,
  Settings
};

