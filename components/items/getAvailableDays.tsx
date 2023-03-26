import RequestCard from './RequestCard';

export default function GetAvailableDays() {
    return (
        <>
            <RequestCard
                achor="getAvailableDays"
                title="Get Available Days for Bets"
                description="Get all available days for current available bets"
                language="JavaScript"
                method="GET"
                path="/api/getAvailableDays"
                example={
                    `fetch(\`/api/getAvailableDays\`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'TOKEN',
    }
})`
                }
                response={`{
"availableDays": [
    {
    "day": "mie. 15",
    "totalAvailableBets": 1
    }
],
"timestamp": 1678868577129,
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