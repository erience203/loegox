import { InjectedConnector } from "@web3-react/injected-connector";
import { chain_info } from "./chain"; 
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

const support_chain = Object.values(chain_info).map((value)=> { return value.chainId });

export const POLLING_INTERVAL = 12000;
export const injected = new InjectedConnector({
  supportedChainIds: support_chain,
});

export const setupNetwork = async (network) => {
  const provider = window.ethereum
  if (provider) {
    const chainId = network ? network :  provider.networkVersion;
    var chainInfo = chain_info[chainId];
    
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainInfo.chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                ChainName: chainInfo.ChainName,
                rpcUrls: chainInfo.rpcUrls,
              },
            ],
          });
          return true;
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error);
          return false;
        }
      }
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false;
  }
}



export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window ;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        activate(injected);
      };
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId) => {
        activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}



