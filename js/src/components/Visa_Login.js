import React, { useEffect, useRef, useState } from 'react';
import '../styles/style.css';
import { ethers } from "ethers";
import { Link, useNavigate } from 'react-router-dom';
import VISA_CONTRACT_ABI from './Contract/visa.json';
import GOV_CONTRACT_ABI from './Contract/gov.json';
import LoadingButton from "./utilites/LoadingButton";

const Visa_Login = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const { VisaAddress } = useContext(SubContractContext);

  // const VISA_CONTRACT_ADDRESS = VisaAddress;
  // // console.log(VISA_CONTRACT_ADDRESS);
  // const [contractAddress, setContractAddress] = useState('');

  // useEffect(() => {
  //   // Extract contract address from URL query parameter
  //   const params = new URLSearchParams(window.location.search);
  //   const contractAddressParam = localStorage.getItem('contractAddress')? 
  //   localStorage.getItem('contractAddress') : params.get('contractAddress');
  //   console.log(contractAddressParam);
  //   if (contractAddressParam) {
  //     setContractAddress(contractAddressParam);
  //   }
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      const _uuid = form.current.elements.email.value;
      const _password = form.current.elements.password.value;


      console.log("Initiating Ether.js...");
      // Initialize ethers by connecting to the network
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);
      console.log("Ether.js initialized!!");

      const Gov_contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const gov_abi = GOV_CONTRACT_ABI.abi;
      const Gov_Contract = new ethers.Contract(Gov_contractAddress, gov_abi, signer);
      const USER_CONTRACT_ADDRESS = await Gov_Contract.getVisa(_uuid);
      console.log("VISA Contract Address:", USER_CONTRACT_ADDRESS);

      const user_abi = VISA_CONTRACT_ABI.abi;
      const visa_Contract = new ethers.Contract(USER_CONTRACT_ADDRESS, user_abi, signer);
      console.log("Visa Contract Initialized!!");

      console.log("Attempting to log in with password:", _password, "and email:", _uuid);
      const loginSuccessful = await visa_Contract.login(_uuid, _password);
      console.log('Login result:', loginSuccessful);

      if (loginSuccessful) {
        console.log("Login successful!");
        // Generate session ID
        const sessionId = generateUUID();
        // Store session ID locally
        sessionStorage.setItem('sessionId', sessionId);
        sessionStorage.setItem('uid', USER_CONTRACT_ADDRESS);
        setIsLoading(false);
        setIsSuccess(true);
        navigate("/visa");
      } else {
        console.error("Invalid credentials. Login failed.");
        setErrorMessage("Invalid credentials. Please try again.");
        setIsLoading(false);
      }
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error calling login function:", error);
      setErrorMessage("Invalid credentials. Please try again.");
      setIsLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }

  };

  const generateUUID = () => {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  const handleButtonClick = (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    const email = form.current.elements.email.value;
    const password = form.current.elements.password.value;

    if (email && password) {
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
            <h1 className="font-kons text-8xl">LOGIN</h1>
            <img src="../images/Passport.png" alt="" className="h-96 mt-12" />
          </div>
          <button type="submit" className="absolute  -mt-28">
            <Link to="/">
              <img
                src="../images/sign-out.png"
                alt="LOGO"
                className="h-12 ml-[1100px]"

              />

            </Link>
          </button>

          <div className="bg-pink-here pr-10 rounded-3xl h-[480px] border-4 border-blue-here">
            {errorMessage && (
              <div className="absolute rounded-2xl bg-background mt-1 ml-9 h-12 w-96 border-4 border-red-500 font-bold text-red-500 flex items-center justify-center">
                {errorMessage}
              </div>
            )}
            <form ref={form} className="font-kelly ml-10 mt-24 space-y-2">
              {/*Email */}
              <label htmlFor="email" className="text-3xl">
                Visa ID
              </label>{' '}
              <br />
              <input
                name='email'
                type="text"
                placeholder="Email"
                required
                className="font-normal h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '}
              <br />
              <br />
              {/* User Name
              <label htmlFor="username" className="text-3xl mt-8">
                Username
              </label>
              <br />
              <input
                name="username"
                type="text"
                placeholder="Username"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{" "}
              <br />
              <br /> */}
              {/* Password */}
              <label htmlFor="password" className="text-3xl">
                Password
              </label>
              <br />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />
              <br />

              {/* Buttons */}
              <br />
              {/* <button type="submit" className="rounded-2xl bg-background h-12 w-96 border-4 border-blue-here hover:border-background hover:bg-opacity-40 hover:text-black">
                SUBMIT
              </button>
              <br />
              <button className="rounded w-96 hover:bg-background hover:text-white hover:w-40 hover:ml-28">
                <Link to="/signup_visa">New user? Signup&gt;&gt;</Link>
              </button> */}
              <LoadingButton isLoading={isLoading} isSuccess={isSuccess} onClick={handleButtonClick} />
              <br />
              <button className="rounded w-96 hover:bg-background hover:text-white hover:w-40 hover:ml-28">
                <Link to="/signup_visa">New user? Signup&gt;&gt;</Link>
              </button>

            </form>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Visa_Login;
