// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

// Utils contracts
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/utils/Address.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/utils/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/utils/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/math/SafeMath.sol";
// ERC20 contracts
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC20/ERC20.sol";
// ERC115 Contracts
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC1155/IERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC1155/ERC1155Holder.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC1155/ERC1155Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC1155/IERC1155MetadataURI.sol";


interface IMarketplace {

    struct Order {
        // Order ID
        uint256 orderId;
        // Owner of the NFT
        address seller;
        // NFT registry address
        address nftAddress;
        // NFT ID
        uint256 nftId;
        // Time when order was created
        uint256 createdAt;
        // Amount of tokens to sell
        uint256 amount;
        // Price (in wei) for the published item
        uint256 price;
        
    }
    
    struct Bid {
        // Bid Id
        bytes32 id;
        // Bidder address
        address bidder;
        // Time when bid was created
        uint256 createdAt;
        // amount of tokens to buy
        uint256 amount;
        // Price for the bid in wei
        uint256 price;       
    }
    // Helper Structs
    
    struct Sellers {
        uint256 total;
        uint256[] ordersIds;
    }
    
    struct Seller {
        uint256 total;
        uint256[] ordersIds;
    }
    
    
    // ORDER EVENTS
    event OrderCreated(
        uint256 orderId,
        address indexed seller,
        address indexed nftAddress,
        uint256 nftId,
        uint256 createdAt,
        uint256 amount,
        uint256 priceInWei
        
    );

    event OrderUpdated(
        uint256 orderId,
        uint256 priceInWei
    );

    event OrderSuccessful(
        uint256 orderId,
        address indexed buyer,
        uint256 amount,
        uint256 priceInWei
    );

    event OrderCancelled(uint256 id);
    
    // BID EVENTS
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

contract Marketplace is Ownable, Pausable, IMarketplace, ERC1155Holder, ReentrancyGuard {

    using Address for address;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public acceptedToken;
    
    
    // From ERC1155 registry assetId to order id to Order (to avoid asset collision)
    mapping(address => mapping(uint256 => mapping(uint256 => Order))) public orderByAssetId;
    
    // From ERC1155 registry assetId to order id to Bid (to avoid asset collision)
    mapping(address => mapping(uint256 => mapping(uint256 => Bid))) public bidByOrderId;
    
    // Collect orders from same item and diferent sellers, from ERC1155 registry assetId to itemId
    mapping(address => mapping(uint256 => Sellers)) public sellersByItem;
    
    // Collect orders from seller address
    
    mapping(address => Seller) public ordersBySeller;
    
    // collect order from order id
    mapping(uint256 => Order) public orderById;
    
    // Orders id counter
    uint256 public orders;
    
    // Conversion USD - TRVL
    // (1 USD / TRVL price in USD) * 10.000 - ex: TRVL = 0,25usd => (1/.25)*10000 = 40.000
    uint256 public usdConversion;  
    uint256 public decimals = 10000;

    // marketplace owner's cut
    uint256 public managerCut;
    
    // Data for safeTransfer
    bytes data = "0x00";

    // 1155 Interfaces
    bytes4 public constant _INTERFACE_ID_ERC1155 = 0x4e2312e0;
    bytes4 public constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    /**
     * @dev Initialize this contract. Acts as a constructor
     * @param _acceptedToken - currency for payments
     */
    constructor(address _acceptedToken, uint256 _usdConversion) public Ownable() {
        require(
            _acceptedToken.isContract(),
            "The accepted token address must be a deployed contract"
        );
        require(
            _usdConversion > 0, "usd Conversion can't be 0"
            );
        usdConversion = _usdConversion;
        acceptedToken = IERC20(_acceptedToken);
    }

    /**
     * @dev Sets the paused failsafe. Can only be called by owner
     * @param _setPaused - paused state
     */
    function setPaused(bool _setPaused) public onlyOwner {
        return (_setPaused) ? _pause() : _unpause();
    }

    /**
     * @dev Creates a new order
     * @param _nftAddress - Non fungible registry address
     * @param _assetId - ID of the published NFT
     * @param _amount - amount of tokens to sell 
     * @param _priceInWei - Price in Wei for the supported coin
     
     */
    function createOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei
        
    )
        public payable whenNotPaused
    {
        _createOrder(_nftAddress, _assetId, _amount, _priceInWei);
    }
    
     /**
     * @dev Creates a new order
     * @param _nftAddress - Non fungible registry address
     * @param _assetId - ID of the published NFT
     * @param _priceInWei - Price in Wei for the supported coin
     
     */
    function _createOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei
        
    )
        internal
    {
        
        // Check nft registry
        IERC1155 nftRegistry = _requireERC1155(_nftAddress);

        // Check order creator is the asset owner
        uint256 assetOwnerBalance = nftRegistry.balanceOf(msg.sender, _assetId);

        require(
            assetOwnerBalance >= _amount,
            "Marketplace: dont have enough balance to transfer"
        );

        require(_priceInWei > 0, "Marketplace: Price should be bigger than 0");

        
        // get NFT asset from seller
        nftRegistry.safeTransferFrom(
            msg.sender,
            address(this),
            _assetId,
            _amount,
            data
        );

        // create the orderId
        uint256 orderId = orders;
        orders++;

        // save order
        orderByAssetId[_nftAddress][_assetId][orderId] = Order({
            orderId: orderId,
            seller: msg.sender,
            nftAddress: _nftAddress,
            nftId: _assetId,
            createdAt: block.timestamp,
            amount: _amount,
            price: _priceInWei
            
        });
        
        // save on sellers of this item
        
        Sellers storage sellers = sellersByItem[_nftAddress][_assetId];
        
        sellers.total++;
        sellers.ordersIds.push(orderId);
        
        // 
        
        Seller storage seller = ordersBySeller[msg.sender];
        
        seller.total++;
        seller.ordersIds.push(orderId);
        
        orderById[orderId] = orderByAssetId[_nftAddress][_assetId][orderId];
        
        

        emit OrderCreated(
            orderId,
            msg.sender,
            _nftAddress,
            _assetId,
            block.timestamp,
            _amount,
            _priceInWei
        );
    }

    /**
     * @dev Cancel an already published order
     *  can only be canceled by seller or the contract owner
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     */
    function cancelOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _orderId,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    )
        public whenNotPaused
    {
        Order memory order = orderByAssetId[_nftAddress][_assetId][_orderId];

        require(
            order.seller == msg.sender || msg.sender == owner(),
            "Marketplace: unauthorized sender"
        );
        
         // Remove pending bid if any
        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        if (bid.id != 0) {
            _cancelBid(
                _assetId,
                bid.bidder,
                _nftAddress,
                bid.price,
                _orderId
            );
        }
        
        // remove seller
        _removeSeller(
            _nftAddress,
            _assetId,
            _sellersIndex,
            _sellerIndex,
            order.seller,
            _orderId
            );

        // Cancel order.
        _cancelOrder(
            order.orderId,
            _nftAddress,
            _assetId,
            msg.sender,
            order.amount
        );
    }
    
     /**
     * @dev Cancel an already published order
     *  can only be canceled by seller or the contract owner
     * @param _orderId - Bid identifier
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     * @param _seller - Address
     */
    function _cancelOrder(
        uint256 _orderId,
        address _nftAddress,
        uint256 _assetId,
        address _seller,
        uint256 _amount
    )
        internal
    {
        delete orderByAssetId[_nftAddress][_assetId][_orderId];
        delete orderById[_orderId];
        

        /// send asset back to seller
        IERC1155(_nftAddress).safeTransferFrom(
            address(this),
            _seller,
            _assetId,
            _amount,
            data
        );
        emit OrderCancelled(_orderId);
    }


    /**
     * @dev Update an already published order
     *  can only be updated by seller
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     */
    function updateOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _priceInWei,
        uint256 _orderId
    )
        public whenNotPaused
    {
        Order storage order = orderByAssetId[_nftAddress][_assetId][_orderId];
        Order storage orderbyid = orderById[_orderId];

        // Check valid order to update
        require(order.amount != 0, "Marketplace: asset not available");
        require(order.seller == msg.sender, "Marketplace: sender not allowed");
        
        // check order updated params
        require(_priceInWei > 0, "Marketplace: Price should be bigger than 0");
        
        order.price = _priceInWei;
        orderbyid.price = _priceInWei;
       
        emit OrderUpdated(order.orderId, _priceInWei);
    }

    /**
     * @dev Executes the sale for a published NFT 
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     * @param _priceInWei - Order price
     */
    function safeExecuteOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _orderId,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    )
        public whenNotPaused nonReentrant
    {
        // Get the current valid order for the asset or fail
        Order memory order = _getValidOrder(
            _nftAddress,
            _assetId,
            _orderId
        );

        require(order.amount >= _amount, "Not enough amount");

        /// Check the execution price matches the order price
        uint256 orderPayment =_amount. mul(_priceInWei);
        uint256 orderPrice = _amount.mul(order.price);
        
        require(orderPrice == orderPayment, "Marketplace: invalid price");
        require(order.seller != msg.sender, "Marketplace: unauthorized sender");
        require(IERC1155(_nftAddress).balanceOf(address(this), _assetId) >= _amount, "Not enough token balance" );
        
        uint256 finalTrvlPrice = getTrvlPrice(orderPayment);
        
        // market fee to cut
        uint256 saleShareAmount = 0;

        // Send market fees to owner
        if (managerCut > 0) {
            // Calculate sale share
            
            saleShareAmount = (finalTrvlPrice.mul(managerCut)).div(decimals);

            // Transfer share amount for marketplace Owner
            acceptedToken.safeTransferFrom(
                msg.sender, //buyer
                owner(),
                saleShareAmount
            );
        }

        // Transfer accepted token amount minus market fee to seller
        acceptedToken.safeTransferFrom(
            msg.sender, // buyer
            order.seller, // seller
            finalTrvlPrice.sub(saleShareAmount)
        );
        
         // Remove pending bid if any
        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        if (bid.id != 0) {
            _cancelBid(
                _assetId,
                bid.bidder,
                _nftAddress,
                bid.price,
                _orderId
            );
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
    
    /**
     * @dev Executes the sale for a published NFT
     * @param _orderId - Order Id to execute
     * @param _buyer - address
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - NFT id
     * @param _priceInWei - Order price
     */
    function _executeOrder(
        uint256 _orderId,
        address _buyer,
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    )
        internal
    {
        
        Order storage order = orderByAssetId[_nftAddress][_assetId][_orderId];
        Order storage orderbyid = orderById[_orderId];
     
            
            // Set new amount for the order
        uint256 newAmount = order.amount.sub(_amount); 
        order.amount = newAmount;
        orderbyid.amount = newAmount;
        uint256 newId = _orderId;
        
        if(newAmount == 0) {
            _removeSeller(_nftAddress, _assetId, _sellersIndex, _sellerIndex, order.seller, newId);
        }
    
    
        // Transfer NFT asset
        IERC1155(_nftAddress).safeTransferFrom(
            address(this),
            _buyer,
            _assetId,
            _amount,
            data
        );

        // Notify ..
        emit OrderSuccessful(
            _orderId,
            _buyer,
            _amount,
            _priceInWei
        );
    }


    /**
     * @dev Internal function gets Order by nftRegistry and assetId. Checks for the order validity
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     */
    function _getValidOrder(
        address _nftAddress,
        uint256 _assetId,
        uint256 _orderId
    )
        internal view returns (Order memory order)
    {
        order = orderByAssetId[_nftAddress][_assetId][_orderId];

        require(order.amount != 0, "Marketplace: asset not available");
    }
    
     /**
     * @dev Places a bid for a published NFT and checks for the asset fingerprint
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     * @param _amount - Number of tokens to buy
     * @param _priceInWei - Bid price in acceptedToken currency
     */
    function safePlaceBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _orderId
    )
        public whenNotPaused
    {
       
        _createBid(
            _nftAddress,
            _assetId,
            _amount,
            _priceInWei,
            _orderId
            
        );
    }


    /**
     * @dev Creates a new bid on a existing order
     * @param _nftAddress - Non fungible registry address
     * @param _assetId - ID of the published NFT
     * @param _priceInWei - Price in Wei for the supported coin
     */
    function _createBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _amount,
        uint256 _priceInWei,
        uint256 _orderId
    )
        internal
    {
        // Checks order validity
        Order memory order = _getValidOrder(_nftAddress, _assetId, _orderId);

        require(order.amount >= _amount,  "Not enough amount");
        
        // calculate order payment amount
        uint256 orderPayment = _amount.mul(_priceInWei);
        
        // Check price if theres previous a bid
        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];
        
        if (bid.price != 0) {
            
        require(orderPayment > bid.price, "Marketplace: bid price should be higher than last bid");
           
            _cancelBid(
                _assetId,
                bid.bidder,
                _nftAddress,
                bid.price,
                _orderId
            );

        }
        
        require(_priceInWei > 0, "Marketplace: bid should be > 0");
        

        // Transfer sale amount from bidder to escrow
        acceptedToken.safeTransferFrom(
            msg.sender, // bidder
            address(this),
            orderPayment
        );

        // Create bid
        bytes32 bidId = keccak256(
            abi.encodePacked(
                block.timestamp,
                msg.sender,
                order.orderId,
                _priceInWei,
                _amount
            )
        );

        // Save Bid for this order
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
    
      /**
     * @dev Cancel an already published bid
     *  can only be canceled by seller or the contract owner
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - id of the asset
     
     */
    function cancelBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _orderId
    )
        public whenNotPaused
    {
        Bid memory bid = bidByOrderId[_nftAddress][_assetId][_orderId];

        require(
            bid.bidder == msg.sender || msg.sender == owner(),
            "Marketplace: Unauthorized sender"
        );

        _cancelBid(
            _assetId,
            bid.bidder,
            _nftAddress,
            bid.price,
            _orderId
        );
    }

   
    /**
     * @dev Cancel bid from an already published order
     *  can only be canceled by seller or the contract owner
     * @param _assetId - asset identifier
     * @param _nftAddress - registry address
     * @param _bidder - Address
     * @param _escrowAmount - in acceptenToken currency
     */
    function _cancelBid(
        uint256 _assetId,
        address _bidder,
        address _nftAddress,
        uint256 _escrowAmount,
        uint256 _orderId
    )
        internal
    {
        delete bidByOrderId[_nftAddress][_assetId][_orderId];

        // return escrow to canceled bidder
        acceptedToken.safeTransfer(
            _bidder,
            _escrowAmount
        );

        emit BidCancelled(_assetId);
    }
    
    /**
     * @dev Executes the sale for a published NFT by accepting a current bid
     * @param _nftAddress - Address of the NFT registry
     * @param _assetId - ID of the published NFT
     * @param _priceInWei - Bid price in wei in acceptedTokens currency
     */
    function acceptBid(
        address _nftAddress,
        uint256 _assetId,
        uint256 _priceInWei,
        uint256 _orderId,
        uint256 _sellersIndex,
        uint256 _sellerIndex
    )
        public whenNotPaused nonReentrant
    {
        // check order validity
        Order memory order = _getValidOrder(_nftAddress, _assetId, _orderId);

        // item seller is the only allowed to accept a bid
        require(order.seller == msg.sender, "Marketplace: unauthorized sender");

        Bid storage bid = bidByOrderId[_nftAddress][_assetId][_orderId];
        
        require(bid.price == _priceInWei, "Marketplace: invalid bid price");
        require(order.amount >= bid.amount, "Not enough amount");
        
        bid.price = 0;
        
        emit BidAccepted(bid.id);

        // market fee to cut
        uint256 saleShareAmount = 0;

        // Send market fees to owner
        if (managerCut > 0) {
            // Calculate sale share
            saleShareAmount = (_priceInWei.mul(managerCut)).div(decimals);

            // Transfer share amount for marketplace Owner
            acceptedToken.safeTransfer(                
                owner(),
                saleShareAmount
            );
        }

        // Transfer accepted token amount minus market fee to seller
         acceptedToken.safeTransfer(            
            order.seller, // seller
            _priceInWei.sub(saleShareAmount)
        );

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
    
    function _removeSeller (address _nftAddress, uint256 _assetId, uint256 _sellersIndex, uint256 _sellerIndex, address _sellerAddress, uint256 _orderId ) internal {
        
        Sellers storage sellers = sellersByItem[_nftAddress][_assetId];
        
        require(_orderId ==  sellers.ordersIds[_sellersIndex], "wrong sellers index");
        sellers.ordersIds[_sellersIndex] = sellers.ordersIds[sellers.ordersIds.length - 1];
        sellers.ordersIds.pop();
        sellers.total--;
        
        Seller storage seller = ordersBySeller[_sellerAddress];

        require(_orderId ==  seller.ordersIds[_sellerIndex], "wrong seller index");
        seller.ordersIds[_sellerIndex] = seller.ordersIds[seller.ordersIds.length - 1];
        seller.ordersIds.pop();
        seller.total--;
        
    }

    function setOwnerCut(uint256 _ownerCut) public onlyOwner {
        require(_ownerCut <= 10000);
        managerCut = _ownerCut;
    }
    
    function _requireERC1155(address _nftAddress) internal view returns (IERC1155) {
        require(
            _nftAddress.isContract(),
            "The NFT Address should be a contract"
        );
        return IERC1155(_nftAddress);
    }
     
    
     function getSellers (address _nftAddress, uint256 _assetId ) public view returns (uint256 [] memory, uint256) {
        
        Sellers storage sellers = sellersByItem[_nftAddress][_assetId];
         return (sellers.ordersIds, sellers.total);
    }
    
     function getOrdersId (address _sellerAddress ) public view returns (uint256 [] memory, uint256) {
        Seller memory seller = ordersBySeller[_sellerAddress];
        return (seller.ordersIds, seller.total);
    }  
    
    function getTrvlPrice (uint256 _usdPrice) public view returns (uint256 _trvlPrice) {
        uint256 trvlPrice = (_usdPrice.mul(usdConversion)).div(decimals);
        return trvlPrice;
    }
    
    function changeUsdConversion (uint256 _newConversion, uint256 _newDecimals) public onlyOwner {
        usdConversion = _newConversion;
        decimals = _newDecimals;
    }
    
    
}