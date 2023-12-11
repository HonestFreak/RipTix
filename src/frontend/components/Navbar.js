import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Form, FormControl } from 'react-bootstrap';

const SearchBar = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const eventId = parseInt(searchValue, 10);
    if (!isNaN(eventId)) {
      navigate(`/event?id=${eventId}`);
    } else {
      alert('Please enter a valid numeric value.');
    }
  };

  return (
    <Form className="d-flex"  onSubmit={handleSearch}>
      <FormControl
        style={{ width: '400px' }}
        type="text"
        placeholder="Search Event by ID"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value.replace(/[^0-9]/g, ''))}
        className="mr-2"
        aria-label="Search"
        pattern="[0-9]*"
        inputMode="numeric"
        required
      />
      <Button type="submit" variant="outline-success">
      🔍
      </Button>
    </Form>
  );
};

const Navigation = ({ web3Handler, account }) => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="justify-content-center">
      <Container fluid>
        <img src="riptix.png" width="46" height="46" alt="logo" />
        <Navbar.Brand>&nbsp; RipTix</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Explore
            </Nav.Link>
            <Nav.Link as={Link} to="/my-purchases">
              My Bookings
            </Nav.Link>
            <div className="d-flex">
            </div>
          </Nav>
          <Nav className="mx-auto">
            <SearchBar />
            </Nav>
          <div className="ms-auto">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/create">
                Create
              </Nav.Link>
              <Nav.Link as={Link} to="/my-listed-items">
                Listed Tickets
              </Nav.Link>
            </Nav>
          </div>
          <Nav>
            {account ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button nav-button btn-sm mx-4"
              >
                <Button variant="outline-light">
                  {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <Button onClick={web3Handler} variant="outline-light">
                Connect Wallet
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
