import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const loadMarketplaceItems = async () => {
    // Load all events from the marketplace contract
    const collectionCount = await marketplace.collectionCount();
    let loadedItems = [];
    for (let i = 1; i <= collectionCount; i++) {
         const collection = await marketplace.collections(i);
         const firstItemId = collection.firstItemId;
         console.log(firstItemId.toString())
         const uri = await nft.tokenURI(firstItemId)
         const response = await fetch(uri)
         const metadata = await response.json()
         const totalPrice = await marketplace.getTotalPrice(firstItemId)

         loadedItems.push({
            itemId: i,
            name : collection.name,
            description : collection.description,
            time : collection.time,
            seller : collection.seller,
            location : collection.location,
            image : metadata.image,
            totalPrice : totalPrice
          });

      }
    setLoading(false);
    setItems(loadedItems);
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
      <div className='titles px-5 container'>✨ Event Bookings</div> 
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-4 collection" >
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card className='card'>
                  <Card.Img variant="top" src={item.image} height="170px"/>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className='cardtext'>
                    {item.description.length > 60 ? `${item.description.slice(0, 60)}...` : item.description}
                       <hr style={{ "border-top": "3px dashed white ", "background-color": "transparent"}}/>
                     {item.location} <br/>
                     {item.time}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button className="bg-success" onClick={() => window.location.href = "event?id="+item.itemId} variant="primary" size="md">
                        Book for {ethers.utils.formatEther(item.totalPrice)} XRP
                      </Button>
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
