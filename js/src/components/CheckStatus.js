import React, { useState, useEffect } from 'react';
import '../styles/style.css';
import { ethers } from 'ethers';
import USER_CONTRACT_ABI from './Contract/pass.json';
import { Link } from 'react-router-dom';

const CheckStatus = () => {
  const [isLoadingGetStatus, setIsLoadingGetStatus] = useState(false);
  const [visaStatus, setVisaStatus] = useState(null);

  useEffect(() => {
    if (!isLoadingGetStatus) {
      return;
    }

    const getStatus = async () => {
      try {
        console.log('Initializing Ether.js...');
        const USER_CONTRACT_ADDRESS = sessionStorage.getItem("us_uid");
        console.log("USER_CONTRACT_ADDRESS:", USER_CONTRACT_ADDRESS);
        const abi = USER_CONTRACT_ABI.abi;

        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const privateKey = process.env.REACT_APP_PRIVATE_KEY;
        const wallet = new ethers.Wallet(privateKey);
        const signer = wallet.connect(provider);
        console.log("Ether.js initialized!!");

        const visa_address = sessionStorage.getItem("uid") || getCookie("v_Aad");
        console.log("visa_address:", visa_address);
        const userContract = new ethers.Contract(USER_CONTRACT_ADDRESS, abi, signer);
        const tx = await userContract.getVisaStatus(visa_address);
        console.log('STATUS!!:', tx);

        setVisaStatus(tx);
      } catch (error) {
        console.error('Error getting visa status:', error.message);
      } finally {
        setIsLoadingGetStatus(false);
      }
    };

    getStatus();
  }, [isLoadingGetStatus]);

  const handleCheckStatus = async () => {
    setIsLoadingGetStatus(true);
  };

  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue.trim();
      }
    }
    return null;
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
          <Link to="/user">
            <img
              src="../images/sign-out.png"
              alt="LOGO"
              className='h-12 mt-5 ml-[1200px]'
            />
          </Link>
        </button>
        <h1 className="text-5xl pl-8 mt-16 font-kelly font-bold ml-[505px]">Check Your Visa Status</h1>
        <div className="bg-pink-here h-96 font-kelly w-4/5 rounded-3xl px-40 pt-8 pl-80 ml-36 mt-5 pb-80 shadow-xl">
          <input
            type="submit"
            className="cursor-pointer bg-black text-white rounded-3xl py-4 mt-5 px-8 hover:border-4 ml-60 hover:border-blue-200 hover:text-blue-200 border-4 border-black shadow-2xl"
            value={isLoadingGetStatus ? "Loading..." : "Check Status"}
            disabled={isLoadingGetStatus}
            onClick={handleCheckStatus}
          />
          <br />
          <div className='text-3xl space-x-28 mt-12  ml-32 flex'>
            <div>
              <input type="radio" id="Approved" name="status" value="Approved" checked={visaStatus === "Approved" || visaStatus === true} disabled className="appearance-none border border-gray-400 rounded-full w-6 h-6 checked:bg-blue-500 checked:border-transparent"/>
              <label htmlFor="Approved">Approved</label>
            </div>
            <div>
              <input type="radio" id="Revoked" name="status" value="Revoked" checked={visaStatus === "Revoked" || visaStatus === false} disabled className="appearance-none border border-gray-400 rounded-full w-6 h-6 checked:bg-blue-500 checked:border-transparent"/>
              <label htmlFor="Revoked">Revoked</label>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default CheckStatus;
