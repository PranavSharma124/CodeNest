import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulating async database/API operation
    const users = await Promise.resolve([
      { id: 1, name: "Pranav" },
      { id: 2, name: "Rahul" },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}