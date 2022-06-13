// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalileoERC721 is ERC721Enumerable, Ownable {
    mapping(uint256 => NFT) public NFTdetails;
    mapping(uint256 => string) tokensURI;
    mapping(address => bool) public isManager;

    struct NFT {
        address creator;
    }

    constructor() ERC721("GalileoNFT", "GNFT") {}

    modifier onlyManager() {
        require(isManager[msg.sender], "not manager");
        _;
    }

    function addManagers(address _manager) public onlyOwner {
        isManager[_manager] = true;
    }

    function removeManagers(address _manager) public onlyOwner {
        isManager[_manager] = false;
    }

    function mint(string memory _uri)
        public
        onlyManager
        returns (uint256 tokenId)
    {
        tokenId = totalSupply() + 1;

        NFTdetails[tokenId] = NFT({creator: msg.sender});

        tokensURI[tokenId] = _uri;

        _mint(msg.sender, tokenId);
    }

    function getCreator(uint256 _tokenId) public view returns (address) {
        return NFTdetails[_tokenId].creator;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(_exists(tokenId), "Cannot query non-existent token");

        return tokensURI[tokenId];
    }

    function walletOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokensId;
    }
}