import React, { useEffect, useState } from 'react';
import CustomErrorPage from './utilites/CustomErrorPage';
import { ethers } from 'ethers';
import GOV_CONTRACT_ABI from './Contract/gov.json';
import Visa_CONTRACT_ABI from './Contract/visa.json';
import { Link } from 'react-router-dom';

const Visa_status = () => {
    const [_uuid, setUuid] = useState('');
    const [status, setStatus] = useState('');
    const [setStatusErrorMessage, setSetStatusErrorMessage] = useState('');
    const [getStatusErrorMessage, setGetStatusErrorMessage] = useState('');
    const [statusesAndNotes, setStatusesAndNotes] = useState([]);
    const [isLoadingSetStatus, setIsLoadingSetStatus] = useState(false);
    const [isLoadingGetStatus, setIsLoadingGetStatus] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Check if session ID exists
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        // Redirect to login page if session ID does not exist
        // window.location.href = '/visa_login';
        return <CustomErrorPage message="Session ID not found. Please log in again." />;
    }

    // Function to handle setting status
    const handleSetStatus = async (e) => {
        e.preventDefault();
        try {
            setIsLoadingSetStatus(true); // Start loading for Set Status

            console.log('Initializing Ether.js...');
            const GOV_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
            const abi = GOV_CONTRACT_ABI.abi;

            // Initialize ethers by connecting to the network
            const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
            const privateKey = process.env.REACT_APP_PRIVATE_KEY;
            const wallet = new ethers.Wallet(privateKey);
            const signer = wallet.connect(provider);

            const contract = new ethers.Contract(GOV_CONTRACT_ADDRESS, abi, signer);
            console.log("Ether.js initialized!!");

            console.log("id:", _uuid, "status:", status);
            // Getting subcontract addr.
            const SubContract = await contract.getSubContractDetails(_uuid);
            console.log('User contract address:', SubContract);

            // Getting visacontract addr.
            const getSubContract = sessionStorage.getItem('uid');
            console.log('Visa address:', getSubContract);

            const Visaabi = Visa_CONTRACT_ABI.abi;
            const Visacontract = new ethers.Contract(getSubContract, Visaabi, signer);
            console.log("Visa Contract Initialized!!");

            // Convert status string to boolean
            const statusBool = status.toLowerCase() === 'approve' ? true : false;

            console.log("id:", SubContract, "status:", statusBool);
            const tx = await Visacontract.setVisaStatus(SubContract, statusBool);
            const st = await tx.wait();
            console.log("Transaction :", st);
            console.log("Status SET!!");

            // Reset form fields after successful transaction
            setIsLoadingSetStatus(false); // Stop loading for Set Status
            setIsSuccess(true);
            setUuid('');
            setStatus('');
            setIsSuccess(false);
        } catch (error) {
            console.error('Error setting status:', error);
            setSetStatusErrorMessage('Error setting status. Please try again.');
            setIsLoadingSetStatus(false); // Stop loading for Set Status
            setTimeout(() => {
                setSetStatusErrorMessage(null);
            }, 3000);
        }
    };

    // Function to handle getting status
    const handleGetStatus = async (e) => {
        e.preventDefault();
        try {
            setIsLoadingGetStatus(true); // Start loading for Get Statuses

            console.log('Initializing Ether.js...');

            // Initialize ethers by connecting to the network
            const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
            const privateKey = process.env.REACT_APP_PRIVATE_KEY;
            const wallet = new ethers.Wallet(privateKey);
            const signer = wallet.connect(provider);
            console.log("Ether.js initialized!!");

            // Getting visacontract addr.
            const getSubContract = sessionStorage.getItem('uid');
            console.log('Visa address:', getSubContract);

            const Visaabi = Visa_CONTRACT_ABI.abi;
            const Visacontract = new ethers.Contract(getSubContract, Visaabi, signer);
            console.log("Visa Contract Initialized!!");

            // console.log("into contract");
            const addresses = await Visacontract.getAllAddresses();
            // console.log('Addresses:', addresses);
            const statuses = await Visacontract.getAllVisaStatuses();
            // console.log('Statuses:', statuses);

            const GOV_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
            const abi = GOV_CONTRACT_ABI.abi;
            const contract = new ethers.Contract(GOV_CONTRACT_ADDRESS, abi, signer);
            console.log("Gov initialized!!");

            const ids = [];
            for (let i = 0; i < addresses.length; i++) {
                const id = await contract.subContractUUIDs(addresses[i]);
                ids.push(id);
            }
            console.log('IDs:', ids);

            const statusesAndAddresses = addresses.map((address, index) => ({
                id: ids[index],
                address: address,
                status: statuses[index]
            }));

            console.log('Statuses and Notes:', statusesAndAddresses);
            setStatusesAndNotes(statusesAndAddresses);
            setIsLoadingGetStatus(false); // Stop loading for Get Statuses
            setIsSuccess(true); // Reset success state
            setIsSuccess(false);
        } catch (error) {
            console.error('Error getting status:', error);
            setGetStatusErrorMessage('Error getting status. Please try again.');
            setIsLoadingGetStatus(false); // Stop loading for Get Statuses
            setTimeout(() => {
                setGetStatusErrorMessage(null);
            }, 3000);
        }
    };

    // Render status dynamically
    // Render status dynamically
    const renderedStatuses = statusesAndNotes.map((status, index) => (
        <div key={index}> {/* Use index as the key */}
            <p>ID: {status.id}</p>
            <p>Address: {status.address}</p>
            <p>Status: {status.status ? "Approved" : "Revoked"}</p>
        </div>
    ));



    // Render visa page
    return (
        <body className='bg-background h-auto p-8 pb-10'>

            <div className=" bg-background font-kelly">

                <h2 className="text-8xl text-center mb-7">Status Page</h2>
                {/* Form to set border status and notes */}
                <div className="flex space-x-16 ml-32">
                    <button type="submit" className="absolute  -mt-28">
                        <Link to="/visa_login">
                            <img
                                src="../images/sign-out.png"
                                alt="LOGO"
                                className="h-12 ml-[1200px]"

                            />

                        </Link>
                    </button>
                    <form
                        id="setStatusForm"
                        className="p-8 text-xl shadow-2xl rounded-3xl ml-20 bg-pink-here h-96 w-[600px]"
                        onSubmit={handleSetStatus}
                    >
                        <table>
                            <tr className="h-20 text-2xl">
                                <td><label htmlFor="uuid" className="px-8 pr-12">ID:</label></td>
                                <td>
                                    <input
                                        type="text"
                                        id="uuid"
                                        name="uuid"
                                        value={_uuid}
                                        onChange={(e) => setUuid(e.target.value)}
                                        placeholder="Enter UUID"
                                        required
                                        className="rounded-xl p-5 w-96 mb-5"
                                    />
                                </td>
                            </tr>
                            <tr className="h-20 text-2xl">
                                <td>
                                    <label htmlFor="status" className="px-8 pr-12">Status:</label>
                                </td>
                                <td>
                                    <select
                                        id="status"
                                        name="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="rounded-xl p-5 w-96 mb-5"
                                        required
                                    >
                                        <option value="">Select status</option>
                                        <option value="Approve">Approve</option>
                                        <option value="Deny">Deny</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                        {/* Removed action and method attributes */}
                        <input
                            type="submit"
                            className="cursor-pointer bg-black text-white border-4 border-black rounded-3xl py-4 ml-96 px-8 hover:border-4 hover:border-blue-200 hover:text-blue-200 shadow-2xl"
                            value={isLoadingSetStatus ? "Loading..." : (isSuccess ? "Status Set!" : "Set Status")} // Show loading or success message
                            disabled={isLoadingSetStatus} // Disable button while loading
                        />
                        {/* Display error message if it exists */}
                        {setStatusErrorMessage && <p className="text-red-500">{setStatusErrorMessage}</p>}
                    </form>
                    <br />
                    {/* Form to get all statuses and notes for a UUID */}
                    <form
                        id="getStatusForm"
                        className="pb-8 text-xl shadow-2xl rounded-3xl ml-20 w-96 bg-pink-here pt-24 pl-28"
                        onSubmit={handleGetStatus}
                    >
                        <label htmlFor="uuid" className="text-3xl -ml-10">GET THE STATUS:</label>
                        {/* Removed action and method attributes */}
                        <input
                            type="submit"
                            className="cursor-pointer bg-black text-white rounded-3xl py-4 mt-5 px-8 hover:border-4 hover:border-blue-200 hover:text-blue-200 border-4 border-black shadow-2xl"
                            value={isLoadingGetStatus ? "Loading..." : "Get Status"} // Show loading message or default text
                            disabled={isLoadingGetStatus} // Disable button while loading
                        />
                        {/* Display error message if it exists */}
                        {getStatusErrorMessage && <p className="text-red-500">{getStatusErrorMessage}</p>}
                    </form>
                </div>
                <hr className="mt-5 border-b-2 border-black" />
                {/* Display all statuses and notes */}
                <div className="allStatuses" id="allStatuses">
                    <h3 className="text-5xl text-center my-5 font-bold mt-16">
                        Status
                    </h3>

                    <div className='bg-pink-here w-[600px] p-8 shadow-2xl rounded-3xl mb-8 ml-[440px]'>
                        {renderedStatuses}
                    </div>
                </div>
            </div>

        </body>





    );
};

export default Visa_status;
