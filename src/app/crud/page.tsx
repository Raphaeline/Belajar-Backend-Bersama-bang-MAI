// app/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface User {
	_id: string;
	email: string;
	username: string;
	password: string;
}

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [newUser, setNewUser] = useState({ email: "", username: "", password: "" });
	const [editUser, setEditUser] = useState<User | null>(null);

	// Fetch all users
	const fetchUsers = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/users");
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// Create new user
	const createUser = async () => {
		try {
			await axios.post("http://localhost:3000/api/users", newUser);
			fetchUsers(); // Refresh users after creation
			setNewUser({ email: "", username: "", password: "" }); // Reset form
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	// Update user with userId and newUsername
	const updateUser = async (id: string, newUsername: string) => {
		try {
			await axios.patch(`http://localhost:3000/api/users`, {
				userId: id,
				newUsername: newUsername,
			});
			setEditUser(null); // Close the edit form after update
			fetchUsers(); // Refresh users after update
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	// Delete user
	const deleteUser = async (id: string) => {
		try {
			await axios.delete(`http://localhost:3000/api/users/`, {
				params: { userId: id },
			});
			fetchUsers(); // Refresh users after deletion
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold text-center mb-6">Users Management</h1>

			{/* Create new user form */}
			<div className="mb-6 mx-auto w-96">
				<h2 className="text-2xl font-semibold mb-4">Create New User</h2>
				<div className="grid grid-cols-1 gap-4 max-w-lg">
					<input type="text" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="p-2 border border-gray-300 rounded text-black" />
					<input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="p-2 border border-gray-300 rounded text-black" />
					<input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="p-2 border border-gray-300 rounded text-black" />
					<button onClick={createUser} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
						Create User
					</button>
				</div>
			</div>

			{/* Display users */}
			<div className="mb-6">
				<h2 className="text-2xl font-semibold mb-4">Users List</h2>
				<ul className="space-y-4">
					{users.map((user) => (
						<li key={user._id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center shadow">
							<div>
								<p className="text-lg font-medium text-black">{user.username}</p>
								<p className="text-sm text-black">{user.email}</p>
							</div>
							<div className="space-x-2">
								<button onClick={() => setEditUser(user)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
									Edit
								</button>
								<button onClick={() => deleteUser(user._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>

			{/* Edit user form */}
			{editUser && (
				<div className="mb-6">
					<h2 className="text-2xl font-semibold mb-4">Edit User</h2>
					<div className="grid grid-cols-1 gap-4 max-w-lg">
						<input type="text" value={editUser.username} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} className="p-2 border border-gray-300 rounded" />
						<button onClick={() => updateUser(editUser._id, editUser.username)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
							Update Username
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UsersPage;
