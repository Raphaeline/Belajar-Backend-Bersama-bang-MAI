import connect from "@/lib/dbConnect";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";

const ObjectId = Types.ObjectId;

export const GET = async () => {
	try {
		await connect();
		const users = await User.find();
		return new NextResponse(JSON.stringify(users), { status: 200 });
	} catch (error) {
		return new NextResponse("Error dalam mengambil data\n" + error, {
			status: 500,
		});
	}
};

export const POST = async (request: Request) => {
	try {
		const body = await request.json();
		await connect();

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(body.password, salt);

		const newUser = new User({
			...body,
			password: hashedPassword,
		});

		await newUser.save();

		return new NextResponse(
			JSON.stringify({
				message: "User is created",
				user: newUser,
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new NextResponse("Error dalam mengirim ke database\n" + error, {
			status: 500,
		});
	}
};

//Update Password

export const PATCH = async (request: Request) => {
	try {
		const body = await request.json();
		const { userId, newUsername } = body;
		await connect();

		if (!userId || !newUsername) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid request, ID or new username not found",
				}),
				{ status: 400 }
			);
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid User id",
				}),
				{
					status: 400,
				}
			);
		}

		const updatedUser = await User.findOneAndUpdate({ _id: new ObjectId(userId) }, { username: newUsername }, { new: true });

		if (!updatedUser) {
			return new NextResponse(
				JSON.stringify({
					message: "User not found in database",
				}),
				{
					status: 404,
				}
			);
		}

		return new NextResponse(
			JSON.stringify({
				message: "User is updated",
				user: updatedUser,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return (
			new NextResponse("Gagal dalam mengupdate data\n" + error),
			{
				status: 500,
			}
		);
	}
};

export const DELETE = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid request, ID not found",
				}),
				{
					status: 400,
				}
			);
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid User id",
				}),
				{
					status: 400,
				}
			);
		}

		await connect();

		const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

		if (!deletedUser) {
			return new NextResponse(
				JSON.stringify({
					message: "User not found in database",
				}),
				{
					status: 404,
				}
			);
		}

		return new NextResponse(
			JSON.stringify({
				message: "User is deleted",
				user: deletedUser,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse("Error during deleting data : " + error, {
			status: 500,
		});
	}
};
