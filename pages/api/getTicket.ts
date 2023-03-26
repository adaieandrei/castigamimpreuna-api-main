// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { config } from '../../config'
import { firestoreDB } from '../../firebase.config'
import { doc, setDoc, collection, getDoc, query, getDocs, where } from 'firebase/firestore'
import moment from 'moment'

type Data = {
    ticketData?: any,
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
    const withGames: any = req.query.withGames

    const authToken = req.headers.authorization?.split(' ')[1];
    // console.log(req.headers)
    // console.log(authToken)

    const onlyUnique = (value: any, index: any, self: any) => {
        return self.indexOf(value) === index;
    }

    if (req.method === 'GET') {
        if (authToken == config.laApiKey) {
            if (withGames) {
                const ticket = await getDoc(doc(firestoreDB, "generated", ticketId));
                if (ticket.exists()) {
                    const ticketData = ticket.data()
                    const meciuri = ticketData.meciuri
                    const games: any = []
                    await Promise.all(meciuri.map(async (meci: any) => {
                        const game = await getDoc(doc(firestoreDB, "games", meci));
                        if (game.exists()) {
                            const gameData = game.data()
                            gameData.id = game.id
                            games.push(gameData)
                        }
                    }))
                    ticketData.meciuri = games
                    res.status(200).send({ ticketData: ticketData, timestamp: Date.now(), status: "success" })
                } else {
                    res.status(405).send({ message: "Ticket not found", status: "error", timestamp: Date.now() })
                }
            } else {
                const ticket = await getDoc(doc(firestoreDB, "generate", ticketId));
                if (ticket.exists()) {
                    const ticketData = ticket.data()
                    res.status(200).send({ ticketData: ticketData, timestamp: Date.now(), status: "success" })
                } else {
                    res.status(400).send({ message: "Ticket not found", status: "error", timestamp: Date.now() })
                }
            }
        } else {
            res.status(401).send({ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() })
        }


        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })

    } else {
        res.status(405).send({ message: "Method not allowed", status: "error", timestamp: Date.now() })


    }
}