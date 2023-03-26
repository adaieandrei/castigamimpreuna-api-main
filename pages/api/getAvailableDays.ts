// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { config } from '../../config'
import { firestoreDB } from '../../firebase.config'
import { doc, setDoc, collection, getDoc, query, getDocs, where } from 'firebase/firestore'
import moment from 'moment';

type Data = {
    availableDays?: any,
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
        body: { },
        method,
    } = req
    const authToken = req.headers.authorization?.split(' ')[1];
    // console.log(req.headers)
    // console.log(authToken)

    const onlyUnique = (value: any, index: any, self: any) => {
        return self.indexOf(value) === index;
    }

    if (req.method === 'GET') {
        if (authToken == config.laApiKey) {
            const dbMeciuri = collection(firestoreDB, "games");
            const querySnapshot = await getDocs(query(dbMeciuri, where("status", "==", "active")))
            let meciuri: any = [];
            let days: any = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let docData = doc.data()
                docData.id = doc.id
                let day = docData.day
                let today = moment().format('YYYY-MM-DD');
                let hour = moment(today + " " + docData.hour, "YYYY-MM-DD HH:mm").format('YYYY-MM-DD HH:mm')
                if (hour > moment().format('YYYY-MM-DD HH:mm')) {
                    meciuri.push(docData)
                    days.push(day)
                }
            });
            let unique = days.filter(onlyUnique);
            let availableDays: any = []
            unique.map((el: any) => {
                const tempMeciuri = meciuri.filter((m: any) => m.day == el)

                availableDays.push({ day: el, totalAvailableBets: tempMeciuri.length })
            })
            res.status(200).send({ availableDays: availableDays, timestamp: Date.now(), status: "success" })
        } else {
            res.status(401).send({ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() })
        }


        // res.json({ shopCode: shopCode, day: day, hour: hour, team1: team1, team2: team2, marketName: marketName, market: market, odd: odd, url: url })

    } else {
        res.status(405).send({ message: "Method not allowed", status: "error", timestamp: Date.now() })


    }
}