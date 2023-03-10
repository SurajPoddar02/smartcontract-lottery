import {useMoralis} from "react-moralis"
//Moralis is the platform that provides developers with a set of tools and services to build decentralized applications (dApps) on the blockchain.

import {useEffect} from "react"
export default function ManualHeader () {
    // when we refresh the page its show that the connect button instead of showing the Contted to...
    // to resolve the issue of (the connected account gone after refresh )we have to use useEffect
    const {enableWeb3, account, isWeb3Enabled,Moralis,deactivateWeb3, isWeb3EnableLoading} = useMoralis();

    useEffect (() => { if(isWeb3Enabled) return
                    if(typeof window !== "undefined") {
                        if(window.localStorage.getItem("connected")) {
                            enableWeb3()
                        }
                    }
                        //  enableWeb3() //problem after refreshing aotmatic pop up the connected metamsak interface
                        }, 
                      [isWeb3Enabled]); 
    useEffect( () => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if(account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("no account found")
            }
        })
    }, [])
    //keep tracking for the depenceies arryu if there is some change do accordingly
     // no array, run on every render
    // empty array, run once
    // dependency array, run when the stuff in it changes
    return (<div> {account ? (<div> connected to {account.slice(0,6)}......{account.slice(account.length-4)} </div>) : (<button onClick = {async () => {
        await enableWeb3()
        if(typeof window !== "unddefined") {
            // this is the KeyboardEvent, value pair
            window.localStorage.setItem("connected","inject");
        }
       }}
       disabled = {isWeb3EnableLoading}>
        Connect </button>)} </div>)
}

