pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {
    string public constant name = "Fun Star Notary";
    string public constant symbol = "FSNT";

    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory star = Star(_name);
        tokenIdToStarInfo[_tokenId] = star;
        _mint(msg.sender, _tokenId);
    }

    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    function putStarForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);
        uint256 price = starsForSale[_tokenId];
        address owner = ownerOf(_tokenId);
        require(msg.value >= price);
        _removeTokenFrom(owner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        owner.transfer(price);

        if (msg.value > price) {
            msg.sender.transfer(msg.value - price);
        }
        starsForSale[_tokenId] = 0;
    }

    function exchangeStars(uint256 _tokenId, address receiver, uint256 _reciverTokenId) public {
        require(ownerOf(_tokenId) == msg.sender);
        require(ownerOf(_reciverTokenId) == receiver);
        _removeTokenFrom(receiver, _reciverTokenId);
        _addTokenTo(msg.sender, _reciverTokenId);
        _removeTokenFrom(msg.sender, _tokenId);
        _addTokenTo(receiver, _tokenId);
    }

    function transferStar(address receiver, uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender);
        _removeTokenFrom(msg.sender, _tokenId);
        _addTokenTo(receiver, _tokenId);
    }
}
