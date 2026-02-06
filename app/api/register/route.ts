import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";



export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

    if(!email || !name || !password) {
        return new NextResponse('Missing credentials', {status: 400});
    }

    // here, we are going to hash the password, we never save plain passwords in the db
    // they must be hashed (encrypted)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email, name, hashedPassword
        }
    });

    return NextResponse.json(user);
    } catch (error: any) {
        console.log('REGISTER_ROUTE_ERROR: ', error);
        return new NextResponse('something during the creation of the user went wrong', {status: 500});
    }
}