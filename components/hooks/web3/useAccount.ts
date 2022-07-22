
import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type AccountHookFactory = CryptoHookFactory<string, string>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = ({provider}) => (params) => {
  const swrRes =   useSWR(provider ? "web3/useAccount" : null, async()=> {
    const accounts = await provider!.listAccounts();
    const account =  accounts[0];
    console.log(account);
    if (!account) {
      throw "Cannot retrieve account! Connect to wallet"
    }
    return account;
  });
  return swrRes;
}
