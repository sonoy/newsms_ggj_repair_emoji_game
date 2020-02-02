export const emojiRequirements = [
	{ type: "😎", requirements: ["💀", "💛", "👄", "🕶"] },
	{ type: "😀", requirements: ["💀", "💛", "👄", "👀", "🦷"] },
	{ type: "🤡", requirements: ["💀", "💛", "👄", "👀", "💄", "👻"] },
	{ type: "🥳", requirements: ["💀", "💛", "👄", "👀", "🎉"] },
	{ type: "😶", requirements: ["💀", "💛", "👀"] },
	{ type: "🤑", requirements: ["💀", "💛", "👅", "💰", "💰", "💰"] },
	{ type: "😴", requirements: ["💀", "💛", "👀", "👄", "💤"] },
	{ type: "😂", requirements: ["💀", "💛", "👀", "👄", "💧", "💧"] },
	{ type: "😥", requirements: ["💀", "💛", "👀", "👄", "💧"] },
	{ type: "🤓", requirements: ["💀", "💛", "👀", "👄", "🕶"] }
];

const allPartCards = [
	...Array(10).fill("💀"),
	...Array(10).fill("💛"),
	...Array(8).fill("👄"),
	...Array(2).fill("🕶"),
	...Array(8).fill("👀"),
	...Array(1).fill("🦷"),
	...Array(3).fill("💰"),
	...Array(1).fill("💄"),
	...Array(1).fill("👻"),
	...Array(1).fill("🎉"),
	...Array(3).fill("💧"),
	...Array(1).fill("💤"),
	...Array(1).fill("👅"),
	...Array(5).fill("✳️")
];

const allEffectCards = [...Array(5).fill("📦"), ...Array(5).fill("🧰")];

const INIT_CARD_TOTAL = 5;

const prepareRepairTarget = (ctx, requirementIndex) => {
	const repairTarget = {
		requirementIndex
	};
	const missingPartCount = ctx.random.Die(
		emojiRequirements[repairTarget.requirementIndex].requirements.length
	);
	const orderForMissingPart = ctx.random.Shuffle(
		emojiRequirements[repairTarget.requirementIndex].requirements
	);
	repairTarget.missingParts =
		missingPartCount === orderForMissingPart.length
			? orderForMissingPart
			: orderForMissingPart.splice(missingPartCount);

	return repairTarget;
};

export default {
	name: "Repair-Emoji",
	minPlayers: 2,
	maxPlayers: 4,

	setup: ctx => {
		const totalPlayer = ctx.numPlayers;

		/**
		 * Generate Part Cards According to Number of Players
		 */
		let partCards = [];
		let effectCards = [];
		Array(totalPlayer)
			.fill(null)
			.forEach((x, i) => {
				partCards = [
					...partCards,
					...allPartCards.map((part, index) => ({
						type: "part",
						value: part,
						id: `part-${i * allPartCards.length + index}`
					}))
				];
				effectCards = [
					...effectCards,
					...allEffectCards.map((effect, index) => ({
						type: "effect",
						value: effect,
						id: `effect-${i * allEffectCards.length + index}`
					}))
				];
			});

		const deckCards = ctx.random.Shuffle([...partCards, ...effectCards]);

		/**
		 * Initialize Players and Their Hands
		 */
		const players = Array(totalPlayer)
			.fill(null)
			.map((x, index) => ({
				pid: index,
				hands: [],
				repairZone: [],
				score: 0
			}));
		players.forEach(p => {
			Array(INIT_CARD_TOTAL)
				.fill(null)
				.forEach(() => {
					const drawnCard = deckCards.shift();
					p.hands.push(drawnCard);
				});
		});

		return {
			deck: deckCards,
			players,
			target: prepareRepairTarget(
				ctx,
				ctx.random.Die(emojiRequirements.length) - 1
			),
			nextTarget: ctx.random.Die(emojiRequirements.length) - 1
		};
	},

	events: {
		endGame: false
	},

	moves: {
		drawCard: (G, ctx) => {
			const drawnCard = G.deck.shift();
			G.players[ctx.currentPlayer].hands.push(drawnCard);
			ctx.events.endTurn();
		},
		playCard: (G, ctx, cardInHandIndex) => {
			const playedCard = G.players[ctx.currentPlayer].hands[cardInHandIndex];

			switch (playedCard.type) {
				case "part":
					if (playedCard.value !== "✳️") {
						if (!G.target.missingParts.includes(playedCard.value)) {
							return;
						}
						if (
							G.target.missingParts.filter(part => part === playedCard.value)
								.length ===
							G.players[ctx.currentPlayer].repairZone.filter(
								({ value }) => value === playedCard.value
							).length
						) {
							return;
						}
					}
					G.players[ctx.currentPlayer].repairZone.push(playedCard);
					break;
				case "effect":
					switch (playedCard.value) {
						case "📦":
							Array(
								G.target.missingParts.length -
									G.players[ctx.currentPlayer].repairZone.length
							)
								.fill("✳️")
								.forEach(part => {
									G.players[ctx.currentPlayer].repairZone.push(part);
								});
							break;
						case "🧰":
							Array(4)
								.fill(null)
								.forEach(() => {
									if (G.deck.length > 0) {
										const drawnCard = G.deck.shift();
										G.players[ctx.currentPlayer].hands.push(drawnCard);
									}
								});
							break;
						default:
							break;
					}
					break;
				default:
					break;
			}

			G.players[ctx.currentPlayer].hands = G.players[
				ctx.currentPlayer
			].hands.filter((card, index) => index !== cardInHandIndex);

			if (
				G.target.missingParts.length ===
				G.players[ctx.currentPlayer].repairZone.length
			) {
				/**
				 * The player who has repaired the emoji can get total of original requirements for the score;
				 * other player can get the total of parts in repair zone for the score
				 */
				G.players.forEach((player, id) => {
					const { repairZone } = player;
					if (parseInt(ctx.currentPlayer) === id) {
						player.score +=
							emojiRequirements[G.target.requirementIndex].requirements.length;
					} else {
						player.score += repairZone.length;
					}
				});

				G.target = prepareRepairTarget(ctx, G.nextTarget);
				G.nextTarget = ctx.random.Die(emojiRequirements.length) - 1;
				G.players.forEach(player => {
					player.repairZone = [];
				});
			}

			ctx.events.endTurn();
		}
	},

	playerView: (G, ctx, playerID) => {
		const { deck, players, target, nextTarget } = G;
		return {
			deck: deck.map(() => ""),
			players: players.map(({ score, hands, repairZone, pid }) => {
				if (pid === parseInt(playerID)) {
					return {
						...players[pid]
					};
				} else {
					return {
						pid,
						hands: hands.map(() => ({})),
						score,
						repairZone
					};
				}
			}),
			target,
			nextTarget
		};
	},

	endIf: (G, ctx) => {
		if (G.deck.length === 0) {
			const maxScore = Math.max(...G.players.map(({ score }) => score));
			const maxScorePlayers = G.players.filter(
				({ score }) => score === maxScore
			);
			if (maxScorePlayers.length === ctx.numPlayers) {
				return {
					draw: true
				};
			} else {
				return {
					winner: maxScorePlayers
				};
			}
		}
	}
};

export const explainCard = card => {
	switch (card.type) {
		case "effect":
			switch (card.value) {
				case "📦":
					return {
						title: "Effect Card - New Emoji Received",
						description: "Effect: Repair current emoji immediately"
					};
				case "🧰":
					return {
						title: "Effect Card - Tool Box",
						description: "Effect: Draw 4 cards"
					};
				default:
					return {};
			}
		case "part":
			switch (card.value) {
				case "✳️":
					return { title: "Wildcard Part Card" };
				default:
					return { title: `Part Card - ${card.value}` };
			}
		default:
			return {};
	}
};
