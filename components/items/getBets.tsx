import RequestCard from './RequestCard';

export default function GetBets() {
    return (
        <>
            <RequestCard
                achor="getBets"
                title="Get Available Bets"
                description="Get all available bets for a specific day"
                language="JavaScript"
                method="GET"
                path="/api/getBets"
                example={
                    `fetch(\`/api/getBets\`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'TOKEN',
    }
})`
                }
                response={`{
"meciuri": [
    {
    "url": "https://superbet.ro/pariuri-sportive/fotbal",
    "status": "active",
    "flag": "https://superbet.ro/static/img/flags/ENG.png",
    "shopCode": "13149",
    "marketName": "Final",
    "day": "mie. 15",
    "team2": "Brentford",
    "countryName": "Anglia",
    "hour": "21:30",
    "market": "1",
    "timestamp": 1678866125899,
    "odd": "3.00",
    "countryLeague": "Premier League",
    "team1": "Southampton",
    "id": "pb5crdhvyLASLJ8aIKpJ"
    }
],
"availableDays": [
    {
    "day": "mie. 15",
    "totalAvailableBets": 1
    }
],
"timestamp": 1678868200166,
"status": "success"
}
--or--
{ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() }
--or--
{ message: "Method not allowed",status: "error", timestamp: Date.now() }`}
            />
        </>
    )
}