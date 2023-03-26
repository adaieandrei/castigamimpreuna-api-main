// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { config } from '../../config'
import { firestoreDB } from '../../firebase.config'
import { doc, setDoc, collection, getDoc, query, getDocs, where, addDoc } from 'firebase/firestore'
import moment from 'moment'

type Data = {
    meciuri?: any,
    totalBets?: number,
    days?: any,
    timestamp: number,
    status: string,
    message?: string
    ticketId?: string
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
        body: { betsCount, userId, days, minTicketOdd, maxTicketOdd, minGameOdd },
        method,
    } = req
    const authToken = req.headers.authorization?.split(' ')[1];
    // console.log(req.headers)
    // console.log(authToken)



    if (req.method === 'POST') {
        if (authToken == config.laApiKey) {
            const reqData = req.body
            const meciuri: any = [];
            let meciuriFinal: any = []
            let oddFinal: number = 1
            let counterM: number = 0

            // console.log(reqData)

            if (betsCount && days && !minTicketOdd && !maxTicketOdd && !minGameOdd) {
                await Promise.all(days.map(async (day: any) => {
                    // console.log(day)
                    const queryGames = query(collection(firestoreDB, 'games'), where('day', '==', day), where('status', '==', "active"))
                    const querySnapshot = await getDocs(queryGames)
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data()
                        docData.id = doc.id
                        // console.log(docData)
                        meciuri.push(docData)
                    })
                }))
                // console.log(meciuri.length)  }
                // }

                // Get unique elements in meciuri
                const uniqueMeciuri = Array.from(new Set(meciuri.map((m: any) => m.shopCode)));

                // Set betsCount to number of unique elements or original betsCount, whichever is smaller
                const adjustedBetsCount = Math.min(uniqueMeciuri.length, betsCount);

                // Randomly select unique elements from meciuri until adjustedBetsCount is reached
                while (uniqueMeciuri.length && meciuriFinal.length < adjustedBetsCount) {
                    const randomIndex = Math.floor(Math.random() * uniqueMeciuri.length);
                    const meci = meciuri.find((m: any) => m.shopCode === uniqueMeciuri[randomIndex]);
                    if (meciuriFinal.some((m: any) => m.shopCode === meci.shopCode)) {
                        continue;
                    } else {
                        meciuriFinal.push(meci.id);
                        oddFinal *= parseFloat(meci.odd);
                    }
                    uniqueMeciuri.splice(randomIndex, 1);
                }


                console.log(meciuriFinal.length)
                const ticketData = {
                    meciuri: meciuriFinal,
                    totalGames: meciuriFinal.length,
                    totalOdd: oddFinal,
                    dateCreated: Date.now(),
                    status: "active",
                    userId: userId
                }
                // console.log(ticketData)
                const newTicket = await addDoc(collection(firestoreDB, 'generated'), ticketData)
                // console.log(newTicket.id)
                res.status(200).send({ ticketId: newTicket.id, timestamp: Date.now(), status: "success" })
            } else if (minTicketOdd) {
                // console.log(minTicketOdd)
                const queryGames = query(collection(firestoreDB, 'games'), where('status', '==', "active"))
                const querySnapshot = await getDocs(queryGames)
                querySnapshot.forEach((doc) => {
                    const docData = doc.data()
                    docData.id = doc.id
                    // console.log(docData)
                    meciuri.push(docData)
                })
                // console.log(meciuri)




                // Get unique elements in meciuri
                const uniqueMeciuri = Array.from(new Set(meciuri.map((m: any) => m.shopCode)));

                // Randomly select unique elements from meciuri until oddFinal is greater than minTicketOdd
                while (uniqueMeciuri.length && oddFinal < minTicketOdd) {
                    const randomIndex = Math.floor(Math.random() * uniqueMeciuri.length);
                    const meci = meciuri.find((m: any) => m.shopCode === uniqueMeciuri[randomIndex]);
                    if (meci) {
                        meciuriFinal.push(meci.id);
                        oddFinal *= parseFloat(meci.odd);
                        uniqueMeciuri.splice(randomIndex, 1);
                    } else {
                        uniqueMeciuri.splice(randomIndex, 1);
                    }
                }





                // console.log(oddFinal)
                const ticketData = {
                    meciuri: meciuriFinal,
                    totalGames: meciuriFinal.length,
                    totalOdd: oddFinal,
                    dateCreated: Date.now(),
                    status: "active",
                    userId: userId
                }
                // console.log(ticketData)
                const newTicket = await addDoc(collection(firestoreDB, 'generated'), ticketData)
                // // console.log(newTicket.id)
                res.status(200).send({ ticketId: newTicket.id, timestamp: Date.now(), status: "success" })

            } else if (maxTicketOdd) {
                // console.log(minTicketOdd)
                const queryGames = query(collection(firestoreDB, 'games'), where('status', '==', "active"))
                const querySnapshot = await getDocs(queryGames)
                querySnapshot.forEach((doc) => {
                    const docData = doc.data()
                    docData.id = doc.id
                    // console.log(docData)
                    meciuri.push(docData)
                })
                // console.log(meciuri)
                // while (oddFinal < minTicketOdd)


                // Get unique elements in meciuri
                const uniqueMeciuri = Array.from(new Set(meciuri.map((m: any) => m.shopCode)));

                // Randomly select unique elements from meciuri until oddFinal is greater than minTicketOdd
                while (uniqueMeciuri.length && oddFinal < maxTicketOdd) {

                    const randomIndex = Math.floor(Math.random() * uniqueMeciuri.length);
                    const meci = meciuri.find((m: any) => m.shopCode === uniqueMeciuri[randomIndex]);
                    if (meci) {
                        oddFinal *= parseFloat(meci.odd);
                        if (oddFinal > maxTicketOdd) {
                            oddFinal /= parseFloat(meci.odd);
                            break;
                        } else {
                            meciuriFinal.push(meci.id);

                            uniqueMeciuri.splice(randomIndex, 1);
                        }
                    } else {
                        uniqueMeciuri.splice(randomIndex, 1);
                    }
                }

                // console.log(oddFinal)
                const ticketData = {
                    meciuri: meciuriFinal,
                    totalGames: meciuriFinal.length,
                    totalOdd: oddFinal.toFixed(2),
                    dateCreated: Date.now(),
                    status: "active",
                    userId: userId
                }
                // console.log(ticketData)
                const newTicket = await addDoc(collection(firestoreDB, 'generated'), ticketData)
                // // console.log(newTicket.id)
                res.status(200).send({ ticketId: newTicket.id, timestamp: Date.now(), status: "success" })
            }

            // res.status(200).send({ meciuri: meciuri, days: days, timestamp: Date.now(), status: "success" })
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