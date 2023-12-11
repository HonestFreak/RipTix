import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

function renderSoldItems(items) {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card style={{height: "300px"}}>
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>ticket id #{parseInt(item.itemId._hex)}</Card.Title>
              </Card.Body>
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} XRP - Recieved {ethers.utils.formatEther(item.price)} XRP
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const [totallistings, setTotallistings] = useState(0)
  const [totalsold, setTotalsold] = useState(0)
  const [totalsoldprice, setTotalsoldprice] = useState(0)
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    let totallistings = 0
    let totalsold = 0
    let totalsoldprice = 0
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)

        totallistings += 1
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) {
          soldItems.push(item)
          totalsold += 1
          totalsoldprice += totalPrice
        }
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
    setTotallistings(totallistings)
    setTotalsold(totalsold)
    setTotalsoldprice(totalsoldprice)
  }
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">

    <Row xs={1} md={2} lg={4} className="g-4 py-5" style={{padding: "50px"}}>
            <Card  style={{height: "100px" , width: "200px" }}>
              <Card.Body> <Card.Title>Total Listing</Card.Title> </Card.Body>
              <Card.Footer> {totallistings}   </Card.Footer>
            </Card>

            <Card  style={{height: "100px" , width: "200px" }}>
              <Card.Body> <Card.Title>Total Sold</Card.Title> </Card.Body>
              <Card.Footer> {totalsold}   </Card.Footer>
            </Card>

            <Card  style={{height: "100px" , width: "200px" }}>
              <Card.Body> <Card.Title>Total Earning</Card.Title> </Card.Body>
              <Card.Footer> {ethers.utils.formatEther(totalsoldprice)} XRP   </Card.Footer>
            </Card>

            <Card  style={{height: "100px" , width: "200px" }}>
              <Card.Body> <Card.Title>Tickets Left</Card.Title> </Card.Body>
              <Card.Footer> {totallistings-totalsold}   </Card.Footer>
            </Card>
     
      </Row>

      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                  <Row>ticket id #{parseInt(item.itemId._hex)}</Row>
              </Col>
            ))}
          </Row>
            {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}