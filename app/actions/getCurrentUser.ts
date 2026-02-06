import prisma from '@/app/libs/prismadb'
import getSession from './getSession'

export const getCurrentUser = async () => {
    try{
        const session = await getSession();
        
        if(!session?.user?.email) return null
            // hacer busqueda al db para comparar email del user en la sesion
            const currentUser = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            });
            if(!currentUser) return null;

            return currentUser;

        } catch(error: any) {
        return null;
    } finally {

    }
}