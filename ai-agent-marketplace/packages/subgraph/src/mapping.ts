import { BigInt } from "@graphprotocol/graph-ts";
import {
  Listed,
  ListingCanceled,
  Purchased,
} from "../generated/AI_Agent_Marketplace/AI_Agent_Marketplace";
import { Transfer } from "../generated/AI_Agent_NFT/AI_Agent_NFT";
import { Listing, Sale, AgentOwnership, OwnershipTransfer } from "../generated/schema";

export function handleListed(event: Listed): void {
  const listingId = event.params.listingId.toString();
  let listing = new Listing(listingId);
  listing.seller = event.params.seller;
  listing.tokenId = event.params.tokenId;
  listing.price = event.params.price;
  listing.active = true;
  listing.createdAt = event.block.timestamp;
  listing.txHash = event.transaction.hash;
  listing.save();
}

export function handleListingCanceled(event: ListingCanceled): void {
  const listingId = event.params.listingId.toString();
  let listing = Listing.load(listingId);
  if (listing) {
    listing.active = false;
    listing.save();
  }
}

export function handlePurchased(event: Purchased): void {
  const listingId = event.params.listingId;
  const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let sale = new Sale(id);
  sale.listingId = listingId;
  sale.buyer = event.params.buyer;
  sale.seller = event.params.seller;
  sale.price = event.params.price;
  // tokenId must be fetched from listing entity
  const listingEntityId = listingId.toString();
  let listing = Listing.load(listingEntityId);
  if (listing) {
    sale.tokenId = listing.tokenId;
    listing.active = false;
    listing.save();
  } else {
    sale.tokenId = BigInt.fromI32(0);
  }
  sale.timestamp = event.block.timestamp;
  sale.txHash = event.transaction.hash;
  sale.save();
}

export function handleTransfer(event: Transfer): void {
  const tokenId = event.params.tokenId;
  const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let current = AgentOwnership.load(tokenId.toString());
  if (current === null) {
    current = new AgentOwnership(tokenId.toString());
  }
  current.owner = event.params.to;
  current.updatedAt = event.block.timestamp;
  current.save();

  const move = new OwnershipTransfer(id);
  move.tokenId = tokenId;
  move.from = event.params.from;
  move.to = event.params.to;
  move.timestamp = event.block.timestamp;
  move.txHash = event.transaction.hash;
  move.save();
}
