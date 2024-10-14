

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap"; // Updated import to use Bootstrap Button

const Card = (props) => {
    const address = `${props.address}, ${props.city}, ${props.state}, ${props.country}`;

    return (
        <div className="card m-3 shadow-sm border-0 rounded" style={{ width: '350px' }}> {/* Adjust the width as needed */}
            <h5 className="card-title text-center pt-3 font-weight-bold">{props.title}</h5>
            <div className="card-image">
                <img
                    className="card-img-top rounded-top mx-auto d-block my-2 mx-3" // Added mx-3 for horizontal margin
                    src={props.photo_main}
                    alt=""
                    height="250"
                    style={{ width: "100%", objectFit: "cover" }} // Ensures the image covers the area
                />
            </div>
            <div className="card-body p-3"> {/* Added padding for more space inside the card */}
                <p className="my-2 font-weight-bold">
                    {address.length < 35
                        ? address
                        : address.substring(0, 35) + " ..."}
                </p>
                <div className="row">
                    <div className="col-md-6">
                        <p className="m-0">Price: ₹{props.price}</p>
                        <p className="m-0">Bedrooms: {props.bedrooms}</p>
                        <p className="m-0">Bathrooms: {props.bathrooms}</p>
                    </div>
                    <div className="col-md-6">
                        <p className="m-0">Sale: {props.sale_type}</p>
                        <p className="m-0">Type: {props.home_type}</p>
                        <p className="m-0">Area: {props.sqft} sqft.</p>
                    </div>
                </div>
                <Link className="d-block text-center" to={`/listing/${props.slug}`}>
                    <Button variant="primary" className="my-2" size="lg">
                        View Listing
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Card;
