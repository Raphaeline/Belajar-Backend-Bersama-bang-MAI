import connect from "@/lib/dbConnect";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/models/category";
import Blog from "@/lib/models/blog";

export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid user id",
				}),
				{
					status: 400,
				}
			);
		}

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid category id",
				}),
				{
					status: 400,
				}
			);
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

		const category = await Category.findById(categoryId);
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

		const filter = {
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId),
		};

		// TODO

		const blogs = await Blog.find(filter);

		return new NextResponse(JSON.stringify({ blogs }), {
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
		const categoryId = searchParams.get("categoryId");

		const body = await request.json();
		const { title, description } = body;

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid user id",
				}),
				{
					status: 400,
				}
			);
		}

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(
				JSON.stringify({
					message: "Invalid user id",
				}),
				{
					status: 400,
				}
			);
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

		const category = await Category.findById(categoryId);
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

		const newBlog = new Blog({
			title,
			description,
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId),
		});

		await newBlog.save();
		return new NextResponse(
			JSON.stringify({
				message: "Blog telah dibuat",
				blog: newBlog,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse("eror dalam mengirim data" + error, {
			status: 500,
		});
	}
};
