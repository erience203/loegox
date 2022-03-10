import React, { useEffect, useState } from "react";
import { chain_info } from "./chain";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";

import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { injected, setupNetwork, useInactiveListener } from "./connectors";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from "wc-toast";


function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
     toast.error("No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.");
  }
  if (error instanceof UnsupportedChainIdError) {
     toast.error("You're connected to an Unknown network.");
  }
  if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
     toast.error("Please authorize this website to access your Ethereum account.");
  }
  console.log(error);
   toast.error("An unknown error occurred. Check the console for more details.");
}



const NetworkButton = () => {
  const context = useWeb3React();
  
  const { connector, chainId, account, activate, error } = context;
  const [activatingConnector, setActivatingConnector] = useState();

  const activating = (connection) => connection === activatingConnector;
  const connected = (connection) => connection === connector;
  const disabled = (!!activatingConnector || connected(injected) || !!error);

  useInactiveListener(!!activatingConnector);

  const onConnect = async () => {
    try {
      const hasSetup = await setupNetwork();

      if (hasSetup) {
        setActivatingConnector(injected);
        activate(injected);
      }
    }
    catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector('undefined');
    }
  }, [activatingConnector, connector]);

  return (
    <>
      <div>{!!error && <span className="text-danger" style={{ marginTop: "1rem", marginBottom: "0" }}>{getErrorMessage(error)}</span>}</div>
      { (!connected(injected) &&
        <button
          type="button"
          className="lego-button"
          disabled={disabled}
          onClick={
            onConnect
          }
        >
          Connect Wallet
        </button>)

        ||
        
        (activating(injected) && <p className="lego-button">loading...</p>)
      }

      
      {!error && connected(injected) && (
        <button type="button" className="lego-button" >
          {`${account.toString().slice(0, 5)}...${account.toString().slice(-5)}`}
        </button>
      )}
      {connected(injected) && chainId && chain_info[chainId] && <button className="lego-button ml-2">{chain_info[chainId].symbol ? chain_info[chainId].symbol : "UNKNOWN"}</button>}
    </>
  );
};

export default NetworkButton;