import connect from "@/lib/dbConnect";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/models/category";

export const PATCH = async (request: Request, context: { params: any }) => {
	const categoryById = context.params.category;

	try {
		const body = await request.json();
		const { title } = body;

		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new Response("Invalid user id", {
				status: 400,
			});
		}

		if (!categoryById || !Types.ObjectId.isValid(userId)) {
			return new Response("Invalid category id or user id", {
				status: 400,
			});
		}

		await connect();

		const user = await User.findById(userId);

		if (!user) {
			return new NextResponse(
				JSON.stringify({
					message: "user tidak ditemukan",
				}),
				{
					status: 404,
				}
			);
		}

		const category = await Category.findById({ _id: categoryById, user: userId });

		if (!category) {
			return new NextResponse(
				JSON.stringify({
					message: "category tidak ditemukan",
				}),
				{
					status: 404,
				}
			);
		}

		const updatedCategory = await Category.findByIdAndUpdate(categoryById, { title }, { new: true });

		return new NextResponse(
			JSON.stringify({
				message: "category berhasil diupdate",
				category: updatedCategory,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse("Error dalam mengupdate category\n" + error, {
			status: 500,
		});
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DELETE = async (request: Request, context: { params: any }) => {
	const categoryById = context.params.category;

	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new Response("Invalid user id", {
				status: 400,
			});
		}

		if (!categoryById || !Types.ObjectId.isValid(userId)) {
			return new Response("Invalid category id or user id", {
				status: 400,
			});
		}

		await connect();

		const user = await User.findById(userId);

		if (!user) {
			return new NextResponse(
				JSON.stringify({
					message: "user tidak ditemukan",
				}),
				{
					status: 404,
				}
			);
		}

		const category = await Category.findById({ _id: categoryById, user: userId });

		if (!category) {
			return new NextResponse(
				JSON.stringify({
					message: "category tidak ditemukan",
				}),
				{
					status: 404,
				}
			);
		}

		await Category.findByIdAndDelete(categoryById);

		return new NextResponse(
			JSON.stringify({
				message: "Category telah terhapus",
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse("Gagal dalam menghapus data\n" + error, { status: 500 });
	}
};
