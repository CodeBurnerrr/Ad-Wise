// import React from "react";
// import Alert from "../components/Alert";
// import { Link } from "react-router-dom";

// const Heading = () => {
// 	return (
// 		<>
// 			<div className='heading'>
// 				<h1 className='text-center font-weight-bolder brand-heading'>
// 					<Link exact to='/'>
// 						Welcome To AD-WISE
// 					</Link>
// 				</h1>
// 			</div>
// 			<Alert />
// 		</>
// 	);
// };

// export default Heading;



import React from "react";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";

const Heading = () => {
	return (
		<div className="container my-4">
			<div className="text-center">
				<h1 className="display-4 font-weight-bolder brand-heading">
					<Link to="/" className="text-decoration-none text-primary">
						Welcome To AD-WISE
					</Link>
				</h1>
			</div>
			<Alert />
		</div>
	);
};

export default Heading;

