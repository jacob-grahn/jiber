export const logic = {
  "INIT": [
    ["RUN", "_INIT_DECK"],
    ["RUN", "_INIT_PLAYER"]
  ],
  "PLAY_CARD": [
    ["CHECK", "$self._hiddenCard", "?", false],
    ["CHECK", "$self._hand.length", ">=", "$action.cardIndex"],
    ["SPLICE", "$self._hand", "$action.cardIndex", 1, "$self._hiddenCardList"],
    ["SET", "$self._hiddenCard", "$self._hiddenCardList.0"],
    ["RUN", "_GAME_LOGIC"]
  ],
  "_INIT_DECK": [
    ["CHECK", "_deck", "?", false],
    ["SET", "_deck", [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      13, 13
    ]],
    ["SHUFFLE", "_deck"]
  ],
  "_INIT_PLAYER": [
    ["CHECK", "playerCount", "<", 2],
    ["CHECK", "$self._hand", "?", false],
    ["ADD", "playerCount", 1],
    ["SET", "player${playerCount}", "$self", true],
    ["SPLICE", "_deck", 0, 5, "$self._hand"]
  ],
  "_GAME_LOGIC": [
    ["CHECK", "player1._hiddenCard", "?", true],
    ["CHECK", "player2._hiddenCard", "?", true],
    ["RUN", "_REVEAL_CARDS"],
    ["RUN", "_BATTLE"],
    ["RUN", "_END_GAME"]
  ],
  "_REVEAL_CARDS": [
    ["SET", "player1.revealedCard", "player1._hiddenCard"],
    ["SET", "player2.revealedCard", "player2._hiddenCard"],
    ["SET", "player1._hiddenCard", null],
    ["SET", "player2._hiddenCard", null],
  ],
  "_BATTLE": [
    ["IF", "player1.revealedCard", ">", "player2.revealedCard", [
      ["ADD", "player1.points", 1]
    ]],
    ["IF", "player1.revealedCard", "<", "player2.revealedCard", [
      ["ADD", "player2.points", 1]
    ]],
    ["IF", "player1.revealedCard", "==", "player2.revealedCard", [
      ["ADD", "player1.points", 1],
      ["ADD", "player2.points", 1]
    ]],
    ["SET", "player1.revealedCard", null],
    ["SET", "player2.revealedCard", null]
  ],
  "_END_GAME": [
    ["CHECK", "player1._hand.length", "==", 0],
    ["CHECK", "player2._hand.length", "==", 0],
    ["IF", "player1.points", ">", "player2.points", [
      ["SET", "state.winner", "player1.id"]
    ]],
    ["IF", "player1.points", "<", "player2.points", [
      ["SET", "state.winner", "player2.id"]
    ]],
    ["IF", "player1.points", "==", "player2.points", [
      ["SET", "state.winner", "tie"]
    ]]
  ]
}