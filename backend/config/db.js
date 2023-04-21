const moment = require('moment');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      '-------------------------------------------------------------'.cyan
    );
    console.log(`MongoDb Connected: ${conn.connection.host}`.cyan);
    console.log(`Time: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`.cyan);
    console.log(
      '-------------------------------------------------------------'.cyan
    );
  } catch (err) {
    console.error(`Error: ${err.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
