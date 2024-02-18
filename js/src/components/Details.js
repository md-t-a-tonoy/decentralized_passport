import React, { useEffect, useRef, useState } from "react";
import "../styles/style.css";
import axios from "axios";
import { ethers } from "ethers";
import DETAIL_CONTRACT_ABI from './Contract/detail.json';
import LoadingButton from "./utilites/LoadingButton";
import { useNavigate } from "react-router-dom";

const User_Details = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const history = useNavigate();
  const [userDetailsContract, setUserDetailsContract] = useState(null);
  const [fileImg, setFileImg] = useState(null);
  const [contractInfo, setContractInfo] = useState({
    userName: "",
    userAge: "",
    userDateOfBirth: "",
    userFatherName: "",
    userGender: "",
    userNationality: "",
    userAddress: "",
    userPincode: "",
    // Email: "",
    Aadhar: "",
  });

  // Initialize smart contract
  useEffect(() => {
    const init = async () => {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
      const contractAddress = process.env.REACT_APP_DETAIL_CONTRACT_ADDRESS;
      const contractAbi = DETAIL_CONTRACT_ABI.abi;

      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        wallet
      );
      setUserDetailsContract(contract);
    };
    init();
  }, []);

  // const getCookie = (name) => {
  //   const cookieString = document.cookie;
  //   const cookies = cookieString.split(';');
  //   for (let cookie of cookies) {
  //     const [cookieName, cookieValue] = cookie.split('=');
  //     if (cookieName === name) {
  //       return cookieValue.trim();
  //     }
  //   }
  //   return null;
  // };

  const USER_CONTRACT_ADDRESS = sessionStorage.getItem("Sub_add");
  console.log(USER_CONTRACT_ADDRESS);

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("fileImg", fileImg);
    if (fileImg) {
      try {
        console.log("trying to upload file");
        const formData = new FormData();
        formData.append("file", fileImg);
        console.log("TRYING TO CONNECT TO PINATA...");
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_pinata_api_key,
            pinata_secret_api_key: process.env.REACT_APP_pinata_secret_api_key,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("File uploaded to IPFS: ");
        const ImgHash = `${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        storeIpfsHashInContract(ImgHash);
        // setImgUrl(https://ipfs.io/ipfs/${resFile.data.IpfsHash});
        // console.log("THE IMAGE URL: ", imgUrl);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const storeIpfsHashInContract = async (ipfsHash) => {
    console.log("In the storeIpfsHashInContract function");
    // Replace with the user's actual details
    const transaction = await userDetailsContract.setUserDetails(
      USER_CONTRACT_ADDRESS,
      contractInfo.userName,
      contractInfo.userAge,
      contractInfo.userDateOfBirth,
      contractInfo.userFatherName,
      contractInfo.userGender,
      contractInfo.userNationality,
      contractInfo.userAddress,
      contractInfo.userPincode,
      contractInfo.Aadhar,
      // contractInfo.Email,
      ipfsHash
    );
    await transaction.wait();
    // After the transaction is confirmed, the IPFS hash is stored in the smart contract
    console.log("Transaction Confirmed");
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => {
      history('/user_login');
    }, 1500);                     // Redirect after 1.5 seconds
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContractInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButtonClick = (event) => {
    event.preventDefault();

    // Check if all required fields are filled

    const userName = form.current.elements.userName.value;
    const userAge = form.current.elements.userAge.value;
    const userDateOfBirth = form.current.elements.userDateOfBirth.value;
    const userFatherName = form.current.elements.userFatherName.value;
    const userGender = form.current.elements.userGender.value;
    const userNationality = form.current.elements.userNationality.value;
    const userAddress = form.current.elements.userAddress.value;
    // const Email = form.current.elements.Email.value;
    const Aadhar = form.current.elements.Aadhar.value;

    if (userName && userAge && userDateOfBirth && userFatherName && userGender && userNationality && userAddress && Aadhar) {
      // All required fields are filled, proceed with form submission
      if (!isLoading) {
        sendFileToIPFS(event);
      }
    } else {
      // Display an error message or handle the empty fields case as needed
      alert('Please fill in all required fields');
    }
  };

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
          </div>
          {/* <hr className="border-b-2 border-black" /> */}

          {/* User information */}

          <form ref={form} onSubmit={sendFileToIPFS}>
            <div className="flex ml-56 pl-28 pt-8 pb-8 space-x-20">
              {/* ... User image ... */}
              <div>
                <img
                  src="../images/userimg.png"
                  className="h-56 rounded-xl border-2 border-black border-dashed"
                  alt="user-photo"
                />
                <img
                  src="../images/Vector.png"
                  className="h-14 w-14 -mt-40 ml-20"
                  alt="user-photo"
                />
                <input
                  type="file"
                  onChange={(e) => setFileImg(e.target.files[0])}
                  required
                  className="mt-28 px-2 pl-0"
                />
              </div>
              {/* ... User details ... */}
              <table className="bg-pink-here rounded-3xl w-1/2 pl-16 pt-16 pb-10 bg-opacity-50 shadow-xl text-xl font-kelly ">
                <tr className="flex p-2 pl-12 pt-8">
                  <td className="w-60">Name:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="userName"
                      value={contractInfo.userName}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5 "
                      required
                      placeholder="Name"
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60"> Age:</td>
                  <td>
                    <input
                      type="text"
                      name="userAge"
                      value={contractInfo.userAge}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5 "
                      required
                      placeholder="Age"
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60">Date of Birth:</td>{" "}
                  <td>
                    <input
                      type="date"
                      name="userDateOfBirth"
                      value={contractInfo.userDateOfBirth}
                      onChange={handleInputChange}
                      className="  border-2 border-blue-here bg-white-here font-alg pl-5 w-[235px]"
                      placeholder="dd-mm-yyyy"
                      required
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60">Father's Name:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="userFatherName"
                      value={contractInfo.userFatherName}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="Father's Name"
                      required
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60">Gender:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="userGender"
                      value={contractInfo.userGender}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="Gender"
                      required
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60"> Nationality:</td>
                  <td>
                    <input
                      type="text"
                      name="userNationality"
                      value={contractInfo.userNationality}
                      onChange={handleInputChange}
                      className=" border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="Nationality"
                      required
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60">Address:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="userAddress"
                      value={contractInfo.userAddress}
                      onChange={handleInputChange}
                      className=" border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="Address"
                      required
                    />
                  </td>
                </tr>
                <tr className="flex pl-12 p-2">
                  <td className="w-60">Pincode:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="userPincode"
                      value={contractInfo.userPincode}
                      onChange={handleInputChange}
                      className=" border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="Pincode"
                      required
                    />
                  </td>
                </tr>
                {/* <tr className="flex pl-8 p-2">
                  <td className="w-60">Email:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="Email"
                      value={contractInfo.Email}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5 required"
                      placeholder="Email"
                      required
                    />
                  </td>
                </tr> */}
                <tr className="flex pl-12 p-2">
                  <td className="w-60">Aadhar no.:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="Aadhar"
                      value={contractInfo.Aadhar}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="XXXXXXXXXXX"
                      required
                    />
                  </td>
                </tr>
                {/* <tr className="flex pl-8 p-2">
                  <td className="w-60">Passport no.:</td>
                  <td>
                    <input
                      type="text"
                      name="userPassport"
                      value={contractInfo.userPassport}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="XXXXXXXXXXX"
                    />
                  </td>
                </tr>
                <tr className="flex pl-8 p-2">
                  <td className="w-60">Date of Issue:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="userDoi"
                      value={contractInfo.userDoi}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="dd-mm-yyyy"
                    />
                  </td>
                </tr>
                <tr className="flex pl-8 pb-8 p-2">
                  <td className="w-60">Aadhar:</td>{" "}
                  <td>
                    <input
                      type="text"
                      name="aadhar"
                      value={contractInfo.userAadhar}
                      onChange={handleInputChange}
                      className="border-2 border-blue-here bg-white-here font-alg pl-5"
                      placeholder="dd-mm-yyyy"
                    />
                  </td>
                </tr> */}
                {/* <button
              type="submit"
              className="bg-white-here ml-72 rounded-3xl py-2 px-8 border-4 border-blue-here w-56 -mt-2"
            >
              <Link to="/sign_up">Submit&gt;&gt;&gt;</Link>
            </button> */}
            <div className="mt-2 ml-[100px]">
                <LoadingButton isLoading={isLoading} isSuccess={isSuccess} onClick={handleButtonClick} />
                </div>
                <br /><br />
              </table>

            </div>

          </form>

          {/* <hr className="border-b-2 border-black" /> */}

          <br />
          <br />
        </body>
      </html>
    </>
  );
};

export default User_Details;