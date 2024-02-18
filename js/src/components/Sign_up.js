import React, { useContext, useEffect, useRef, useState } from "react";
import { ethers } from 'ethers';
import emailjs from "@emailjs/browser";
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from "./utilites/LoadingButton";
import GOV_CONTRACT_ABI from './Contract/gov.json';
import { SubContractContext } from './utilites/SubContractContext';


// Load environment variables
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const RPC_URL = process.env.REACT_APP_RPC_URL;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
// console.log("PRIVATE_KEY: ", PRIVATE_KEY);
// console.log("RPC_URL: ", RPC_URL);
// console.log("CONTRACT_ADDRESS: ", CONTRACT_ADDRESS);

const generateRandomUsername = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const usernameLength = 8;
  let randomUsername = '';

  for (let i = 0; i < usernameLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomUsername += characters.charAt(randomIndex);
  }

  return randomUsername;
};

const Sign_up = () => {
  const form = useRef();
  const _username = generateRandomUsername();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const { setSubContractAddress } = useContext(SubContractContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);


      console.log('Initializing Ether.js...');

      const formData = new FormData(form.current);

      const privateKey = PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);

      const Gov_contractAddress = CONTRACT_ADDRESS;

      // Set the provider for the wallet
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const connectedWallet = wallet.connect(provider);

      const gov_abi = GOV_CONTRACT_ABI.abi;
      const Gov_Contract = new ethers.Contract(Gov_contractAddress, gov_abi, connectedWallet);

      console.log('Ether.js initialized successfully');

      // Access form ref directly
      emailjs
        .sendForm(
          "service_innq1uf",
          "template_s6bqlrp",
          form.current,
          "bDImEd5GCR6oT0hzq"
        )
        .then(
          async (result) => {
            console.log(result.text);
            alert("YOUR USERNAME HAS BEEN SENT TO YOUR EMAIL ADDRESS.");
            console.log("YOUR USERNAME IS: ", _username);
          });

      // Getting Form values:
      const _rname = formData.get('fullname');
      const _password = formData.get('password');
      const _uuid = formData.get('email');

      console.log('Form values:', _rname, _password, _uuid, _username);

      try {
        // Call deploySubContract function on the existing Gov_contract
        const deploySubContractResult = await Gov_Contract.deploySubContract(_password, _uuid, _username);
        // Wait for the transaction to be mined
        const receipt = await deploySubContractResult.wait();
        console.log('Subcontract Gov_ successfully deployed.', receipt);

        // Getting subcontract addr.
        const getSubContract = await Gov_Contract.getSubContractDetails(_uuid);
        // setSubContractAddress(getSubContract);
        // console.log('Subcontract address:', getSubContract);
        document.cookie = `Sub_add=${getSubContract}; path=/details`;
        sessionStorage.setItem('Sub_add', getSubContract);

        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          history('/details');
        }, 1500);                     // Redirect after 1.5 seconds
      } catch (error) {
        console.error('Error:', error.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error using private key:', error.message);
      console.log(error);
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    const fullName = form.current.elements.fullname.value;
    const email = form.current.elements.email.value;
    const password = form.current.elements.password.value;

    if (fullName && email && password) {
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
            <form ref={form} onSubmit={handleSubmit} className="font-kelly pt-8 ml-10 mt-5 space-y-2">
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
                Email
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

              {/* Address */}
              {/* <label htmlFor="address" className="text-3xl mt-8">
                Address
              </label>
              <br />
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '}
              <br />
              <br /> */}

              {/* Aadhar Number */}
              {/* <label htmlFor="aadhar" className="text-3xl mt-8">
                Aadhar Card Number
              </label>
              <br />
              <input
                type="text"
                name="aadhar"
                placeholder="Aadhar No."
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
                placeholder="Password"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />
              <input
                type="text"
                name="username"
                placeholder="text"
                required
                className="absolute hidden h-10 w-96 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
                defaultValue={_username}
              />
              <br />

              {/* Buttons */}
              <br />
              {/* <button type="submit" className="rounded-2xl bg-background h-12 w-96 border-4 border-blue-here hover:border-background hover:bg-opacity-40 hover:text-black">
                
                <a href="#!">SUBMIT</a>
              </button> */}
              <LoadingButton isLoading={isLoading} isSuccess={isSuccess} onClick={handleButtonClick} />
              <br />

              <button type="submit" className="h-12 absolute ml-56 text-xl ">
                <Link className="hover:bg-background hover:bg-opacity-40 hover:text-white hover:px-2 hover:rounded" to="/user_login">
                  Back to Login &gt;&gt;&gt;
                  {/* <img
                    src="../images/sign-out.png"
                    alt="LOGO"
                  /> */}

                </Link>
              </button>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Sign_up;