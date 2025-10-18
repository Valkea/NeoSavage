/**
 * Savage Worlds Initiative and Card Management System
 * Card-based initiative tracking for Savage Worlds RPG
 */

const SUITS = ['♠️ Spades', '♥️ Hearts', '♦️ Diamonds', '♣️ Clubs'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUIT_ORDER = { '♠️ Spades': 0, '♥️ Hearts': 1, '♦️ Diamonds': 2, '♣️ Clubs': 3 };

/**
 * Create a standard deck of playing cards
 * @param {boolean} includeJokers - Include jokers in the deck
 * @returns {Array} - Deck of cards
 */
export function createDeck(includeJokers = true) {
  const deck = [];

  // Add standard cards
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        rank,
        suit,
        value: getRankValue(rank),
        display: `${rank} of ${suit}`
      });
    }
  }

  // Add jokers
  if (includeJokers) {
    deck.push({
      rank: 'Joker',
      suit: 'Red',
      value: 14,
      display: '🃏 Red Joker',
      isJoker: true
    });
    deck.push({
      rank: 'Joker',
      suit: 'Black',
      value: 15,
      display: '🃏 Black Joker',
      isJoker: true
    });
  }

  return deck;
}

/**
 * Get numeric value for a card rank
 * @param {string} rank - Card rank
 * @returns {number} - Numeric value
 */
export function getRankValue(rank) {
  const values = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return values[rank] || 0;
}

/**
 * Shuffle a deck of cards using Fisher-Yates algorithm
 * @param {Array} deck - Deck to shuffle
 * @returns {Array} - Shuffled deck
 */
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Compare two cards for initiative ordering
 * Higher values go first, with suit as tiebreaker (Spades > Hearts > Diamonds > Clubs)
 * @param {object} cardA - First card
 * @param {object} cardB - Second card
 * @returns {number} - Comparison result
 */
export function compareCards(cardA, cardB) {
  // Jokers always go first
  if (cardA.isJoker && !cardB.isJoker) return -1;
  if (!cardA.isJoker && cardB.isJoker) return 1;
  if (cardA.isJoker && cardB.isJoker) {
    // Black joker beats red joker
    return cardB.value - cardA.value;
  }

  // Compare by rank/value first
  if (cardA.value !== cardB.value) {
    return cardB.value - cardA.value; // Higher value goes first
  }

  // Same rank, compare by suit (Spades > Hearts > Diamonds > Clubs)
  return SUIT_ORDER[cardA.suit] - SUIT_ORDER[cardB.suit];
}

/**
 * Initiative Tracker class for managing combat rounds and card dealing
 */
export class InitiativeTracker {
  constructor() {
    this.deck = shuffleDeck(createDeck());
    this.dealtCards = [];
    this.round = 0;
    this.isActive = false;
    this.characters = new Map(); // name -> {card, edges: []}
  }

  /**
   * Start a new fight
   */
  start() {
    this.isActive = true;
    this.round = 0;
    this.characters.clear();
    this.resetDeck();
  }

  /**
   * End the current fight
   */
  end() {
    this.isActive = false;
    this.round = 0;
    this.characters.clear();
    this.resetDeck();
  }

  /**
   * Reset and shuffle the deck
   */
  resetDeck() {
    this.deck = shuffleDeck(createDeck());
    this.dealtCards = [];
  }

  /**
   * Deal cards to characters
   * @param {Array} characterNames - Names of characters to deal cards to
   * @param {object} edges - Edge configuration {quick, levelHeaded, improvedLevelHeaded}
   * @returns {object} - Results of card dealing
   */
  dealCards(characterNames, edges = {}) {
    if (!this.isActive) {
      throw new Error('No active fight. Start a fight first.');
    }

    const results = [];

    for (const name of characterNames) {
      const characterEdges = {
        quick: edges.quick || false,
        levelHeaded: edges.level_headed || false,
        improvedLevelHeaded: edges.improved_level_headed || false
      };

      let cardsToraw = 1;

      // Determine how many cards to draw based on edges
      if (characterEdges.improvedLevelHeaded) {
        cardsToraw = 3; // Draw 3, keep best
      } else if (characterEdges.levelHeaded || characterEdges.quick) {
        cardsToraw = 2; // Draw 2, keep best
      }

      // Draw cards
      const drawnCards = [];
      for (let i = 0; i < cardsToraw; i++) {
        if (this.deck.length === 0) {
          this.resetDeck(); // Reshuffle if deck is empty
        }
        drawnCards.push(this.deck.pop());
      }

      // Keep the best card
      drawnCards.sort(compareCards);
      const keptCard = drawnCards[0];
      const droppedCards = drawnCards.slice(1);

      // Store character info
      this.characters.set(name, {
        card: keptCard,
        edges: characterEdges,
        drawnCards,
        droppedCards
      });

      this.dealtCards.push(keptCard);

      results.push({
        name,
        card: keptCard,
        drawnCards,
        droppedCards,
        edges: characterEdges
      });
    }

    return results;
  }

  /**
   * Get initiative order
   * @returns {Array} - Characters sorted by initiative order
   */
  getInitiativeOrder() {
    const characters = Array.from(this.characters.entries()).map(([name, data]) => ({
      name,
      card: data.card,
      edges: data.edges
    }));

    // Sort by card value (compareCards handles the logic)
    characters.sort((a, b) => compareCards(a.card, b.card));

    return characters;
  }

  /**
   * Start a new round
   */
  newRound() {
    if (!this.isActive) {
      throw new Error('No active fight.');
    }

    this.round++;
    // In Savage Worlds, cards are kept for the entire fight
    // Only reshuffle when deck runs out during dealing
  }

  /**
   * Get current round number
   */
  getCurrentRound() {
    return this.round;
  }

  /**
   * Check if fight is active
   */
  isFightActive() {
    return this.isActive;
  }
}