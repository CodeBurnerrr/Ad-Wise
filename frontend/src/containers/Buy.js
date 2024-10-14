import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { Alert } from "react-bootstrap";
import BackspaceIcon from "@material-ui/icons/Backspace";

const Buy = ({ match, isAuthenticated, email }) => {
    console.log(email)
    const [listing, setListing] = useState({});
    const [coupon, setCoupon] = useState({ coupon: "" });
    const [loading, setLoading] = useState(false);
    const [cart_slug, setCartSlug] = useState("");
    const [alert, setAlert] = useState("");
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(0);
    const [afterdiscount, setAfterDiscount] = useState(0);

    useEffect(() => {
        const slug = match.params.id;
        setCartSlug(slug);
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        axios
            .get(`${process.env.REACT_APP_API_URL}/api/listings/${slug}`, config)
            .then((res) => {
                setListing(res.data);
                setTotalPrice(res.data.price + res.data.price * 0.13);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [match.params.id]);

    const onChange = (e) => {
        setCoupon({ ...coupon, [e.target.name]: e.target.value });   //remove ...coupon
    };

    const applyCoupon = () => {
        if (coupon.coupon === "DISCOUNT1%") {
            const discountAmount = totalPrice * 0.01;
            const newTotalPrice = listing.price + listing.price * 0.13 - discountAmount;
            setTotalPrice(newTotalPrice)
            setAfterDiscount(newTotalPrice);
            setDiscountApplied(discountAmount);
            setCouponApplied(true);
            setAlert("Coupon applied successfully!");
            setError(false);
        } else {
            setCouponApplied(false);
            setAlert("Invalid coupon code.");
            setError(true);
        }
        setShow(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        setLoading(true);
        let buyer = email;
        let realtor = listing.realtor;
        let title = listing.title;
        console.log('buyer', buyer)

        let total_price = totalPrice

        axios
            .post(
                `${process.env.REACT_APP_API_URL}/api/orders/place_order/`,
                { buyer, realtor, cart_slug, title, total_price },
                config
            )
            .then((res) => {
                setLoading(false);
                setShow(true);
                setError(false);
                setAlert("Order Placed Successfully");
                setCoupon({ coupon: "" });
            })
            .catch((err) => {
                setAlert("Couldn't Place the Order");
                setError(true);
                setLoading(false);
            });
    };

    return (
        <>
            <Helmet>
                <title>AD-WISE - {`${listing.title}`} - Buy</title>
                <meta name="description" content="Listing detail" />
            </Helmet>
            {isAuthenticated ? (
                <div className="container my-3">
                    <div className="row">
                        <div className="col-md-8 col-12 border rounded p-4 shadow-lg bg-white">
                            <h1 className="text-center py-2">{listing.title}</h1>
                            <figure className="text-center">
                                <img src={listing.photo_main} alt="Image" className="img-fluid rounded" />
                            </figure>
                            <div className="row detail font-weight-bold">
                                <div className="col-md-6">
                                    <ul className="list-unstyled">
                                        <li><p className="m-1">Price: ₹{listing.price}</p></li>
                                        <li><p className="m-1">Bedrooms: {listing.bedrooms}</p></li>
                                        <li><p className="m-1">Bathrooms: {listing.bathrooms}</p></li>
                                        <li><p className="m-1">Sale Type: {listing.sale_type}</p></li>
                                        <li><p className="m-1">Home Type: {listing.home_type}</p></li>
                                        <li><p className="m-1">Area: {listing.sqft} sqft.</p></li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="list-unstyled">
                                        <li><p className="m-1">Street: {listing.address}</p></li>
                                        <li><p className="m-1">City: {listing.city}</p></li>
                                        <li><p className="m-1">State: {listing.state}</p></li>
                                        <li><p className="m-1">Zipcode: {listing.zipcode}</p></li>
                                        <li><p className="m-1">Country: {listing.country}</p></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-12 border p-0 shadow-lg bg-white rounded">
                            <div className="price-detail-div p-4 rounded">
                                <h2 className="text-center">Price Details</h2>
                            </div>
                            <div className="row p-2 py-3">
                                <div className="col-md-6">
                                    <p>Price: </p>
                                    <p>Tax: </p>
                                </div>
                                <div className="col-md-6 text-right">
                                    <p>₹ {listing.price}</p>
                                    <p>₹ {listing.price * 0.13}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row p-2">
                                <div className="col-md-6">
                                    <p>Total: </p>
                                </div>
                                <div className="col-md-6 text-right">
                                    <p>₹ {totalPrice.toFixed(2)}</p>
                                    {couponApplied && (
                                        <>
                                            <p className="text-success">-₹{discountApplied.toFixed(2)}</p>
                                            <p className="text-success">₹{afterdiscount.toFixed(2)}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="make-payment-div rounded">
                                <h2 className="text-center">Make Payment Now</h2>
                            </div>
                            <div className="form-div mt-3 mx-2">
                                <form>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="CouponCode"
                                            name="coupon"
                                            onChange={onChange}
                                            value={coupon.coupon}
                                            aria-describedby="couponHelp"
                                            placeholder="Enter Coupon Code"
                                        />
                                        <small id="couponHelp" className="form-text text-muted">
                                            Enter a valid coupon code if available.
                                        </small>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary my-3"
                                        onClick={applyCoupon}
                                    >
                                        Apply Coupon
                                    </button>
                                </form>
                                {loading ? (
                                    <button className="btn btn-primary my-3" disabled>
                                        <Loader
                                            type="Oval"
                                            color="#ffffff"
                                            height={32}
                                            width={32}
                                        />
                                    </button>
                                ) : (
                                    <form onSubmit={onSubmit}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary my-3 w-100"
                                        >
                                            Book
                                        </button>
                                    </form>
                                )}
                            </div>
                            {show && (
                                <Alert show={show} variant={error ? "danger" : "success"} role="alert">
                                    <p className="d-flex justify-content-between m-0">
                                        {alert}
                                        <div className="right-btn float-end">
                                            <button
                                                className="btn"
                                                onClick={() => setShow(false)}
                                            >
                                                <BackspaceIcon />
                                            </button>
                                        </div>
                                    </p>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center my-5">
                    <h1>You must log in to see details.</h1>
                    <h2>
                        <Link to="/login" className="btn btn-primary mt-3">Login</Link>
                    </h2>
                </div>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    email: state.auth.user,
});

export default connect(mapStateToProps, {})(Buy);




