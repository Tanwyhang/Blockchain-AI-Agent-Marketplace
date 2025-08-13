// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title AI_Agent_NFT
/// @notice ERC-721 token representing an AI Agent with on-chain metadata.
/// @dev Minimal ERC721 without URI storage; metadata can be queried via getAgent.
contract AI_Agent_NFT is ERC721, Ownable {
    /// @notice Marketplace contract allowed to mint.
    address public marketplace;

    /// @notice Increment-only token id.
    uint256 private _nextTokenId = 1;

    /// @notice Describes the AI agent metadata stored on-chain.
    struct AgentMetadata {
        string name;            // Human-friendly name
        string description;     // What the agent does / overview
        string model_type;      // e.g. "LLM", "Vision", "RAG", "Toolformer"
        string[] capabilities;  // e.g. ["code", "search", "trade"]
        string license_url;     // URL to license terms
    }

    /// @dev tokenId => metadata
    mapping(uint256 => AgentMetadata) private _agentData;

    /// @notice Emitted when a new agent is minted by the marketplace.
    event AgentMinted(uint256 indexed tokenId, address indexed to, string name, string model_type);

    /// @param _marketplace Marketplace contract that can mint new NFTs.
    constructor(address _marketplace) ERC721("AI Agent", "AIA") Ownable(msg.sender) {
        if (_marketplace != address(0)) {
            marketplace = _marketplace;
        }
    }

    /// @notice Set or update the marketplace address.
    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "marketplace=0");
        marketplace = _marketplace;
    }

    /// @notice Mint a new AI Agent NFT to `to` with provided metadata.
    /// @dev Only callable by the marketplace contract.
    function mintAgent(
        address to,
        string calldata name_,
        string calldata description_,
        string calldata model_type_,
        string[] calldata capabilities_,
        string calldata license_url_
    ) external onlyMarketplace returns (uint256 tokenId) {
        require(to != address(0), "invalid to");
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        _agentData[tokenId] = AgentMetadata({
            name: name_,
            description: description_,
            model_type: model_type_,
            capabilities: capabilities_,
            license_url: license_url_
        });

        emit AgentMinted(tokenId, to, name_, model_type_);
    }

    /// @notice Read the on-chain metadata for a given token id.
    function getAgent(uint256 tokenId)
        external
        view
        returns (
            string memory name_,
            string memory description_,
            string memory model_type_,
            string[] memory capabilities_,
            string memory license_url_
        )
    {
        require(_ownerOf(tokenId) != address(0), "nonexistent token");
        AgentMetadata storage m = _agentData[tokenId];
        return (m.name, m.description, m.model_type, m.capabilities, m.license_url);
    }

    /// @notice Total number of tokens minted so far.
    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    /// @dev Restrict function access to the marketplace only.
    modifier onlyMarketplace() {
        require(msg.sender == marketplace, "only marketplace");
        _;
    }
}
