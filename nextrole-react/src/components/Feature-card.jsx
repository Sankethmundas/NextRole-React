function FeatureCard({ title, description }) {

    return (

        <div className="card feature-card">
            <div className="card-body">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>

    );
}

export default FeatureCard;