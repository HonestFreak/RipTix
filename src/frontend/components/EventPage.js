import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [coll, setColl] = useState("");
  const [firstitem, setFirstitem] = useState(1);
  const [image, setImage] = useState("");
  const collectionId = new URLSearchParams(document.location.search).get("id");
  console.log(collectionId)
  console.log(items)
  const loadMarketplaceItems = async () => {
    const collection = await marketplace.collections(collectionId);
    setColl(collection)
    const firstItemId = collection.firstItemId;
    setFirstitem(firstItemId)
    console.log(firstItemId.toString())
    const lastItemId = collection.lastItemId;
    const totalPrice = await marketplace.getTotalPrice(firstItemId)
    const uri = await nft.tokenURI(firstItemId)
    const response = await fetch(uri)
    const metadata = await response.json()
    setImage(metadata.image)
    console.log(image)
    let loadedItems = [];
    for (let i = firstItemId; i <= lastItemId; i++) {
        // here i = itemId
         const item = await marketplace.items(i);
         loadedItems.push({
            itemId: item.itemId,
            available: item.sold ? "🔴Sold" : "🟢Available",
            totalPrice: totalPrice,
          });

      }
    setLoading(false);
    setItems(loadedItems);
    console.log(items)
  };

  const buyMarketItem = async (item) => {
    // Purchase a specific item from the array
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait();
    loadMarketplaceItems();
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  if (loading) return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Loading...</h2>
    </main>
  );

  return (
    <div className="flex justify-center">
  <div className='titles px-5 py-3 container' style={{ backgroundImage: `url(${image})` ,
   backgroundSize: 'cover' , "width": "100%"}}>
    <h1>{coll.name}</h1>
    <h5>✅ Seller Address: {coll.seller}</h5>
    <p className='smalltext'>
      📌{coll.description} <br />
      📍{coll.location} <br />
      🔔{coll.time} <br/>
      🪙{coll.lastItemId-coll.firstItemId+1} tickets minted
    </p>
  </div>

      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card style={{height: "200px"}}>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>🎫 Ticket #{parseInt(item.itemId._hex)-firstitem+1}</Card.Title>
                    <Card.Text>{item.available}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                    {item.available==="🟢Available" && (<Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                      Buy for {ethers.utils.formatEther(item.totalPrice._hex)} XRP
                    </Button>)}
                    {item.available==="🔴Sold" && (<Button onClick={() => alert("ticket not available")} variant="grey" size="lg">
                      Sold Out
                    </Button>)}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: '1rem 0' }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};

export default Home;
