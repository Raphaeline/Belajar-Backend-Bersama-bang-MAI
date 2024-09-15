import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
	const connectionState = mongoose.connection.readyState;
	if (connectionState === 0) {
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");
		return;
	}

	try {
		mongoose.connect(MONGODB_URI!, {
			dbName: "restapi",
			bufferCommands: true,
		});
		console.log("connected");
	} catch (err) {
		console.log("Error connecting to MongoDB:", err);
		throw new Error("Error: ", err!);
	}
};

export default connect;
