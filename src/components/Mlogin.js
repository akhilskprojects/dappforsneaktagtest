import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import SneakTag from './SneakTag.json';
import '../css/App.css';

function Mlogin() {
  const [SneakID, setSneakID] = useState('');
  const [file, setFile] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [Displaymsg, setDisplaymsg] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const address = '0xdf7d442280052814a459B401EE7B95F526d520bF';
      const instance = new web3.eth.Contract(SneakTag, address);
      setContract(instance);
    }
  }, []);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const isManufacturerRegistered = await contract.methods.manufacturers(window.ethereum.selectedAddress).call();
        if (!isManufacturerRegistered) {
          const web3 = new Web3(window.ethereum);
          await contract.methods.verifyAndRegisterManufacturer().send({ from: window.ethereum.selectedAddress, value: web3.utils.toWei('0.0000003', 'ether') });
        }

        setConnectedAccount(window.ethereum.selectedAddress);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log('Please select a file to upload');
      return;
    }

    if (!SneakID) {
      console.log('Please enter a Sneak ID');
      return;
    }

    const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });
    const jsonFile = await file.arrayBuffer();
    const ipfsResponse = await ipfs.add(jsonFile);
    const ipfsHash = ipfsResponse.path;
    const ipfsLink = `https://ipfs.io/ipfs/${ipfsHash}`;

    const web3 = new Web3(window.ethereum);
    const hexSneakId = web3.utils.padRight(web3.utils.asciiToHex(SneakID), 64);
    await contract.methods.associateMetadataWithSneakid(hexSneakId, ipfsHash).send({ from: window.ethereum.selectedAddress });

    setDisplaymsg(`Sneak ID: ${SneakID} and IPFS Link: ${ipfsLink} have been successfully linked.`);
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="auth-form-container">
      <h2>Manufacturer Login</h2>
      <form className="Authenticate-form" onSubmit={handleSubmit}>
        <button className="button1" type="button" onClick={connectMetamask}>Connect Metamask</button>
        {connectedAccount && (
          <p>Connected Account: <span className="connected-account">{connectedAccount}</span></p>
        )}
        <label htmlFor="SneakID">SneakID</label>
        <input value={SneakID} onChange={(e) => setSneakID(e.target.value)} type="text" placeholder="Enter your 256 bit SneakID" id="SneakID" name="SneakID" maxLength={32} />
        <label htmlFor="file">Upload JSON File</label>
        <input type="file" id="file" name="file" onChange={handleFileUpload} accept=".json" />
        <button type="submit">Submit</button>
      </form>
      {Displaymsg && (
        <div className="success-message">
          {Displaymsg}
        </div>
      )}
    </div>
  );
}

export default Mlogin;

