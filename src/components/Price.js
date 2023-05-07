import React, { useState } from 'react';
import Web3 from 'web3';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Price() {
    const [tokenId, setTokenId] = useState('');
    const [price, setPrice] = useState('');
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
          const address = '0xdf7d442280052814a459B401EE7B95F526d520bF';
          const contract = new web3.eth.Contract(SneakTag, address);
  
          // Convert price to Wei
          const priceInWei = web3.utils.toWei(price, 'ether');
  
          try {
              await contract.methods
                  .changeSneakerTagprice(window.ethereum.selectedAddress, tokenId, priceInWei)
                  .send({ from: window.ethereum.selectedAddress });
              console.log(`Price of token ID ${tokenId} has been changed to ${price}`);
              setDisplaymsg(`Price of token ID ${tokenId} has been changed to ${price}`); 
          } catch (error) {
              console.error('Error changing price:', error.message);
          }
      } else {
          console.error('Please connect MetaMask');
      }
  };

    return (
        <div className="auth-form-container">
            <h2>Change the Price</h2>
            <form className="Authenticate-form" onSubmit={handleSubmit}>
                <button className="button1" type="button" onClick={connectMetamask}>Connect Metamask</button>
                {connectedAccount && (
                    <p>
                        Connected Account:{" "}
                        <span className="connected-account">{connectedAccount}</span>
                    </p>
                )}
                <label htmlFor="TokenId">Token ID</label>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} type="text" placeholder="Enter your Token ID" id="TokenId" name="TokenId" />
                <label htmlFor="Price">Price Change</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="Price to be changed" id="Price" name="Price" />
                <button type="submit">Finalize</button>
            </form>
            {Displaymsg && ( // Add this block
                <div className="success-message">
                    {Displaymsg}
                </div>
            )}
        </div>
    )
}

export default Price;
