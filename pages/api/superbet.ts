// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { config } from '../../config'
import { firestoreDB } from '../../firebase.config'
import { doc, setDoc, collection, getDoc, query, getDocs, where, orderBy, limit, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import puppeteer from 'puppeteer';
import chromeLambda from 'chrome-aws-lambda';
import { chromium } from 'playwright';
import playwright from 'playwright';

type Data = {
    codSuperbet?: any,
    totalTickets?: number,
    timestamp: number,
    status: string,
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
    });

    const ticketId: any = req.query.id

    const authToken = req.headers.authorization?.split(' ')[1];
    // console.log(req.headers)
    // console.log(authToken)

    if (req.method === 'GET') {
        if (authToken == config.laApiKey) {
            // console.log(ticketId)
            const ticket = await getDoc(doc(firestoreDB, "generated", ticketId));
            if (ticket.exists()) {
                const ticketData = ticket.data()
                const meciuri = ticketData.meciuri
                const games: any = []
                let codSuperbet = ""
                await Promise.all(meciuri.map(async (meci: any) => {
                    const game = await getDoc(doc(firestoreDB, "games", meci));
                    if (game.exists()) {
                        const gameData = game.data()
                        gameData.id = game.id
                        games.push(gameData)
                    }
                }))
                // console.log(games)
                await fetch("https://europe-central2-castigam-impreuna-dev.cloudfunctions.net/superbet", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${config.laApiKey}`
                    },
                    body: JSON.stringify({
                        games: games,
                        ticketId: ticketId,
                        environment: process.env.NODE_ENV == "production" ? "prod" : "dev",
                    })
                }).then(async (response) => {
                    const data = await response.json()
                    console.log(data)
                    let codeS = data.codSuperbet
                    // await updateDoc(doc(firestoreDB, "generated", ticketId), {
                    //     codSuperbet: codeS,
                    // })

                    res.status(200).send({ codSuperbet: codeS, timestamp: Date.now(), status: "success" })
                }).catch((error) => {
                    console.log(error)
                    res.status(500).send({ message: "Internal Server Error", status: "error", timestamp: Date.now() })
                })


            } else {
                res.status(405).send({ message: "Ticket not found", status: "error", timestamp: Date.now() })
            }

        } else {
            res.status(401).send({ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() })
        }


        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })

    } else {
        res.status(405).send({ message: "Method not allowed", status: "error", timestamp: Date.now() })


    }
}