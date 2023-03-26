import RequestCard from './RequestCard';

export default function Generate() {
    return (
        <>
            <RequestCard
                achor="generate"
                title="Generate new Ticket"
                description="Generates new ticket. If betsCount is specified, the number of bets will be equal to betsCount. If maxTicketOdd is specified, the ticket will have a maximum odd of maxTicketOdd. If minTicketOdd is specified, the ticket will have a minimum odd of minTicketOdd. If minBetOdd is specified, the ticket will have a minimum odd of minBetOdd for each bet."
                language="JavaScript"
                method="POST"
                path="/api/generate"
                example={
                    `let data: any = {
    days?: array[],
    betsCount?: number,
    userId: string,
    maxTicketOdd?: number,
    minTicketOdd?: number,
    minBetOdd?: number,
                    }
fetch(\`/api/generate\`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'TOKEN',
    },
    body: JSON.stringify(data)
})`
                }
                response={`{ticketId: 'SiNIwtTPE28pkPftLG7Q', timestamp: 1679197181561, status: 'success'}
--or--
{ message: "Unauthorized. Wrong API Key", status: "error", timestamp: Date.now() }
--or--
{ message: "Method not allowed",status: "error", timestamp: Date.now() }`}
            />
        </>
    )
}