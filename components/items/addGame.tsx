import RequestCard from './RequestCard';

export default function AddGame() {
    return (
        <>
            <RequestCard
                achor="addGame"
                title="Add Game"
                description="Add a new game. Usually this is done from the extension"
                language="JavaScript"
                method="POST"
                path="/api/addGame"
                example={
                    `let data: any = {
    shopCode: any;
    day: any;
    hour: any;
    team1: any;
    team2: any;
    marketName: any;
    market: any;
    odd: any;
    url: string;
    flag: any;
    countryName: any;
    countryLeague: any;
}
fetch(\`/api/addGame\`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'TOKEN',
    },
    body: JSON.stringify(data)
})`
                }
                response={`res.status(200).send({ timestamp: Date.now(), status: "success" })
--or--
res.status(400).send({ message: error, status: "error", timestamp: Date.now() })
--or--
res.status(401).send({ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() })
--or--
res.status(405).send({ message: "Method not allowed",status: "error", timestamp: Date.now() })`}
            />
        </>
    )
}