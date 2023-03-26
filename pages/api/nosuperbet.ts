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

                // const browser = await puppeteer.launch({
                //     executablePath: await chromeLambda.executablePath,
                //     args: ['--single-process', '--no-zygote', '--no-sandbox', '--disable-setuid-sandbox'],
                //     // headless: false,
                //     // devtools: true,
                //     headless: chromeLambda.headless,
                //     defaultViewport: { width: 400, height: 600 }
                // });
                const browser = await playwright.chromium.launch({
                    args: ['--single-process', '--no-zygote', '--no-sandbox', '--disable-setuid-sandbox'],
                    headless: false,

                });
                const page = await browser.newPage();
                page.setViewportSize({ width: 400, height: 600 });
                page.setDefaultNavigationTimeout(0);
                // await page.setRequestInterception(true);
                // page.on('request', (req) => {
                //     if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                //         req.abort();
                //     }
                //     else {
                //         req.continue();
                //     }
                // });

                await page.goto('https://superbet.ro');
                const delay: (ms: number) => Promise<void> = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000)
                await page.click('#onetrust-accept-btn-handler')

                // await page.goto('https://superbet.ro/contact');


                await page.click('.router-link-active')

                //go to homepage for the ticket to appear
                await page.goto('https://superbet.ro', {});

                for (var i = 0; i < games.length; i++) {
                    let item = games[i]
                    try {
                        //start to search for game            
                        await page.click('.mobile-subnav__item')
                        await page.focus('.search-autocomplete__input');
                        let team1 = item.team1
                        team1 = team1.trim()
                        let team2 = item.team2
                        team2 = team2.trim()
                        let game = team1 + " " + team2
                        let marketName = item.marketName
                        marketName = marketName.trim()
                        await page.keyboard.type(team1)
                        await page.keyboard.press('Enter');

                        //begin to add bet
                        await page.waitForSelector('.event-summary', {});
                        await page.click('.event-summary')
                        let marketNameSelector = `//div[@class='event-row__expanded-market-header']/span[contains(., '${item.marketName}')]`
                        const [market]: any = await page.$$(marketNameSelector);
                        if (market) {
                            // console.log(marketNameSelector)
                            if (marketName == 'Final' || marketName == 'Super Extra' || marketName == 'Primul Set' || marketName == 'Total goluri meci' || marketName == 'Pauză sau Final' || marketName == 'Super Cota') {
                                console.log("Market already expanded")
                            } else {
                                await market.click();
                            }
                        }
                        let marketSelector = `//div[@class='event-row__expanded-market-header']/span[contains(., '${item.marketName}')]/../..//span[contains(., '${item.market}')]`
                        const [bet]: any = await page.$$(marketSelector);
                        if (bet) {
                            await bet.click();
                        } else {
                            console.log("Bet not found. Trying to expand market")
                            await market.click();
                            let marketSelector2 = `//div[@class='event-row__expanded-market-header']/span[contains(., '${item.marketName}')]/../..//span[contains(., '${item.market}')]`
                            const [bet2]: any = await page.$$(marketSelector2);
                            if (bet2) {
                                await bet2.click();
                            } else {
                                console.log("Bet not found in second try. Skipping")
                            }
                        }
                        await page.click('.mobile-subnav__item-text')
                        // await page.goto('https://superbet.ro', {
                        //     waitUntil: 'networkidle2',
                        // });

                    }
                    catch {
                        console.log(item)
                        await page.goto('https://superbet.ro', {});
                        console.log(item.market + ' ' + item.marketName + ' ' + item.team1 + ' ' + item.team2)
                    }
                }
                await page.click('.betslip-compact')
                // await page.click('[class="type-switcher betslip-stake__picker"] div:nth-child(2)')
                await page.waitForSelector('.e2e-betslip-submit')
                await page.click('.e2e-betslip-submit')
                await page.waitForSelector('.betslip-header__ticket-code', {})
                let codeS: any = await page.$eval('.betslip-header__ticket-code', el => el.textContent);
                codeS = codeS.trim()
                console.log(codeS)
                browser.close();

                await updateDoc(doc(firestoreDB, "generated", ticketId), {
                    codSuperbet: codeS,
                })

                res.status(200).send({ codSuperbet: codeS, timestamp: Date.now(), status: "success" })
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