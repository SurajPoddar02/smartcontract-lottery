import { ConnectButton } from "web3uikit";
export default function Header () {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h2>Decentralized Lottery</h2>
            <ConnectButton moralisAuth = {false} />
        </div>
    )
}