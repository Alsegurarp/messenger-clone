import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
// the handler for auth credentials

export default async function getSession() {
    return await getServerSession(authOptions);
}