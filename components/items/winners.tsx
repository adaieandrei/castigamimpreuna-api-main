import RequestCard from './RequestCard';

export default function GetWinners() {
    return (
        <>
            <RequestCard
                achor="winners"
                title="Get Winners"
                description={`Get all winners. If days is specified, the number of days will be equal to days. If limit is specified, the number of winners will be equal to limit. If orderBy is specified, the winners will be ordered by orderBy. If minOdd is specified, the winners will have a minimum odd of minOdd. If sortOrder is specified, the winners will be ordered by sortOrder.<br><br>orderBy: dateCreated, totalOdd, totalGames<br>sortOrder: asc, desc`}
                language="JavaScript"
                method="GET"
                path="/api/winners"
                example={
                    `fetch(\`/api/winners?days=1&limit=200&orderBy=dateCreated&minOdd=3&sortOrder=asc\`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'TOKEN',
    }
})`
                }
                response={`"tickets": [
{
    "dateCreated": 1679218912895,
    "totalGames": 3,
    "meciuri": [
    "nkf09Mxq5rGr7StTQTPw",
    "BCLPuMd5LTNKV1OQgb6e",
    "FUCW9szpe9Q0ovd9gmMJ"
    ],
    "userId": "8bozX8ekG0agBok5xaPnqCgAHxe2",
    "totalOdd": 7.890750000000001,
    "status": "active",
    "id": "aAzd6pXzKiBUg5IqjSHr"
}
],
"totalTickets": 1,
"timestamp": 1679221670048,
"status": "success"
}
--or--
res.status(500).send({ message: "Error getting documents", status: "error", timestamp: Date.now() })
--or--
res.status(400).send({ message: "Missing query parameters", status: "error", timestamp: Date.now() })
--or--
{ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() }
--or--
{ message: "Method not allowed",status: "error", timestamp: Date.now() }`}
            />
        </>
    )
}