import React, { useRef, useState } from 'react';
import '../styles/style.css';
import { ethers } from 'ethers';
import GOV_CONTRACT_ABI from './Contract/gov.json';
import LoadingButton from "./utilites/LoadingButton";
import { Link } from 'react-router-dom';

const Signup_visa = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(form.current);
      const _id = formData.get('address');
      const _password = formData.get('password');

      console.log('Initializing Ether.js...');
      const GOV_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
      const abi = GOV_CONTRACT_ABI.abi;

      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);
      console.log("Ether.js initialized!!");

      console.log("id:", _id, "password:", _password);
      const govContract = new ethers.Contract(GOV_CONTRACT_ADDRESS, abi, signer);
      const tx = await govContract.deployVisaContract(_id, _password);
      const receipt = await tx.wait();
      console.log('Subcontract VISA successfully deployed.', receipt);

      // Getting VISAcontract addr.
      const getVisaSubContract = await govContract.getVisa(_id);
      console.log('VISA contract address:', getVisaSubContract);
      document.cookie = `v_Aad=${getVisaSubContract}; path=/CheckStatus; SameSite=None; Secure;`;

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = `/visa_login`;
      }, 1500); // Redirect after 1.5 seconds

    } catch (error) {
      console.error('Error deploying contract:', error.message);
      setIsLoading(false);
    }
  };

  const handleButtonClick = (event) => {
    event.preventDefault();

    // Check if all required fields are filled
    const _rname = form.current.elements.fullname.value;
    const _id = form.current.elements.address.value;
    const _password = form.current.elements.password.value;


    if (_rname && _id && _password) {
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
            <form ref={form} onSubmit={handleSubmit} className="font-kelly ml-10 mt-5 space-y-2">
              {/* Full Name */}
              <br />
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
              {/* <label htmlFor="email" className="text-3xl">
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
              <br /> */}

              {/* VISA ID */}
              <label htmlFor="address" className="text-3xl mt-8">
                VISA ID
              </label>
              <br />
              <input
                type="text"
                name="address"
                placeholder="XXXXXXXXXX"
                required
                className="h-10 w-96 px-5 focus:border-blue-here focus:border-4 hover:border-blue-here hover:border-4"
              />{' '}
              <br />
              <br />

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
                <Link className="hover:bg-background hover:bg-opacity-40 hover:text-white hover:px-2 hover:rounded" to="/visa_login">
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

export default Signup_visa;
