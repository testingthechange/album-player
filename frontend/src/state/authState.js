// src/state/authState.js
// Placeholder auth + wallet + NFT flags.
// No real login or chain integration yet – this just defines the shape.

export const createAnonymousUser = () => ({
  userId: null,
  email: null,
  displayName: "Guest",
  role: "guest", // "guest" | "admin" | "producer"
  walletAddress: "",
  walletConnected: false,
  preferredChain: "polygon",
});

export const createAdminUser = (overrides = {}) => ({
  userId: overrides.userId || "admin_001",
  email: overrides.email || "admin@example.com",
  displayName: overrides.displayName || "Admin User",
  role: "admin",
  walletAddress: overrides.walletAddress || "",
  walletConnected: !!overrides.walletAddress,
  preferredChain: overrides.preferredChain || "polygon",
});

// Project-level NFT / web3 flags.
// Later this will plug into Meta + Home + a Labs/NFT module.
export const createNftSettings = (overrides = {}) => ({
  enableNft: false,
  chain: "polygon",
  nftCollectionId: "",
  shareOnchain: false,
  ...overrides,
});

// Example of combined app-level auth state (placeholder)
export const createInitialAuthState = () => ({
  currentUser: createAdminUser(), // for now treat as logged-in admin
  nftDefaults: createNftSettings(),
});
