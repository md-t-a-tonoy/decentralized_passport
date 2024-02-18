import React, { useContext, useRef, useState } from 'react';
import '../styles/style.css';
import { ethers } from 'ethers';
import GOV_CONTRACT_ABI from './Contract/gov.json';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from "./utilites/LoadingButton";
import axios from 'axios';

const Signup_border = () => {
  const form = useRef();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(form.current);

      const _rname = formData.get('fullname');
      // const _id = formData.get('address');
      const _password = formData.get('password');
      const _email = formData.get('email');


      console.log('Initializing Ether.js...');
      const GOV_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
      const abi = GOV_CONTRACT_ABI.abi;

      // Initialize ethers by connecting to the network
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);
      console.log("Ether.js initialized!!");

      console.log('Form values:', _rname, _password, _email);
      // Send form data to the backend
      const response = await axios.post('http://localhost:5000/submit_form', {
        _password,
        _email
        // _id
      });

      console.log('Formatted Receipt:', response.data);

      const response1 = await axios.post('http://localhost:5000/get_borderauthority', {
        _email
      });

      console.log('Formatted Address:', response1.data);
      // const govContract = new ethers.Contract(GOV_CONTRACT_ADDRESS, abi, signer);
      // const tx = await govContract.deployBorderAuthorityContract(_password, _id, _email);

      // const receipt = await tx.wait();
      // console.log('Transaction Receipt:', receipt);

      // // Getting bordersubcontract addr.
      // const getBorderSubContract = await govContract.getBorderAuthority(_id);
      // setAnotherAddress(getBorderSubContract);
      // console.log('BorderSubcontract address:', getBorderSubContract);

      // console.log('Sending request to backend...');
      // const response = await axios.post('http://127.0.0.1:5000/get_border_authority', {
      //   uuid: _id
      // });
      // console.log('Response from backend:', response.data);
      // setAnotherAddress(response.data);

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        history('/border_login');
      }, 1500);                     // Redirect after 1.5 seconds

    } catch (error) {
      console.error('Error deploying contract:', error.message);
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    const _rname = form.current.elements.fullname.value;
    const _email = form.current.elements.email.value;
    // const _id = form.current.elements.address.value;
    // const _mobile = form.current.elements.aadhar.value;
    const _password = form.current.elements.password.value;


    if (_rname && _email && _password) {
      // All required fields are filled, proceed with form submission
      if (!isLoading) {
        handleSubmit(event);
      }
    } else {
      // Display an error message or handle the empty fields case as needed
      alert('Please fill in all required fields');
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="../styles/style.css" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@700&family=Fredoka&family=Koh+Santepheap:wght@300;400;700&family=Roboto+Condensed:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kelly+Slab&display=swap"
          rel="stylesheet"
        />
        <title>Passport System</title>
      </head>

      <body className="bg-background flex flex-col min-h-screen w">
        <div className="flex mt-32 ml-48 space-x-40">
          <div>
            <h1 className="font-kons text-8xl">SIGN UP</h1>
            <img src="../images/Passport.png" alt="" className="h-96 mt-12" />
          </div>

          <div className="bg-pink-here max-w-7xl pl-10 pr-20 rounded-3xl border-4 border-blue-here">
            <form ref={form} onSubmit={handleSubmit} className="font-kelly ml-10 mt-5 space-y-2 pt-8">
              {/* Full Name */}
              <label htmlFor="fullname" className="text-3xl mt-8">
                Full Name
              </label>
              <br />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '}
              <br />
              <br />

              {/* Email */}
              <label htmlFor="email" className="text-3xl">
                Border ID
              </label>{' '}
              <br />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="font-normal h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '}
              <br />
              <br />

              {/* Govt ID */}
              {/* <label htmlFor="address" className="text-3xl mt-8">
                Border ID
              </label>
              <br />
              <input
                type="text"
                name="address"
                placeholder="XXXXXXXXXX"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '} */}


              {/* Mobile Number */}
              {/* <label htmlFor="aadhar" className="text-3xl mt-8">
                Mobile Number
              </label>
              <br />
              <input
                type="text"
                name="aadhar"
                placeholder="**********"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '}
              <br />
              <br /> */}

              {/* Password */}
              <label htmlFor="password" className="text-3xl">
                Password
              </label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="***********"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />
              <br />

              {/* Buttons */}
              <br />
              {/* <button type="submit" className="rounded-2xl bg-background h-12 w-96 border-4 border-blue-here hover:border-background hover:bg-opacity-40 hover:text-black">
                <a href="#!">SUBMIT</a>
              </button> */}
              <LoadingButton isLoading={isLoading} isSuccess={isSuccess} onClick={handleButtonClick} />
              <br />
              <br />

              <button type="submit" className="h-12 absolute ml-56 text-xl ">
                <Link className="hover:bg-background hover:bg-opacity-40 hover:text-white hover:px-2 hover:rounded" to="/border_login">
                  Back to Login &gt;&gt;&gt;
                  {/* <img
                    src="../images/sign-out.png"
                    alt="LOGO"
                  /> */}

                </Link>
              </button>
              <br /><br />
            </form>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Signup_border;
