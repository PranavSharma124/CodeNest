"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function getUsers(){
    const session= await auth.api.getSession({headers: await headers()})

    if(!session){
        throw new Error("Unauthorized")
    }

    const users= await prisma.user.findMany({
        where:{
            id:{
                not: session.user.id
            }
        },
        select:{
            id: true,
            name: true,
            image:true
        }
    })

    return users
}