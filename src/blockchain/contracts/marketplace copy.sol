// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/IERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";

interface IMarketplace {
    struct Order {
        address seller;
        address nftAddress;
        address paymentToken;
        uint256 orderId;
        uint256 nftId;
        uint256 createdAt;
        uint256 amount;
        uint256 price;
    }

    struct Bid {
        bytes32 id;
        address bidder;
        uint256 createdAt;
        uint256 amount;
        uint256 price;
    }

    struct Sellers {
        uint256 total;
        uint256[] ordersIds;
    }

    struct Seller {
        uint256 total;
        uint256[] ordersIds;
    }

    event OrderCreated(
        uint256 orderId,
        address indexed seller,
        address indexed nftAddress,
        address indexed paymentToken,
        uint256 nftId,
        uint256 createdAt,
        uint256 amount,
        uint256 priceInWei
    );

    event OrderUpdated(uint256 orderId, uint256 priceInWei);

    event OrderSuccessful(
        uint256 orderId,
        address indexed buyer,
        uint256 amount,
        uint256 priceInWei
    );

    event OrderCancelled(uint256 id);

    event BidCreated(
        bytes32 id,
        address indexed nftAddress,
        uint256 indexed assetId,
        address indexed bidder,
        uint256 createdAt,
        uint256 amount,
        uint256 priceInWei
    );
    event BidAccepted(bytes32 bidId);
    event BidCancelled(uint256 assetId);
}

contract Marketplace is
    Ownable,
    Pausable,
    IMarketplace,
    ERC1155Holder,
    ReentrancyGuard
{
    using Address for address;

    address[] public acceptedTokens;
    address[] public acceptedNFTs;

    mapping(address => mapping(uint256 => mapping(uint256 => Order)))
        public orderByAssetId;

    mapping(address => mapping(uint256 => mapping(uint256 => Bid)))
        public bidByOrderId;

    mapping(address => mapping(uint256 => Sellers)) public sellersByItem;

    mapping(address => Seller) public ordersBySeller;

    mapping(address => bool) public isAcceptedToken;
    mapping(address => bool) public isAcceptedNFT;

    mapping(uint256 => Order) public orderById;

    uint256 public orders;

    uint256 public managerCut;

    bytes data = "0x00";

    constructor() Ownable() {
        isAcceptedToken[0x0000000000000000000000000000000000000000] = true;
        acceptedTokens.push(0x0000000000000000000000000000000000000000);
    }

    function addAcceptedToken(address _newToken) external onlyOwner {
        require(
            _newToken.isContract(),
            "The accepted token address must be a deployed contract"
        );

        isAcceptedToken[_newToken] = true;
        acceptedTokens.push(_newToken);
    }

    function addAcceptedNFT(address _newNFT) external onlyOwner {
        require(
            _newNFT.isContract(),
            "The accepted NFT address must be a deployed contract"
        );

        isAcceptedNFT[_newNFT] = true;
        acceptedNFTs.push(_newNFT);
    }

    function setPaused(bool _setPaused) external onlyOwner {
        return (_setPaused) ? _pause() : _unpause();
    }

    function createOrder(
        address _nftAddress,
        address _paymentToken,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei
    ) external payable whenNotPaused {
        require(isAcceptedNFT[_nftAddress], "NFT not accepted on marketplace");
        require(
            isAcceptedToken[_paymentToken],
            "Token not accepted as payment method"
        );

        _createOrder(
            _nftAddress,
            _paymentToken,
            _assetId,
            _amount,
            _priceInWei
        );
    }

    function _createOrder(
        address _nftAddress,
        address _paymentToken,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei
    ) internal {
        IERC1155 NFT = IERC1155(_nftAddress);

        uint256 assetOwnerBalance = NFT.balanceOf(msg.sender, _assetId);

        require(
            assetOwnerBalance >= _amount,
            "Marketplace: dont have enough balance to transfer"
        );

        require(_priceInWei > 0, "Marketplace: Price should be bigger than 0");

        NFT.safeTransferFrom(
            msg.sender,
            address(this),
            _assetId,
            _amount,
            data
        );

        uint256 orderId = orders;
        orders++;

        orderByAssetId[_nftAddress][_assetId][orderId] = Order({
            seller: msg.sender,
            nftAddress: _nftAddress,
            paymentToken: _paymentToken,
            orderId: orderId,
            nftId: _assetId,
            createdAt: block.timestamp,
            amount: _amount,
            price: _priceInWei
        });

        Sellers storage sellers = sellersByItem[_nftAddress][_assetId];

        sellers.total++;
        sellers.ordersIds.push(orderId);

        Seller storage seller = ordersBySeller[msg.sender];

        seller.total++;
        seller.ordersIds.push(orderId);

        orderById[orderId] = orderByAssetId[_nftAddress][_assetId][orderId];

        emit OrderCreated(
            orderId,
            msg.sender,
            _nftAddress,
            _paymentToken,
            _assetId,
            block.timestamp,
            _amount,
            _priceInWei
        );
    }

    function cancelOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _orderId,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    ) external whenNotPaused {
        Order memory order = orderByAssetId[_nftAddress][_assetId][_orderId];

        require(
            order.seller == msg.sender || msg.sender == owner(),
            "Marketplace: unauthorized sender"
        );

        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        if (bid.id != 0) {
            _cancelBid(_assetId, bid.bidder, _nftAddress, bid.price, _orderId);
        }

        _removeSeller(
            _nftAddress,
            _assetId,
            _sellersIndex,
            _sellerIndex,
            order.seller,
            _orderId
        );

        _cancelOrder(
            order.orderId,
            _nftAddress,
            _assetId,
            msg.sender,
            order.amount
        );
    }

    function _cancelOrder(
        uint256 _orderId,
        address _nftAddress,
        uint256 _assetId,
        address _seller,
        uint256 _amount
    ) internal {
        delete orderByAssetId[_nftAddress][_assetId][_orderId];
        delete orderById[_orderId];

        IERC1155(_nftAddress).safeTransferFrom(
            address(this),
            _seller,
            _assetId,
            _amount,
            data
        );
        emit OrderCancelled(_orderId);
    }

    function updateOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _priceInWei,
        uint256 _orderId
    ) external whenNotPaused {
        Order storage order = orderByAssetId[_nftAddress][_assetId][_orderId];
        Order storage orderbyid = orderById[_orderId];

        require(order.amount != 0, "Marketplace: asset not available");
        require(order.seller == msg.sender, "Marketplace: sender not allowed");
        require(_priceInWei > 0, "Marketplace: Price should be bigger than 0");

        order.price = _priceInWei;
        orderbyid.price = _priceInWei;

        emit OrderUpdated(order.orderId, _priceInWei);
    }

    function safeExecuteOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _orderId,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    ) external payable whenNotPaused nonReentrant {
        Order memory order = _getValidOrder(_nftAddress, _assetId, _orderId);

        require(order.amount >= _amount, "Not enough amount");
        require(order.seller != msg.sender, "Marketplace: unauthorized sender");
        require(
            IERC1155(_nftAddress).balanceOf(address(this), _assetId) >= _amount,
            "Not enough token balance"
        );

        uint256 orderPayment = _amount * _priceInWei;
        uint256 saleShareAmount = 0;

        if (order.paymentToken == 0x0000000000000000000000000000000000000000) {
            require(msg.value == orderPayment, "not enough BNB to buy");

            if (managerCut > 0) {
                saleShareAmount = (orderPayment * managerCut) / 10000;
                payable(owner()).transfer(saleShareAmount);
            }

            payable(order.seller).transfer(orderPayment - saleShareAmount);
        } else {
            if (managerCut > 0) {
                saleShareAmount = (orderPayment * managerCut) / 10000;
                IERC20(order.paymentToken).transferFrom(
                    msg.sender, //buyer
                    owner(),
                    saleShareAmount
                );
            }

            IERC20(order.paymentToken).transferFrom(
                msg.sender, // buyer
                order.seller, // seller
                orderPayment - saleShareAmount
            );
        }

        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        if (bid.id != 0) {
            _cancelBid(_assetId, bid.bidder, _nftAddress, bid.price, _orderId);
        }

        _executeOrder(
            order.orderId,
            msg.sender, // buyer
            _nftAddress,
            _assetId,
            _amount,
            _priceInWei,
            _sellersIndex,
            _sellerIndex
        );
    }

    function _executeOrder(
        uint256 _orderId,
        address _buyer,
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    ) internal {
        Order storage order = orderByAssetId[_nftAddress][_assetId][_orderId];
        Order storage orderbyid = orderById[_orderId];

        uint256 newAmount = order.amount - _amount;
        order.amount = newAmount;
        orderbyid.amount = newAmount;
        uint256 newId = _orderId;

        if (newAmount == 0) {
            _removeSeller(
                _nftAddress,
                _assetId,
                _sellersIndex,
                _sellerIndex,
                order.seller,
                newId
            );
        }

        IERC1155(_nftAddress).safeTransferFrom(
            address(this),
            _buyer,
            _assetId,
            _amount,
            data
        );

        emit OrderSuccessful(_orderId, _buyer, _amount, _priceInWei);
    }

    function _getValidOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _orderId
    ) internal view returns (Order memory order) {
        order = orderByAssetId[_nftAddress][_assetId][_orderId];

        require(order.amount != 0, "Marketplace: asset not available");
    }

    function safePlaceBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _orderId
    ) external payable whenNotPaused {
        _createBid(_nftAddress, _assetId, _amount, _priceInWei, _orderId);
    }

    function _createBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _orderId
    ) internal {
        Order memory order = _getValidOrder(_nftAddress, _assetId, _orderId);

        require(order.amount >= _amount, "Not enough amount");

        uint256 orderPayment = _amount * _priceInWei;

        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        if (bid.price != 0) {
            require(
                orderPayment > bid.price,
                "Marketplace: bid price should be higher than last bid"
            );

            _cancelBid(_assetId, bid.bidder, _nftAddress, bid.price, _orderId);
        }

        require(_priceInWei > 0, "Marketplace: bid should be > 0");

        if (order.paymentToken == 0x0000000000000000000000000000000000000000) {
            require(msg.value == orderPayment, "not enough BNB to buy");
        } else {
            IERC20(order.paymentToken).transferFrom(
                msg.sender, // bidder
                address(this),
                orderPayment
            );
        }

        bytes32 bidId = keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                order.orderId,
                _priceInWei,
                _amount
            )
        );

        bidByOrderId[_nftAddress][_assetId][_orderId] = Bid({
            id: bidId,
            bidder: msg.sender,
            createdAt: block.timestamp,
            amount: _amount,
            price: orderPayment
        });

        emit BidCreated(
            bidId,
            _nftAddress,
            _assetId,
            msg.sender, // bidder
            block.timestamp,
            _amount,
            orderPayment
        );
    }

    function cancelBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _orderId
    ) external whenNotPaused nonReentrant {
        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        require(
            bid.bidder == msg.sender || msg.sender == owner(),
            "Marketplace: Unauthorized sender"
        );

        _cancelBid(_assetId, bid.bidder, _nftAddress, bid.price, _orderId);
    }

    function _cancelBid(
        uint256 _assetId,
        address _bidder,
        address _nftAddress,
        uint256 _escrowAmount,
        uint256 _orderId
    ) internal {
        Order memory order = _getValidOrder(_nftAddress, _assetId, _orderId);

        delete bidByOrderId[_nftAddress][_assetId][_orderId];

        if (order.paymentToken == 0x0000000000000000000000000000000000000000) {
            payable(_bidder).transfer(_escrowAmount);
        } else {
            IERC20(order.paymentToken).transfer(_bidder, _escrowAmount);
        }

        emit BidCancelled(_assetId);
    }

    function acceptBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _priceInWei,
        uint256 _orderId,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    ) external whenNotPaused nonReentrant {
        Order memory order = _getValidOrder(_nftAddress, _assetId, _orderId);

        require(order.seller == msg.sender, "Marketplace: unauthorized sender");

        Bid storage bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        require(bid.price == _priceInWei, "Marketplace: invalid bid price");
        require(order.amount >= bid.amount, "Not enough amount");

        bid.price = 0;

        emit BidAccepted(bid.id);

        uint256 saleShareAmount = 0;

        if (order.paymentToken == 0x0000000000000000000000000000000000000000) {
            require(msg.value == orderPayment, "not enough BNB to buy");

            if (managerCut > 0) {
                saleShareAmount = (_priceInWei * managerCut) / 10000;
                payable(owner()).transfer(saleShareAmount);
            }

            payable(order.seller).transfer(_priceInWei - saleShareAmount);
        } else {
            if (managerCut > 0) {
                saleShareAmount = (_priceInWei * managerCut) / 10000;

                IERC20(order.paymentToken).transfer(owner(), saleShareAmount);
            }

            IERC20(order.paymentToken).transfer(
                order.seller, // seller
                _priceInWei - saleShareAmount
            );
        }

        _executeOrder(
            order.orderId,
            bid.bidder,
            _nftAddress,
            _assetId,
            bid.amount,
            _priceInWei,
            _sellersIndex,
            _sellerIndex
        );
    }

    function _removeSeller(
        address _nftAddress,
        uint256 _assetId,
        uint256 _sellersIndex,
        uint256 _sellerIndex,
        address _sellerAddress,
        uint256 _orderId
    ) internal {
        Sellers storage sellers = sellersByItem[_nftAddress][_assetId];

        require(
            _orderId == sellers.ordersIds[_sellersIndex],
            "wrong sellers index"
        );
        sellers.ordersIds[_sellersIndex] = sellers.ordersIds[
            sellers.ordersIds.length - 1
        ];
        sellers.ordersIds.pop();
        sellers.total--;

        Seller storage seller = ordersBySeller[_sellerAddress];

        require(
            _orderId == seller.ordersIds[_sellerIndex],
            "wrong seller index"
        );
        seller.ordersIds[_sellerIndex] = seller.ordersIds[
            seller.ordersIds.length - 1
        ];
        seller.ordersIds.pop();
        seller.total--;
    }

    function setOwnerCut(uint256 _ownerCut) external onlyOwner {
        require(_ownerCut <= 10000);
        managerCut = _ownerCut;
    }

    function getSellers(address _nftAddress, uint256 _assetId)
        public
        view
        returns (uint256[] memory, uint256)
    {
        Sellers storage sellers = sellersByItem[_nftAddress][_assetId];
        return (sellers.ordersIds, sellers.total);
    }

    function getOrdersId(address _sellerAddress)
        public
        view
        returns (uint256[] memory, uint256)
    {
        Seller memory seller = ordersBySeller[_sellerAddress];
        return (seller.ordersIds, seller.total);
    }

    function getAcceptedTokens() public view returns (address[] memory) {
        return acceptedTokens;
    }

    function getAcceptedNFTs() public view returns (address[] memory) {
        return acceptedNFTs;
    }
}
