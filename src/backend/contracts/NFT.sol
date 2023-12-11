// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    constructor() ERC721("EVENT NFT TICKET", "ENT"){}
    function mint(string memory _tokenURI, uint _quanity) external returns(uint) {
        require(_quanity > 0, "Quantity must be greater than zero");
        for(uint i = 0; i < _quanity; i++){
            tokenCount ++;
            _safeMint(msg.sender, tokenCount);
            _setTokenURI(tokenCount, _tokenURI);
        }
        return tokenCount;
        }
}