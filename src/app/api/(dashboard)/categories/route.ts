import connect from "@/lib/dbConnect";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/models/category";

export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse("Invalid user id or missing user id", {
				status: 400,
			});
		}

		await connect();

		const user = await User.findById(userId);

		if (!user) {
			return new NextResponse("User not found", {
				status: 404,
			});
		}

		const categories = await Category.find({
			user: new Types.ObjectId(userId),
		});

		return new NextResponse(JSON.stringify(categories), {
			status: 200,
		});
	} catch (error) {
		return new NextResponse("Error dalam mengambil data\n" + error, {
			status: 500,
		});
	}
};

export const POST = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		const { title } = await request.json();

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse("Invalid user id or missing user id", {
				status: 400,
			});
		}

		await connect();

		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse("User not found", {
				status: 404,
			});
		}

		const newCategory = new Category({
			title,
			user: new Types.ObjectId(userId),
		});

		await newCategory.save();

		return new NextResponse(
			JSON.stringify({
				message: "Category telah dibuat",
				category: newCategory,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse("Error dalam mengirim data\n" + error, {
			status: 500,
		});
	}
};


