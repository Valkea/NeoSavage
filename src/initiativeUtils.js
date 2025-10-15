/**
 * Initiative and card management for Savage Worlds
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
 * Get numerical value for card rank (for sorting)
 */
function getRankValue(rank) {
  const values = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return values[rank] || 0;
}

/**
 * Shuffle a deck of cards
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
 * Compare two cards for initiative order
 * Higher value wins, ties broken by suit (Spades > Hearts > Diamonds > Clubs)
 * Jokers are always highest
 */
export function compareCards(card1, card2) {
  // Jokers always win
  if (card1.isJoker && card2.isJoker) {
    return card1.suit === 'Black' ? 1 : -1; // Black Joker > Red Joker
  }
  if (card1.isJoker) return 1;
  if (card2.isJoker) return -1;

  // Compare by rank value
  if (card1.value !== card2.value) {
    return card1.value - card2.value;
  }

  // Tie-break by suit
  return (SUIT_ORDER[card1.suit] || 0) - (SUIT_ORDER[card2.suit] || 0);
}

/**
 * Initiative tracker class
 */
export class InitiativeTracker {
  constructor() {
    this.combatants = new Map(); // characterName -> {name, card, onHold, states}
    this.deck = [];
    this.round = 0;
    this.isActive = false;
  }

  /**
   * Start a new fight
   */
  start() {
    this.deck = shuffleDeck(createDeck());
    this.round = 1;
    this.isActive = true;
    this.combatants.clear();
  }

  /**
   * End the current fight
   */
  end() {
    this.isActive = false;
    this.combatants.clear();
    this.round = 0;
  }

  /**
   * Deal cards to combatants
   * @param {Array} names - Names of combatants
   * @param {Object} options - Options for dealing (quickEdge, levelHeadedEdge)
   */
  dealCards(names, options = {}) {
    const results = [];

    for (const name of names) {
      let bestCard = null;
      let cardsDrawn = [this.deck.pop()];

      // Quick edge: draw extra card
      if (options.quickEdge) {
        cardsDrawn.push(this.deck.pop());
      }

      // Level Headed edge: draw extra card(s)
      if (options.levelHeadedEdge) {
        cardsDrawn.push(this.deck.pop());
      }
      if (options.improvedLevelHeaded) {
        cardsDrawn.push(this.deck.pop());
        cardsDrawn.push(this.deck.pop());
      }

      // Keep the best card
      cardsDrawn.sort((a, b) => compareCards(b, a));
      bestCard = cardsDrawn[0];

      this.combatants.set(name, {
        name,
        card: bestCard,
        cardsDrawn,
        onHold: false,
        states: []
      });

      results.push({
        name,
        card: bestCard,
        cardsDrawn: cardsDrawn.length > 1 ? cardsDrawn : null
      });
    }

    return results;
  }

  /**
   * Draw a new card for a combatant
   */
  redrawCard(name) {
    const combatant = this.combatants.get(name);
    if (!combatant) {
      throw new Error(`Combatant ${name} not found`);
    }

    if (this.deck.length === 0) {
      this.deck = shuffleDeck(createDeck());
    }

    const newCard = this.deck.pop();
    combatant.card = newCard;
    combatant.cardsDrawn = [newCard];

    return newCard;
  }

  /**
   * Put a combatant on hold
   */
  putOnHold(name) {
    const combatant = this.combatants.get(name);
    if (!combatant) {
      throw new Error(`Combatant ${name} not found`);
    }
    combatant.onHold = true;
  }

  /**
   * Take a combatant off hold
   */
  takeOffHold(name) {
    const combatant = this.combatants.get(name);
    if (!combatant) {
      throw new Error(`Combatant ${name} not found`);
    }
    combatant.onHold = false;
  }

  /**
   * Remove a combatant from initiative
   */
  remove(name) {
    return this.combatants.delete(name);
  }

  /**
   * Get initiative order
   */
  getInitiativeOrder() {
    const order = Array.from(this.combatants.values());
    order.sort((a, b) => {
      // On-hold combatants go last
      if (a.onHold && !b.onHold) return 1;
      if (!a.onHold && b.onHold) return -1;

      // Otherwise sort by card
      return compareCards(b.card, a.card);
    });
    return order;
  }

  /**
   * Start a new round
   */
  newRound() {
    this.round++;

    // Reshuffle if deck is low
    if (this.deck.length < this.combatants.size * 2) {
      this.deck = shuffleDeck(createDeck());
    }

    // Deal new cards to all combatants
    const names = Array.from(this.combatants.keys());
    const combatantOptions = new Map();

    // Preserve edge options (would need to be stored with combatant)
    for (const name of names) {
      const combatant = this.combatants.get(name);
      combatant.onHold = false; // Clear hold status
    }

    return this.dealCards(names);
  }

  /**
   * Format initiative display
   */
  formatInitiative() {
    if (!this.isActive) {
      return '**No active combat**';
    }

    const order = this.getInitiativeOrder();
    let output = `**📜 Initiative - Round ${this.round}**\n\n`;

    order.forEach((combatant, index) => {
      const cardEmoji = combatant.card.isJoker ? '🃏' : '🎴';
      const holdStatus = combatant.onHold ? ' ⏸️ (On Hold)' : '';
      const states = combatant.states && combatant.states.length > 0
        ? ` [${combatant.states.join(', ')}]`
        : '';

      output += `${index + 1}. **${combatant.name}** ${cardEmoji} ${combatant.card.display}${holdStatus}${states}\n`;
    });

    return output;
  }
}
