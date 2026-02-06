import prisma from '@/app/libs/prismadb';
import getSession from './getSession';


const getUsers = async () => {
    const session = await getSession();

    if(!session?.user?.email) {
        return []
    }

    try {
        // we want to get all the users EXCEPT me
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session.user.email
                }
            }
        })

        return users;
    } catch (error: any) {
        return [];
    }
}

export default getUsers;