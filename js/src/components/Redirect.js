import React, { useState } from 'react';
import '../styles/style.css';
import { ethers } from 'ethers';
import USER_CONTRACT_ABI from './Contract/pass.json';
import LoadingButton from "./utilites/LoadingButton";
import { Link } from 'react-router-dom';

const PassportDetailform = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Function to get the value of a cookie by its name
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const _password = document.querySelector('input[name="password"]').value;

      console.log('Initializing Ether.js...');
      const USER_CONTRACT_ADDRESS = getCookie("uuid");
      const abi = USER_CONTRACT_ABI.abi;

      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);
      console.log("Ether.js initialized!!");

      console.log("password:", _password);
      const userContract = new ethers.Contract(USER_CONTRACT_ADDRESS, abi, signer);
      const tx = await userContract.resetPassword(_password);
      const receipt = await tx.wait();
      console.log('PASSWORD RESETTED!!:', receipt);

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = `/user`;
      }, 1500); // Redirect after 1.5 seconds

    } catch (error) {
      console.error('Error deploying contract:', error.message);
      setIsLoading(false);
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    const _password = document.querySelector('input[name="password"]').value;


    if (_password) {
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
        <div>
          <img
            src="../images/Passport.png"
            alt="LOGO"
            className="h-14 mt-5 mx-8"
          />
        </div>
        <button type="submit" className=" absolute ml-64">
          <Link to="/user_login">
            <img
              src="../images/sign-out.png"
              alt="LOGO"
              className='h-12 mt-5 ml-[1200px]'
            />
          </Link>
        </button>
        <h1 className="text-5xl pl-8 mt-64 font-kelly font-bold ml-[520px] absolute">Change Password</h1>
        <div className="bg-pink-here h-96 font-kelly w-4/5 rounded-3xl p-40 pl-80 ml-36 mt-32 pb-80 shadow-xl">

          <label className="text-3xl">
            Enter your new Password:
          </label>
          <br />
          <br />
          <input
            type="password"
            name="password"
            required
            placeholder="*************"
            className="text-2xl h-12 w-3/4 px-10 pt-3"
          />
          <br />
          <br />

          {/* <button className="rounded-2xl bg-background h-16 w-3/4 border-4 hover:border-blue-here hover:bg-opacity-80 text-2xl border-background bg-opacity-40 hover:text-black">
            <a href="#!">SUBMIT</a>
          </button> */}
          <div className='ml-[100px]'>
            <LoadingButton isLoading={isLoading} isSuccess={isSuccess} onClick={handleButtonClick} />
          </div>

          <br />
        </div>
      </body>
    </html>
  );
};

export default PassportDetailform;
