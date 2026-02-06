import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'

export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unathorized request', {status: 401})
        }
        if(isGroup && (!members || members < 2 || !name)){
            return new NextResponse('Not enough members to create a group', {status: 400})
        }

        if(isGroup){
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((members:{value: string}) => ({
                                id: members.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                }, 
                include: {
                    users: true
                    // by default you dont get an array of your users in the groupchat, only id, but if you want to work with those users
                    // you need to declare it like this - to show image, name, etc.
                }
            });
            return NextResponse.json(newConversation);
        }

        // we declare a comparision, we will see if there's any conversation with my user and the user that we want to do the conversation with
        // if exists, wont let us, it doesn't, then we can
        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        });

        const singleConversation = existingConversations[0];

        if(singleConversation){
            return NextResponse.json(singleConversation)
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        });

        return NextResponse.json(newConversation);




        } catch(error){
            return new NextResponse(`Internal error: ${error}`, {status: 500})
        }

}