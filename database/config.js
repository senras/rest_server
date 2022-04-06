const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("Conectado a la DB");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la DB");
  }
};

module.exports = { dbConnection };
