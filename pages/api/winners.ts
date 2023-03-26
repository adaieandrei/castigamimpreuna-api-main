// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { config } from '../../config'
import { firestoreDB } from '../../firebase.config'
import { doc, setDoc, collection, getDoc, query, getDocs, where, orderBy, limit } from 'firebase/firestore'
import moment from 'moment'

type Data = {
    tickets?: any,
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

    const days: any = req.query.days
    const limitQuery: any = req.query.limit
    const minOdd: any = req.query.minOdd
    const orderByQuery: any = req.query.orderBy
    const sortOrder: any = req.query.sortOrder

    const authToken = req.headers.authorization?.split(' ')[1];
    // console.log(req.headers)
    // console.log(authToken)

    const onlyUnique = (value: any, index: any, self: any) => {
        return self.indexOf(value) === index;
    }

    if (req.method === 'GET') {
        if (authToken == config.laApiKey) {
            // console.log(req.query)
            if (days && limitQuery && minOdd && orderByQuery && sortOrder) {
                const dateNowMinusDays = new Date().getTime() - (days * 24 * 60 * 60 * 1000)
                await getDocs(query(collection(firestoreDB, "generated"), where("dateCreated", ">=", dateNowMinusDays), orderBy(orderByQuery, sortOrder), limit(limitQuery))).then((querySnapshot) => {
                    const tickets: any = []
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data()
                        docData.id = doc.id
                        if (docData.odd && docData.odd >= parseFloat(minOdd)) {

                        } else {
                            tickets.push(docData)
                        }
                    });
                    const totalTickets = tickets.length
                    res.status(200).send({ tickets: tickets, totalTickets: totalTickets, timestamp: Date.now(), status: "success" })
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                    res.status(500).send({ message: "Error getting documents", status: "error", timestamp: Date.now() })
                });
            } else {
                res.status(400).send({ message: "Missing query parameters", status: "error", timestamp: Date.now() })
            }

        } else {
            res.status(401).send({ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() })
        }


        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })

    } else {
        res.status(405).send({ message: "Method not allowed", status: "error", timestamp: Date.now() })


    }
}