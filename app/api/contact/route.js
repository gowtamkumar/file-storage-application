import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: "Please provide all fields" },
                { status: 400 }
            );
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        return NextResponse.json({ success: true, data: contact }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
