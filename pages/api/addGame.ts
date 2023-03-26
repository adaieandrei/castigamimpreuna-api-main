// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { config } from '../../config'
import { firestoreDB } from '../../firebase.config'
import { doc, setDoc, collection, getDoc, query, getDocs, where } from 'firebase/firestore'

type Data = {
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
    const {
        body: { shopCode, day, hour, team1, team2, marketName, market, odd, url, flag, countryLeague, countryName, grade },
        method,
    } = req
    const authToken = req.headers.authorization?.split(' ')[1];
    // console.log(req.headers)
    // console.log(authToken)
    if (req.method === 'POST') {
        if (authToken == config.laApiKey) {
            if (!shopCode || !day || !hour || !team1 || !team2 || !marketName || !market || !odd || !url || !flag || !countryLeague || !countryName || !grade) {
                res.status(400).send({ message: "Missing parameters", status: "error", timestamp: Date.now() })
                return
            }
            const docData = {
                shopCode: shopCode,
                countryLeague: countryLeague,
                countryName: countryName,
                day: day,
                hour: hour,
                team1: team1,
                team2: team2,
                marketName: marketName,
                market: market,
                odd: odd,
                flag: flag,
                url: url,
                grade: grade,
                status: "active",
                timestamp: Date.now()
            }

            const newPost = doc(collection(firestoreDB, 'games'))
            setDoc(newPost, docData).then(() => {
                res.status(200).send({ timestamp: Date.now(), status: "success" })
            }).catch((error) => {
                res.status(400).send({ message: error, status: "error", timestamp: Date.now() })
                return
            })
        } else {
            res.status(401).send({ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() })
            return
        }


        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })

    } else {
        res.status(405).send({ message: "Method not allowed", status: "error", timestamp: Date.now() })
        return
    }
}