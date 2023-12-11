import axios from 'axios';
import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
  const [fileImg, setFile] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [time, setTime] = useState("")
  const [price, setPrice] = useState("")
  const [supply, setSupply] = useState(1)
  // const uploadToIPFS = async (event) => {
  //   event.preventDefault()
  //   const file = event.target.files[0]
  //   if (typeof file !== 'undefined') {
  //     try {
  //       const result = await client.add(file)
  //       console.log(result)
  //       setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
  //     } catch (error){
  //       console.log("ipfs image upload error: ", error)
  //     }
  //   }
  // }

  ////////////////////////////////////////////////////////



  const sendJSONtoIPFS = async (ImgHash) => {

    try {

      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          "name": name,
          "description": desc,
          "location": location,
          "time": time,
          "image": ImgHash,
          "base price by organizer": price
        },
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,

        },
      });


      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      //mintNFT(tokenURI, currentAccount)   // pass the winner
      mintThenList(tokenURI)
    } catch (error) {
      console.log("JSON to IPFS: ")
      console.log(error);
    }


  }


  ////////////////////////////////////////////////////////

  const sendFileToIPFS = async (e) => {

    e.preventDefault();
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);
        console.log(formData)
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data"
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        sendJSONtoIPFS(ImgHash)


      } catch (error) {
        console.log("File to IPFS: ")
        console.log(error)
      }
    }
  }

  ////////////////////////////////////////////////////////
  // const createNFT = async () => {
  //   if (!image || !price || !name || !description) return
  //   try{
  //     sendJSONtoIPFS(image)
  //     // const result = await client.add(JSON.stringify({image, price, name, description}))
  //     // mintThenList(result)
  //   } catch(error) {
  //     console.log("ipfs uri upload error: ", error)
  //   }
  // }
  const range = (start, stop) =>
    Array.from({ length: (stop - start + 1)}, (_, i) => start + i );

  const mintThenList = async (uri) => {
    // const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri , supply+1)).wait()
    // get tokenId of new nft 
    const lastTokenId = await nft.tokenCount()
    console.log(lastTokenId)
    const firstTokenId = lastTokenId - supply + 1
    const tokenids = range(firstTokenId, lastTokenId)
    console.log(tokenids)
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await (await marketplace.makeItem(nft.address, tokenids, listingPrice, name, desc, location, time)).wait()
  }
  return (

    <div className="container-fluid mt-5 py-4" style={{"background-color":"#282c34" , "width": "80%" , 
     "border-radius" : "10px"}}>
      <div className='titles px-5 py-3 container'>🦄 Publish Event Tickets</div> 
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control onChange={(e) => setName(e.target.value)} size="md" required type="text" placeholder="Event Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="md" required as="textarea" placeholder="Event Description" />
              <Form.Control onChange={(e) => setLocation(e.target.value)} size="md" required as="textarea" placeholder="Location" />
              <Form.Control onChange={(e) => setTime(e.target.value)} size="md" required as="textarea" placeholder="Date & Time" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="md" required type="number" placeholder="Ticket Price" />
              <Form.Control onChange={(e) => setSupply(e.target.value)} size="md" required type="number" placeholder="Number of Tickets" />
              <Form.Control onChange={(e) => setFile(e.target.files[0])} size="md" required type="file" name="file"/> 
              <div className="d-grid px-0">
                <Button onClick={sendFileToIPFS} variant="primary" size="md">
                🚀 Publish Tickets
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
    
    )
}

export default Create