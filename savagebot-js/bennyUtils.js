/**
 * Benny (bennie) management system for Savage Worlds
 */

export class BennyManager {
  constructor() {
    this.bennies = new Map(); // characterName -> count
    this.mode = 'standard'; // 'standard' or 'deadlands'
  }

  /**
   * Set the benny mode
   * @param {string} mode - 'standard' or 'deadlands'
   */
  setMode(mode) {
    if (!['standard', 'deadlands'].includes(mode)) {
      throw new Error(`Invalid benny mode: ${mode}`);
    }
    this.mode = mode;
  }

  /**
   * Grant bennies to a character
   * @param {string} name - Character name
   * @param {number} count - Number of bennies to grant
   */
  grant(name, count = 1) {
    const current = this.bennies.get(name) || 0;
    this.bennies.set(name, current + count);
    return this.bennies.get(name);
  }

  /**
   * Spend a benny
   * @param {string} name - Character name
   * @returns {boolean} - Whether the spend was successful
   */
  spend(name) {
    const current = this.bennies.get(name) || 0;

    if (current <= 0) {
      return false;
    }

    this.bennies.set(name, current - 1);
    return true;
  }

  /**
   * Get benny count for a character
   * @param {string} name - Character name
   * @returns {number} - Benny count
   */
  get(name) {
    return this.bennies.get(name) || 0;
  }

  /**
   * Set benny count for a character
   * @param {string} name - Character name
   * @param {number} count - New benny count
   */
  set(name, count) {
    if (count < 0) {
      throw new Error('Benny count cannot be negative');
    }
    this.bennies.set(name, count);
  }

  /**
   * Clear all bennies for a character
   * @param {string} name - Character name (optional - clears all if not provided)
   */
  clear(name = null) {
    if (name) {
      this.bennies.delete(name);
    } else {
      this.bennies.clear();
    }
  }

  /**
   * Get all characters with bennies
   * @returns {Array} - Array of {name, count}
   */
  getAll() {
    return Array.from(this.bennies.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  /**
   * Format benny list for display
   */
  formatList() {
    const all = this.getAll();

    if (all.length === 0) {
      return '**No bennies tracked**';
    }

    const emoji = this.mode === 'deadlands' ? '🪙' : '🎲';
    const bennyName = this.mode === 'deadlands' ? 'Fate Chip' : 'Benny';

    let output = `**${emoji} ${bennyName} Tracker**\n`;
    output += `Mode: ${this.mode}\n\n`;

    all.forEach(({ name, count }) => {
      const bennyEmojis = emoji.repeat(Math.min(count, 10));
      const extraCount = count > 10 ? ` (+${count - 10})` : '';
      output += `**${name}**: ${bennyEmojis}${extraCount} (${count})\n`;
    });

    return output;
  }
}

/**
 * Character state management
 */
export class StateManager {
  constructor() {
    this.states = new Map(); // characterName -> Set of states
  }

  /**
   * Available character states in Savage Worlds
   */
  static VALID_STATES = [
    'Shaken',
    'Stunned',
    'Vulnerable',
    'Distracted',
    'Entangled',
    'Bound',
    'Prone',
    'Fatigued',
    'Exhausted',
    'Injured',
    'Bleeding',
    'Poisoned',
    'Diseased'
  ];

  /**
   * Normalize state name (case-insensitive, partial matching)
   */
  normalizeState(state) {
    const normalized = state.toLowerCase();

    for (const validState of StateManager.VALID_STATES) {
      if (validState.toLowerCase().startsWith(normalized)) {
        return validState;
      }
    }

    // If no match, return original (allows custom states)
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  }

  /**
   * Add a state to a character
   * @param {string} name - Character name
   * @param {string} state - State to add
   */
  addState(name, state) {
    const normalizedState = this.normalizeState(state);

    if (!this.states.has(name)) {
      this.states.set(name, new Set());
    }

    this.states.get(name).add(normalizedState);
    return normalizedState;
  }

  /**
   * Remove a state from a character
   * @param {string} name - Character name
   * @param {string} state - State to remove
   */
  removeState(name, state) {
    const characterStates = this.states.get(name);
    if (!characterStates) {
      return false;
    }

    const normalizedState = this.normalizeState(state);

    // Try exact match first
    if (characterStates.has(normalizedState)) {
      characterStates.delete(normalizedState);
      return true;
    }

    // Try partial match
    for (const existingState of characterStates) {
      if (existingState.toLowerCase().startsWith(state.toLowerCase())) {
        characterStates.delete(existingState);
        return true;
      }
    }

    return false;
  }

  /**
   * Clear all states for a character
   * @param {string} name - Character name
   */
  clearStates(name) {
    this.states.delete(name);
  }

  /**
   * Get all states for a character
   * @param {string} name - Character name
   * @returns {Array} - Array of states
   */
  getStates(name) {
    const characterStates = this.states.get(name);
    return characterStates ? Array.from(characterStates) : [];
  }

  /**
   * Check if character has a specific state
   * @param {string} name - Character name
   * @param {string} state - State to check
   * @returns {boolean}
   */
  hasState(name, state) {
    const characterStates = this.states.get(name);
    if (!characterStates) {
      return false;
    }

    const normalizedState = this.normalizeState(state);
    return characterStates.has(normalizedState);
  }

  /**
   * Format states for display
   */
  formatStates(name) {
    const states = this.getStates(name);

    if (states.length === 0) {
      return `**${name}**: No states`;
    }

    const stateEmojis = {
      'Shaken': '😵',
      'Stunned': '💫',
      'Vulnerable': '🎯',
      'Distracted': '😶‍🌫️',
      'Entangled': '🕸️',
      'Bound': '⛓️',
      'Prone': '🤕',
      'Fatigued': '😓',
      'Exhausted': '😩',
      'Injured': '🩹',
      'Bleeding': '🩸',
      'Poisoned': '🤢',
      'Diseased': '🤒'
    };

    const stateList = states.map(state => {
      const emoji = stateEmojis[state] || '⚠️';
      return `${emoji} ${state}`;
    }).join(', ');

    return `**${name}**: ${stateList}`;
  }
}
