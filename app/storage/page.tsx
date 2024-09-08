"use client";

import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import Header from "../components/header";
import Footer from "../components/footer";
import Loader from "../components/loader";

export default function Storage() {
    const [hostedLink, setHostedLink] = useState<string>("");
    const [cid, setCID] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileUpload = async (file: FileList | null) => {
        setLoading(true);

        const apiKey = `${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}`;

        // When uploading a file, you can customize how it's stored to Lighthouse using the
        // below deal parameters

        // Read more here: https://docs.lighthouse.storage/lighthouse-1/tutorials/programmable-storage-with-lighthouse-sdk-and-filecoin#id-3.-setting-deal-parameters
        const dealParams = {
            num_copies: 2, // Number of backup copies
            repair_threshold: 28800, // When a storage sector is considered broken"
            renew_threshold: 240, // When your storage deal should be renewed
            miner: ["t017840"], // Preferwhiteers
            network: "calibration", // Network choice
            deal_duration: 1756643958, // Deal duration in Epoch, you can use : https://www.epochconverter.com/
        };

        const uploadResponse = await lighthouse.upload(file, apiKey, dealParams);

        if (uploadResponse) {
            setHostedLink(`https://gateway.lighthouse.storage/ipfs/${uploadResponse.data.Hash}`);
            setCID(uploadResponse.data.Hash)
            setStep(1);
        }
        setLoading(false);
    };

    return <div className="w-full min-h-screen bg-blue-600">
        <Header />


        <div className="flex items-center justify-center h-screen">

            {loading ? <>
                <Loader /></> : <>
                {/* STEP 1 : Upload File to Lighthouse Storage */}
                {step == 0 && (
                    <div className="flex flex-col items-center h-screen gap-4 pt-48">

                        <div className="flex flex-col items-center justify-center text-white">
                            <h1 className="text-4xl font-bold">Mint Your AI NFT</h1>
                            

                            <div className="flex items-center justify-center w-full mt-16">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={e => handleFileUpload(e.target.files)}
                                    />
                                </label>
                            </div>
                        </div>

                    </div>
                )}
                {/* STEP 2 : View Deal ID */}
                {step == 1 && (
                    <div className="flex flex-row gap-8">

                        <div className="flex flex-col border-2 border-black overflow-hidden p-8 rounded-xl shadow-large bg-yellow-300 w-full">
                            <div className="px-6 py-8 sm:p-10 sm:pb-6">
                                <div className="items-center w-full justify-center grid grid-cols-1 text-center">
                                    <div>
                                        <h2 className="text-black font-bold text-lg lg:text-3xl">
                                            NFT Minted
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 cursor-pointer justify-between pb-8 px-6 sm:px-8 space-y-6">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <a
                                        className="text-black items-center inline-flex bg-white border-2 border-black duration-200 ease-in-out focus:outline-none hover:bg-black hover:shadow-none hover:text-white justify-center rounded-xl shadow-[5px_5px_black] text-center transform transition w-full lg:px-8 lg:py-4 lg:text-4xl px-4 py-2"
                                        href={hostedLink}
                                        target="_blank"
                                    >
                                        Open
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>}
        </div>
        <Footer />
    </div>
}
