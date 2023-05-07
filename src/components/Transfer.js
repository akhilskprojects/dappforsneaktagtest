import React, { useState } from 'react';
import Web3 from 'web3';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Transfer() {
    const [tokenId, setTokenId] = useState('');
    const [wallet, setWallet] = useState('');
    const [connectedAccount, setConnectedAccount] = useState(null);
    const [Displaymsg, setDisplaymsg] = useState('');

    const connectMetamask = async (e) => {
        e.preventDefault();
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnectedAccount(window.ethereum.selectedAddress);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const address = '0xded7B214C34507844B41144d05C1A2cdeA13d231';
            const contract = new web3.eth.Contract(SneakTag, address);

            try {
                await contract.methods
                    .safeTransferFrom(window.ethereum.selectedAddress, wallet, tokenId)
                    .send({ from: window.ethereum.selectedAddress });
                console.log('NFT transferred successfully');
                setDisplaymsg('NFT transferred successfully');
            } catch (error) {
                console.error('Error transferring NFT:', error.message);
            }
        } else {
            console.error('Please connect MetaMask');
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Transfer SneakNFT</h2>
            <form className="Authenticate-form" onSubmit={handleSubmit}>
                <button className="button1" type="button" onClick={connectMetamask}>Connect Metamask</button>
                {connectedAccount && (
                    <p>
                        Connected Account:{" "}
                        <span className="connected-account">{connectedAccount}</span>
                    </p>
                )}
                <label htmlFor="tokenid">Token ID</label>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} type="text" placeholder="Enter your token ID" id="tokenid" name="tokenid" />
                <label htmlFor="WalletID">Transfer Wallet</label>
                <input value={wallet} onChange={(e) => setWallet(e.target.value)} type="text" placeholder="Enter the Transfer MetaMask Account ID" id="Wallet" name="Wallet" />
                <button type="submit">Transfer</button>
            </form>
            {Displaymsg && (
                <div className="success-message">
                    {Displaymsg}
                </div>
            )}
        </div>
    )
}

export default Transfer;
