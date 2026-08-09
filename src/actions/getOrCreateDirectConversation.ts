"use server"

import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ConversationType } from "@prisma/client"

export async function getOrCreateDirectConversation(otherUserId:string) {
    const session= await auth.api.getSession({headers: await headers()})

    if(!session){
        throw new Error("Unauthorized")
    }

    if(otherUserId===session.user.id){
        throw new Error("Can't start a DM with yourself")
    }

    const conversation= await prisma.conversation.findFirst({
        where:{
            type: ConversationType.DIRECT,
            AND:[
                {
                    participants:{
                        some:{
                            userId:session.user.id
                        }
                    }
                },
                {
                    participants:{
                        some:{
                            userId:otherUserId
                        }
                    }
                }

            ]
        }
    })

    if(conversation){
        return conversation
    }

    const newConversation= await prisma.conversation.create({
        data:{
            type:ConversationType.DIRECT,
            participants:{
                create:[
                    {
                        userId: session.user.id
                    },
                    {
                        userId: otherUserId
                    }
                ]
            }
        },
        include:{
            participants:{
                include:{
                    user:true
                }
            }
        }
    })

    return newConversation
}