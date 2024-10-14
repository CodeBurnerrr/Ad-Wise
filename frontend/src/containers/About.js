import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

const About = () => {
	const [topSeller, setTopSeller] = useState([]);
	const [realtors, setRealtors] = useState([]);

	useEffect(() => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const getTopSeller = async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/realtors/topseller/`,
					config
				);
				setTopSeller(res.data);
			} catch (err) {
				console.log("Error" + err);
			}
		};

		getTopSeller();
	}, []);

	useEffect(() => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const getRealtors = async () => {
			try {
				const res = await axios.get(
					`${process.env.REACT_APP_API_URL}/api/realtors/`,
					config
				);
				setRealtors(res.data);
			} catch (err) {
				console.log("Error" + err);
			}
		};

		getRealtors();
	}, []);

	return (
		<main className='about'>
	<Helmet>
		<title>AD-WISE - About</title>
		<meta name='description' content='About us' />
	</Helmet>
	<header className='heading-component'>
		<h1 className='font-weight-bold'>AD-WISE</h1>
	</header>
	<section className='container my-3'>
		<div className='row'>
			<div className='col-md-12'>
				<h1 className='subheading-about py-3'>
					We find the perfect home for you
				</h1>
				<p className='text-justify-center'>
							Ad-wise is website to find you the perfect home you are looking
							for . It shows you options to Buy or rent shows . One can choose 
							from wide range of options and can even browse through other 
							options . It is easy to use as filter can help to navigate through
							and find the exact thing one is looking for . You need to login to 
							see all the available options and can even logout or change your 
							profile.				
							</p>
				<div className='about__display'>
					<img
						src='https://cms.interiorcompany.com/wp-content/uploads/2023/11/simple-house-design-go-for-minimalist.png'
						alt='no image'
					/>
				</div>
				<p className='text-justify mt-3'>
				Our goal is to simplify your real estate search with 
				personalized recommendations and user-friendly features. 
				Start today to explore available homes.
               
				</p>
			</div>
		</div>
	</section>

	{/* Top Seller Section */}
	<section className='container my-4'>
		<div className='row justify-content-center'>
			<div className='col-md-3'>
				{topSeller.map((val, ind) => (
					<div key={ind} className='top-seller-card'>
						<h2>Top Seller</h2>
						<figure>
							<img
								src={val.photo}
								alt={val.name}
								width='100%'
								height='auto'
								className='seller-image'
							/>
						</figure>
						<div className='details-realtor'>
							<h2>{val.name}</h2>
							<h5>{val.phone}</h5>
							<h5>{val.email}</h5>
							<p>{val.description}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	</section>

	{/* Realtors Section */}
	<section className='container my-4'>
		<h1 className='subheading-about py-3'>Meet our awesome team!</h1>
		<div className='row'>
			{realtors.map((val, ind) => (
				<div className='col-md-4' key={ind}>
					<div className='other-realtors-card'>
						<figure>
							<img
								src={val.photo}
								alt={val.name}
								width='100%'
								height='auto'
								className='team-image'
							/>
						</figure>
						<div className='details-realtor'>
							<h2>{val.name}</h2>
							<h5>{val.phone}</h5>
							<h5>{val.email}</h5>
							<p>{val.description.substring(0, 120)}...</p>
						</div>
					</div>
				</div>
			))}
		</div>
	</section>
</main>
);
};

export default About;
