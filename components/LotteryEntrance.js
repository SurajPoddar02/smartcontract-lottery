import {useWeb3Contract,MoralisProvider, useMoralis,} from "react-moralis";
import {abi,contractAddresses} from "../constants"
import { useEffect, useState } from "react";
import {ethers} from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance () {

    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntrnaceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const  dispatch = useNotification();
    // console.log(parseInt(chainId)); // conversion of chainId from hext to integer
    const {runContractFunction: enterRaffle} = useWeb3Contract ({
        abi : abi,
        contractAddress : raffleAddress,
        functionName : "enterRaffle",
        params : {},
        msgValue : entranceFee,

    })
//     console.log(raffleAddress)
//   console.log(contractAddresses)
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumberOfPlayers",
        params: {},
    })
    
    const { runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })
    // console.log(isWeb3Enabled)
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
async function updateUIValues() {
    const entranceFeeFromCall = (await getEntranceFee()).toString()
    const numPlayersFromCall = (await getNumberOfPlayers()).toString()
    const recentWinnerFromCall = (await getRecentWinner())
    setEntrnaceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
      
} 
const handleSuccess = async (tx) => {
    try {
        await tx.wait(1)
        updateUIValues()
        handleNewNotification(tx)
    } catch (error) {
        console.log(error)
    }
}
const handleNewNotification = function () {
    dispatch ({
        types : "info",
        message : "Transaction Complete",
        title : "Tx Notification",
        position : "topR",
        icon : "bell",
    })
}
    return (
        <div>
            {raffleAddress ? (
                <>
                    <button
                       
                        onClick={async () =>
                            await enterRaffle({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                       
                    >
                       Enter Raffle 
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>The current number of players is: {numPlayers}</div>
                    <div>The most previous winner was: {recentWinner}</div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
// NOTE : Moralis know about chainId the reason is beacuse when we using the header components then metamask gives all the information to the moralis provider

// for  installing tailwind css postcss
// yarn add --dev tailwindcss postcss autoprefixer 
// yarn tailwindcss init -p
 
//Extension
//PostCss 