
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";
import { useEffect } from 'react';

type UseAccountResponse = {
  connect: ()=> void;
}
type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider, ethereum}) => (params) => {
  const {data, mutate, ...swr} =  useSWR(provider ? "web3/useAccount" : null, async()=> {
    const accounts = await provider!.listAccounts();
    const account =  accounts[0];
    if (!account) {
      throw "Cannot retrieve account! Connect to wallet"
    }
    return account;
  }, {
    revalidateOnFocus: false
  });
  const handleAccountsChanged = (...args: unknown[]) => {
    const accounts = args[0] as string[];
    if (accounts.length === 0) {
      console.error("Please, connect to Web3 wallet");
    } else if (accounts[0] !== data) {
      alert("accounts has changed");
      mutate(accounts[0]);
    }
  }

  useEffect(() => {
    ethereum?.on("accountsChanged", handleAccountsChanged);
    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    }
  })
  const connect = async ()=> {
    try {
      ethereum?.request({method: "eth_requestAccounts"})
    } catch(err) {
      console.error(err);
    }
  }
  return {...swr, connect};
}
