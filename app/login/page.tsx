"use client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import EthereumRPC from "./ethereumRPC";
import Header from '../components/header';
import SignClient from "./signClient";

const clientId = "BHEzgfq5vuOIqSumaSypIN04Iy-UXwR0VzL4jDSsCZXmSxXCYO5SRjV_dncJnZPmsB7b0DS8tzre76rzqWM6Le0";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

const openloginAdapter = new OpenloginAdapter();
web3auth.configureAdapter(openloginAdapter);

export default function Login() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/storage');  // Replace with your target route
  };

  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {

        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {

    await web3auth.init();
    if (!loggedIn) {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "google",
      });

      setProvider(web3authProvider);

      if (web3auth.connected) {
        setLoggedIn(true);
        router.push('/storage');
      }
    } else {
      router.push('/storage');
    }

  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
  };

  // Sign Integration
  const createAttestation = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const signClient = new SignClient(ethereumRPC.walletClient);
    uiConsole("Creating Attestation...");

    const address = await ethereumRPC.getAccount();
    const response = await signClient.attest(address);

    uiConsole({
      "hash": response.txHash,
      "attestationId": response.attestationId,
    });
  };

  const fetchAccountAttestations = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const signClient = new SignClient(ethereumRPC.walletClient);
    uiConsole("Fetching Attestation...");

    const address = await ethereumRPC.getAccount();
    const response = await signClient.fetchAccountAttestations(address);

    uiConsole(response);
  }

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  return (

    <div className="flex flex-row fixed w-full">
      {/* LEFT SECTION */}
      <div className="w-3/5 h-screen bg-login-background hidden lg:block"></div>
      {/* RIGHT SECTION */}
      <div className="lg:w-2/5 h-screen bg-blue-600 flex justify-center items-center">
        <div className="flex flex-col border-2 border-black overflow-hidden p-8 rounded-xl shadow-large bg-yellow-300 w-3/4">
          <div className="px-6 py-8 sm:p-10 sm:pb-6">
            <div className="items-center w-full justify-center grid grid-cols-1 text-left">
              <div >
                <h2 className="text-black font-bold text-lg lg:text-3xl">
                  LOGIN WITH BLOCKCHAIN WALLET
                </h2>
                <p className="text-black tracking-tight xl:text-2xl mt-5"></p>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-between pb-8 px-6 sm:px-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a className="text-black items-center inline-flex bg-white border-2 border-black duration-200 ease-in-out focus:outline-none hover:bg-black hover:shadow-none hover:text-white justify-center rounded-xl shadow-[5px_5px_black] text-center transform transition w-full lg:px-4 lg:py-4 lg:text-4xl px-4 py-2 cursor-pointer">
                <div className='cursor-pointer' onClick={login} >
                  Launch App
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

