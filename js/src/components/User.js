import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import "../styles/style.css";
import { Link } from "react-router-dom";
import DETAIL_CONTRACT_ABI from './Contract/detail.json';
import CustomErrorPage from './utilites/CustomErrorPage';

const User = () => {
  const [visa_status, set_visa_status] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [contractInfo, setContractInfo] = useState({
    Name: "",
    Age: "",
    Date_of_Birth: "",
    Fathername: "",
    Gender: "",
    Nationality: "",
    Address: "",
    Pincode: "",
    // Email: "",
    Aadhar: "",
    Image: "../images/userimg.png",
  });
  // State variables to hold the entered values
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Function to get the value of a cookie by its name
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  };


  // Event handlers to update the state with entered values
  const handleFromPlaceChange = (e) => {
    setFromPlace(e.target.value);
    sessionStorage.setItem("fromPlace", e.target.value);
  };

  const handleToPlaceChange = (e) => {
    setToPlace(e.target.value);
    sessionStorage.setItem("toPlace", e.target.value);
  };

  const [imgUrl, setImgUrl] = useState(null);
  const [sessionIdExists, setSessionIdExists] = useState(false);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if
      (
      selectedValue === "https://indianvisaonline.gov.in/" ||
      selectedValue === "/redirect" ||
      selectedValue === "/CheckStatus" ||
      selectedValue === "/approve"
    ) {
      window.location.href = selectedValue;
    }
  };

  const handleStatus = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log("From Place:", fromPlace);
    console.log("To Place:", toPlace);
  };

  const [statusInfo, setstatusInfo] = useState({
    Status: "",
    Note: "",

  });

  const Status_Info = async () => {

    console.log("Status Info");
    const statusesCookie = getCookie("statuses");
    const notesCookie = getCookie("notes");

    console.log("Statuses Cookie:", statusesCookie);
    if (statusesCookie && notesCookie) {
      setstatusInfo({
        Status: statusesCookie,
        Note: notesCookie
      });
    } else {
      console.log("Statuses or notes cookie not found.");
    }
  };

  useEffect(() => {
    const storedFromPlace = sessionStorage.getItem("fromPlace");
    const storedToPlace = sessionStorage.getItem("toPlace");
    if (storedFromPlace) {
      setFromPlace(storedFromPlace);
    }
    if (storedToPlace) {
      setToPlace(storedToPlace);
    }
    Status_Info();
  }, []);

  useEffect(() => {
    // Check if session ID exists
    const sessionId = sessionStorage.getItem('us_sessionId');
    if (!sessionId) {
      // Redirect to login page if session ID does not exist
      // window.location.href = '/user_login';

      console.error("Session ID not found. Please log in again.");
      return; // Exit the effect if there is no session ID
    } else {
      setSessionIdExists(true); // Set the state to indicate that the session ID exists
    }

    const fetchUserDetails = async () => {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);
      const signer = wallet.connect(provider);
      const userDetailsContractAddress = process.env.REACT_APP_DETAIL_CONTRACT_ADDRESS;
      const userDetailsContractAbi = DETAIL_CONTRACT_ABI.abi;

      const userDetailsContract = new ethers.Contract(userDetailsContractAddress, userDetailsContractAbi, signer);
      const getSubContract = sessionStorage.getItem('us_uid');
      const userDetails = await userDetailsContract.getUserDetails(getSubContract);

      const imageUrl = `https://ipfs.io/ipfs/${userDetails.ipfsHash}`;  // Construct the image URL

      setContractInfo({
        Name: userDetails.name,
        Age: userDetails.age.toString(),
        Date_of_Birth: userDetails.dateOfBirth,
        Fathername: userDetails.fatherName,
        Gender: userDetails.gender,
        Nationality: userDetails.nationality,
        Address: userDetails.userAddress,
        Pincode: userDetails.pincode.toString(),
        // Email: userDetails.email,
        Aadhar: userDetails.aadhar,
        Image: imageUrl,
      });
    };

    if (sessionIdExists) {
      fetchUserDetails(); // Fetch user details only if the session ID exists
    }
  }, [sessionIdExists]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log('Initializing Ether.js...');

  //     // Initialize ethers by connecting to the network
  //     const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
  //     const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  //     const wallet = new ethers.Wallet(privateKey);
  //     const signer = wallet.connect(provider);
  //     console.log("Ether.js initialized!!");

  //     // Getting visacontract addr.
  //     const getSubContract = sessionStorage.getItem('us_uid');
  //     console.log('Subcontract address:', getSubContract);

  //     const Sub_abi = SUB_CONTRACT_ABI.abi;
  //     const User_contract = new ethers.Contract(getSubContract, Sub_abi, signer);
  //     console.log("Visa Contract Initialized!!");

  //     const visa_status = await User_contract.getVisaStatus();
  //     console.log('visa_status:', visa_status);
  //     set_visa_status(visa_status);
  //   } catch (error) {
  //     console.error('Error getting status:', error);
  //     setErrorMessage('Error getting status. Please try again.');
  //   }
  // };

  if (sessionIdExists) {
    return (
      <>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <link rel="stylesheet" href="../styles/style.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@700&family=Fredoka&family=Koh+Santepheap:wght@300;400;700&family=Roboto+Condensed:wght@400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Kelly+Slab&display=swap"
              rel="stylesheet"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />
            <title>Passport System</title>
          </head>
          <body className="bg-background">
            {/* ... Navigation bar ... */}
            <div className="flex space-x-72">
              <img
                src="../images/passport.png"
                alt="LOGO"
                className="h-14 mt-5 mx-8 mb-5"
              />
              <ul className="flex mt-5 space-x-20">

                <table>
                  <tr className="h-20 text-2xl">
                    <td>
                      <select
                        className="p-5 mb-5 w-48 bg-pink-here text-center rounded-3xl h-14 text-3xl font-kelly pt-2 pb-0 flex space-x-5 "
                        value={selectedOption}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Request</option>
                        <option value="/redirect">Change Password</option>
                        <option value="/approve">Change Information</option>
                      </select>
                    </td>
                  </tr>
                </table>

                <table>
                  <tr className="h-20 text-2xl">
                    <td>
                      <select
                        className="p-5 mb-5 w-48 bg-pink-here text-center rounded-3xl h-14 text-3xl font-kelly pt-2 pb-0 flex space-x-5"
                        value={selectedOption}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Visa</option>
                        <option value="https://indianvisaonline.gov.in/">Apply For Visa</option>
                        <option value="/CheckStatus">Check Status</option>
                      </select>
                    </td>
                  </tr>
                </table>

                <li
                  className="p-5 mb-5 w-48 bg-pink-here rounded-3xl h-14 text-3xl font-kelly pt-2 pb-0 text-center flex space-x-5 "
                  required
                >
                  <a className="ml-10 mt-[6px]" href="https://indianvisaonline.gov.in/visa/instruction.html">
                    Rules
                  </a>
                </li>
              </ul>

              <button type="submit">
                <Link to="/user_login">
                  <img
                    src="../images/sign-out.png"
                    alt="LOGO"
                    className="h-12"
                  />
                </Link>
              </button>
            </div>
            <hr className="border-b-2 border-black" />

            {/* User information */}
            <div className="flex ml-56 pl-20 pt-8 pb-8 space-x-20">
              {/* ... User image ... */}
              <img
                src={contractInfo.Image}
                className="h-56 rounded-xl"
                alt="user-photo"
              />
              <table className="bg-pink-here rounded-3xl w-1/2 pl-10 pt-10 pb-10 bg-opacity-50 shadow-xl text-xl font-kelly">
                {/* ... User details ... */}
                <tr className="flex p-2 pl-8 pt-4">
                  <td className="w-60">Name:</td> <td>{contractInfo.Name}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60"> Age:</td><td>{contractInfo.Age}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Date of Birth:</td> <td>{contractInfo.Date_of_Birth}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Father's Name:</td> <td>{contractInfo.Fathername}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Gender:</td> <td>{contractInfo.Gender}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60"> Nationality:</td>
                  <td>{contractInfo.Nationality}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Address:</td> <td>{contractInfo.Address}</td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Pincode:</td> <td>{contractInfo.Pincode}</td>
                </tr>
                {/* <tr className="flex pl-8 p-2">
                  <td className="w-60">Email:</td> <td>{contractInfo.Email}</td>
                </tr> */}
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Aadhar no.:</td> <td>{contractInfo.Aadhar}</td>
                </tr>
                {/* <tr className="flex pl-8 p-2">
                <td className="w-60">Passport no.:</td> 
                <td>{contractInfo.Passport}</td>
              </tr>
              <tr className="flex pl-8 p-2">
                <td className="w-60">Date of Issue:</td> <td>{contractInfo.doi}</td>
              </tr>
              <tr className="flex pl-8 pb-8 p-2">
                <td className="w-60">Expiry Date:</td> <td>{contractInfo.expiry}</td>
              </tr> */}
              </table>
            </div>

            <hr className="border-b-2 border-black" />

            {/* Travel log */}
            <div className="mt-5">
              <h1 className="ml-40 mt-7 text-6xl font-kelly">Travel Logs</h1>
              <br />
              <form onSubmit={handleStatus}>
                <table className="p-5 font-alg text-3xl w-5/6 ml-40 border-4 border-black">
                  <tr className="h-16 p-2">
                    <td className="text-center border-2 w-56 p-5 border-black">
                      From(Place)
                    </td>
                    <td className="border-2 p-5 text-center w-56 border-black">
                      To(Place)
                    </td>
                    <td className="border-2 text-center w-56 border-black">
                      Submit
                    </td>
                    <td className="border-2 p-5 text-center w-56 border-black">
                      Status
                    </td>
                    <td className="border-2 p-5 border-black w-56 text-center">Note</td>

                  </tr>


                  <tr className="h-16 p-2">
                    <td className="text-center border-2 w-56 p-5 border-black">
                      <input
                        type="text"
                        value={fromPlace}
                        onChange={handleFromPlaceChange}
                        disabled={isSubmitted}
                        className="bg-transparent focus:outline-gray-200 text-center"
                      />
                    </td>
                    <td className="border-2 p-5 text-center w-56 border-black">
                      <input
                        type="text"
                        value={toPlace}
                        onChange={handleToPlaceChange}
                        disabled={isSubmitted}
                        className="bg-transparent focus:outline-gray-200 text-center"
                      />
                    </td>
                    <td className="border-2 text-center w-56 border-black">
                      <button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button>
                    </td>
                    <td className="border-2 p-5 text-center w-56 border-black">
                      {statusInfo.Status}
                    </td>
                    <td className="border-2 p-5 border-black w-56 text-center">
                      {statusInfo.Note}
                    </td>
                  </tr>
                  {/*  First Row */}

                  <tr className="h-16 p-2">
                    <td className="border-2 p-5 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>

                  {/* Second Row  */}
                  <tr className="h-16 p-2">
                    <td className="border-2 text-center border-black p-5"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>

                  {/* Third Row  */}
                  <tr className="h-16 p-2">
                    <td className="border-2 text-center border-black p-5"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>

                  {/* Forth Row */}

                  <tr className="h-16 p-2">
                    <td className="border-2 text-center border-black p-5"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>

                  {/* Fifth Row */}

                  <tr className="h-16 p-2">
                    <td className="border-2 text-center border-black p-5"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>

                  {/* Sixth Row */}

                  <tr className="h-16 p-2">
                    <td className="border-2 text-center border-black p-5"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>

                  {/* Seventh Row  */}

                  <tr className="h-16 p-2">
                    <td className="border-2 text-center border-black p-5"></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"><button type="submit" className="border-4 border-black text-5xl text-bold rounded-full w-14 h-14" >+</button></td>
                    <td className="border-2 text-center border-black"></td>
                    <td className="border-2 text-center border-black"></td>
                  </tr>
                </table>
              </form>
            </div>

            <br />
            <br />
          </body>
        </html>
      </>
    );
  } else {
    return <CustomErrorPage message="Session ID not found. Please log in again." />;
  }
};

export default User;