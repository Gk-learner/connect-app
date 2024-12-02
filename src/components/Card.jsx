const Card = (feed) => {
    if (!feed || feed.length === 0) {
        return <p>No data available</p>; // Graceful handling for empty feeds
    }

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {feed.feed.map((cardData, index) => (
                <div className="card bg-base-100 w-1/4 shadow-xl" key={index}>
                    <figure>
                        <img
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1733085801~exp=1733089401~hmac=3565f50174ad8dac985db4b15df1d753e211a6fef5be94da951673978555de97&w=740"
                            alt={cardData.firstName || "Card Image"}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{cardData.firstName}</h2>
                        <div className="card-actions justify-end">
                            <button className="btn btn-warning">Ignore</button>
                            <button className="btn btn-success">Accepted</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;
