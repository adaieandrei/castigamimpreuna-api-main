import RequestCard from './RequestCard';

export default function GetTicket() {
    return (
        <>
            <RequestCard
                achor="getTicket"
                title="Get a Ticket"
                description="Get a ticket by id with or without bets. If withGames is true, the ticket will have the bets. If withGames is false or undefined, the ticket will not have the bets."
                language="JavaScript"
                method="GET"
                path="/api/geTicket"
                example={
                    `fetch(\`/api/geTicket?id=aAzd6pXzKiBUg5IqjSHr&withGames=true\`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'TOKEN',
    }
})`
                }
                response={`{
"ticketData": {
    "dateCreated": 1679215855385,
    "meciuri": [
    {
        "team2": "FC Arges",
        "url": "https://superbet.ro/pariuri-sportive/fotbal/luni?e=4640178&t=offer-prematch-15422",
        "market": "1X",
        "team1": "U.Cluj",
        "timestamp": 1679203386621,
        "countryName": "Romania",
        "day": "lun. 20",
        "marketName": "Șansă dublă",
        "countryLeague": "SUPERLIGA",
        "status": "active",
        "hour": "21:00",
        "flag": "https://superbet.ro/static/img/flags/ROU.png",
        "odd": "1.20",
        "shopCode": "14522",
        "id": "kRpHJYJa9dMcBG6MoeDo"
    },
    ],
    "totalGames": 3,
    "totalOdd": 19.44,
    "status": "active",
    "userId": "8bozX8ekG0agBok5xaPnqCgAHxe2"
},
"timestamp": 1679216878484,
"status": "success"
}
--or--
{ message: "Ticket not found", status: "error", timestamp: Date.now() }
--or--
{ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() }
--or--
{ message: "Method not allowed",status: "error", timestamp: Date.now() }`}
            />
        </>
    )
}