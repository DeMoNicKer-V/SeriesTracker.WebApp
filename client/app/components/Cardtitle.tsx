interface Props{
    title: string;
    lastEpisode: number;
}

export const CardTitle = ({title, lastEpisode}: Props) =>{
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <p className="card_title">{title}</p>
            <p className="card_price">{lastEpisode}</p>
        </div>
    )
}