// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 
    uint public collectionCount;

    struct Collection {
        uint collectionId;
        string name;
        string description;
        string location;
        string time;
        address seller;
        uint firstItemId;
        uint lastItemId;   
    }

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;
    mapping(uint => Collection) public collections; // collectionId -> array of itemIds

    event Offered(
        uint collectionId,   
        address indexed nft, 
        uint[] tokenIds,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint[] memory _tokenIds, uint _price,
                      string memory _name, string memory _description, 
                      string memory _location, string  memory _time ) 
                      external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        require(_tokenIds.length > 0, "Quantity must be greater than zero");
        collectionCount ++;
        for(uint i = 0; i < _tokenIds.length; i++){
            itemCount ++;
            // transfer nft
            _nft.transferFrom(msg.sender, address(this), _tokenIds[i]);
            // add new item to items mapping
            items[itemCount] = Item (
                itemCount,
                _nft,
                _tokenIds[i],
                _price,
                payable(msg.sender),
                false
            );

        }

        collections[collectionCount] = Collection (
                collectionCount,
                _name,
                _description,
                _location,
                _time,
                msg.sender,
                itemCount - _tokenIds.length + 1,
                itemCount
            );

        // emit Offered event
        emit Offered(
            collectionCount,
            address(_nft),
            _tokenIds,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}
