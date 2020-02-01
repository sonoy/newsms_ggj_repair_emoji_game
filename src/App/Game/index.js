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
	...Array(1).fill("👅")
];

const drawCard = (G, ctx) => {
    const drawnCard = G.deck.shift();
    G.players[ctx.currentPlayer].hands.push(drawnCard);
}

export default {
	setup: ctx => {
		const totalPlayer = ctx.numPlayers;
		let partCards = [];

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
			});

		return {
			deck: ctx.random.Shuffle([...partCards]),
			players: Array(totalPlayer)
				.fill({ hands: [] })
				.map(player => ({
					...player
				})),
			target: ctx.random.Die(emojiRequirements.length) - 1,
			nextTarget: ctx.random.Die(emojiRequirements.length) - 1
		};
	},

	moves: {
		drawCard: (G, ctx) => {
			const drawnCard = G.deck.shift();
			G.players[ctx.currentPlayer].hands.push(drawnCard);
		}
	}
};
