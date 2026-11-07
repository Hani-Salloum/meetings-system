import { NextRequest, NextResponse } from "next/server";

// Generate a large mock users array with the new format
function generateMockUsers(count: number) {
  const names = [
    "Heaven Gutkowski", "John Doe", "Alice Smith", "Robert Johnson", "Maria Garcia",
    "David Wilson", "Sarah Brown", "Michael Davis", "Lisa Miller", "James Taylor",
    "Emma Anderson", "William Thomas", "Olivia Jackson", "Benjamin White", "Sophia Harris",
    "Ethan Martin", "Isabella Thompson", "Alexander Moore", "Mia Lee", "Daniel Clark",
    "Ava Rodriguez", "Matthew Lewis", "Sofia Walker", "Christopher Hall", "Victoria Allen",
    "Andrew Young", "Grace King", "Joshua Wright", "Chloe Green", "Ryan Baker",
    "Zoe Adams", "Nathan Nelson", "Lily Carter", "Samuel Mitchell", "Hannah Perez",
    "Christian Roberts", "Layla Turner", "Isaac Phillips", "Scarlett Campbell", "Caleb Parker",
    "Aria Evans", "Adrian Edwards", "Ellie Collins", "Leo Stewart", "Nora Sanchez",
    "Gabriel Morris", "Stella Rogers", "Julian Reed", "Lucy Cook", "Aaron Morgan"
  ];

  const languages = ["AR", "EN", "FR", "ES", "DE"];
  const users = [];

  for (let i = 1; i <= count; i++) {
    const name = names[i % names.length] || `User${i}`;
    const email = name.toLowerCase().replace(/\s+/g, '_') + `${i}_${Math.floor(Math.random() * 100)}@gmail.com`;
    const confirmed_email = Math.random() > 0.3; // 70% confirmed
    const active = Math.random() > 0.2; // 80% active
    const available = Math.random() > 0.4; // 60% available
    const language = languages[Math.floor(Math.random() * languages.length)];
    
    const created_at = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    const updated_at = new Date(created_at.getTime() + Math.floor(Math.random() * (Date.now() - created_at.getTime())));

    users.push({
      id: i,
      name: name,
      email: email,
      confirmed_email: confirmed_email,
      email_confirmation_code: confirmed_email ? null : Math.random().toString(36).substring(2, 8).toUpperCase(),
      active: active,
      available: available,
      language: language,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
    });
  }
  return users;
}

// You can increase this number to 1_000_000 for larger datasets
const USER_COUNT = 1000;
let users = generateMockUsers(USER_COUNT);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("pagesize") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Filter users based on search
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.language.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortOrder === "asc" ? (aValue === bValue ? 0 : aValue ? 1 : -1) : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }

      return 0;
    });

    // Calculate pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Return response in the specified format
    return NextResponse.json({
      data: {
        data: paginatedUsers,
        total,
        page,
        pagesize: limit,
        total_pages: totalPages,
        last_page: totalPages,
        current_page: page,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find and remove user
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove user from array
    users.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          data: {
            name: body.name ? null : "Name is required",
            email: body.email ? null : "Email is required",
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          data: {
            email: "Please enter a valid email address",
          },
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = users.find((user) => user.email === body.email);
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already exists",
          data: {
            email: "This email is already registered",
          },
        },
        { status: 409 }
      );
    }

    // Create new user with default values for other fields
    const now = new Date().toISOString();
    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: body.name,
      email: body.email,
      confirmed_email: body.confirmed_email || false,
      email_confirmation_code: body.email_confirmation_code || null,
      active: body.active !== undefined ? body.active : true,
      available: body.available !== undefined ? body.available : true,
      language: body.language || "EN",
      created_at: now,
      updated_at: now,
    };

    // Add user to the array
    users.push(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id ? parseInt(body.id) : 0;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    // Find the user to update
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          data: {
            name: body.name ? null : "Name is required",
            email: body.email ? null : "Email is required",
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          data: {
            email: "Please enter a valid email address",
          },
        },
        { status: 400 }
      );
    }

    // Check if email already exists for another user
    const existingUser = users.find(
      (user) => user.email === body.email && user.id !== id
    );
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already exists",
          data: {
            email: "This email is already registered by another user",
          },
        },
        { status: 409 }
      );
    }

    // Update the user with all provided fields
    const updatedUser = {
      ...users[userIndex],
      ...body,
      id: id, // Ensure ID doesn't get overwritten
      updated_at: new Date().toISOString(), // Always update the updated_at timestamp
    };

    // Replace the user in the array
    users[userIndex] = updatedUser;

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
