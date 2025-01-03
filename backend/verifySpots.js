
const { Spot } = require('./db/models');

async function verifySpots() {
  const spots = await Spot.findAll();
  console.log('Spots:', spots.map(spot => spot.toJSON()));
}

verifySpots().catch(console.error);

const { User } = require('./db/models');

async function verifyUsers() {
  const users = await User.findAll();
  console.log('Users:', users.map(user => user.toJSON()));
}

verifyUsers().catch(console.error);