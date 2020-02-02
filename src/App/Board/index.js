import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
	Container,
	Card as MuiCard,
	CardHeader as MuiCardHeader,
	CardContent as MuiCardContent,
	Typography,
	Grid,
	Avatar,
	Icon,
	Divider,
	Chip,
	Tooltip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, Alert } from "@blueprintjs/core";
import { emojiRequirements, explainCard } from "../Game/";

const useStyles = makeStyles(theme => ({
	root: {
		marginBottom: theme.spacing(5),
		backgroundColor: theme.palette.common.black,
		padding: theme.spacing(2)
	},
	card: {
		width: 55,
		height: 80,
		margin: theme.spacing(0.5),
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.palette.background.default
	},
	emojiContainer: {
		width: 80,
		height: 80
	},
	emoji: {
		fontSize: 36
	},
	hiddenCard: {
		backgroundColor: "#CCC"
	},
	divider: {
		margin: theme.spacing(2, 0),
		backgroundColor: theme.palette.common.white
	},
	playerZone: {
		margin: theme.spacing(2, 0)
	},
	myTurn: {
		backgroundColor: theme.palette.success.light
	}
}));

const DrawCardButton = ({ G, moves, isActive }) => (
	<Button
		text="Draw Card"
		onClick={() => {
			moves.drawCard();
		}}
		disabled={G.deck.length <= 0 || !isActive}
	/>
);

export default props => {
	const { G, ctx, moves, playerID } = props;
	const classes = useStyles(props);
	const [showGameResult, setShowGameResult] = useState(false);

	useEffect(() => {
		if (ctx.gameover) {
			setShowGameResult(true);
		}
	}, [ctx.gameover]);

	let gameResult = null;
	if (ctx.gameover) {
		gameResult =
			ctx.gameover.winner !== undefined
				? `Winner:
                    ${ctx.gameover.winner
											.map(({ pid }) => `Player ${pid + 1}`)
											.join(" & ")}`
				: "Draw!";
	}

	return (
		<Container classes={{ root: classes.root }}>
			<Grid container alignItems="center" spacing={2}>
				<Grid item xs={3}>
					<MuiCard>
						<MuiCardHeader title="Deck" />
						<MuiCardContent>
							<Grid container>
								<Grid item xs={6}>
									<Card className={classes.card}>
										<Typography>{G.deck.length}</Typography>
									</Card>
								</Grid>
								<Grid item xs={6}>
									<DrawCardButton {...props} />
								</Grid>
							</Grid>
						</MuiCardContent>
					</MuiCard>
				</Grid>
				<Grid item xs={5}>
					<MuiCard>
						<MuiCardHeader title="Need to Repair" />
						<MuiCardContent>
							<Grid container alignItems="center" spacing={2}>
								<Grid item xs={4}>
									<Avatar className={classes.emojiContainer}>
										<Typography className={classes.emoji}>
											{emojiRequirements[G.target.requirementIndex].type}
										</Typography>
									</Avatar>
								</Grid>
								<Grid item xs={8}>
									<Typography variant="subtitle2">Missing Parts</Typography>
									<Typography>{G.target.missingParts}</Typography>
								</Grid>
							</Grid>
						</MuiCardContent>
					</MuiCard>
				</Grid>
				<Grid item xs={4}>
					<MuiCard>
						<MuiCardHeader title="Next" />
						<MuiCardContent>
							<Grid container alignItems="center" spacing={2}>
								<Grid item xs={4}>
									<Avatar className={classes.emojiContainer}>
										<Typography className={classes.emoji}>
											{emojiRequirements[G.nextTarget].type}
										</Typography>
									</Avatar>
								</Grid>
								<Grid item xs={8}>
									<Typography>
										{emojiRequirements[G.nextTarget].requirements}
									</Typography>
								</Grid>
							</Grid>
						</MuiCardContent>
					</MuiCard>
				</Grid>
			</Grid>

			<Divider classes={{ root: classes.divider }}></Divider>

			<Grid container spacing={2}>
				{Object.keys(G.players).map(index => {
					const player = G.players[index];
					const isCurrentClientPlayer = playerID === index;
					return (
						<Grid item key={`player-${index}`} xs={6}>
							<MuiCard
								classes={{
									root: clsx(
										classes.playerZone,
										!gameResult &&
											isCurrentClientPlayer &&
											ctx.currentPlayer === index &&
											classes.myTurn
									)
								}}
							>
								<MuiCardHeader
									avatar={
										<Avatar>
											{ctx.gameover
												? ctx.gameover.winner &&
												  ctx.gameover.winner.filter(
														({ pid }) => pid === parseInt(index)
												  ).length > 0 && (
														<Typography>
															<span role="img" aria-label="">
																🏆
															</span>
														</Typography>
												  )
												: ctx.currentPlayer === index && (
														<Icon>play_arrow</Icon>
												  )}
										</Avatar>
									}
									title={`Player ${parseInt(index) + 1}` + (isCurrentClientPlayer ? ' (You)': '')}
									subheader={`Score: ${player.score}`}
									action={
										isCurrentClientPlayer &&
										ctx.currentPlayer === index && <DrawCardButton {...props} />
									}
								/>

								<MuiCardContent>
									<Grid container spacing={2}>
										<Grid item xs={8}>
											<Typography variant="subtitle2" gutterBottom>
												Hands <Chip label={player.hands.length} />
											</Typography>
											<Grid container>
												{player.hands.map((card, cardInHandIndex) => {
													const cardExplained = explainCard(card);
													return (
														<Grid
															item
															key={
																isCurrentClientPlayer
																	? card.id
																	: cardInHandIndex
															}
														>
															<Tooltip
																title={
																	isCurrentClientPlayer ? (
																		<>
																			<Typography variant="subtitle2">
																				{cardExplained.title}
																			</Typography>
																			{!!cardExplained.description && (
																				<Typography
																					variant="body2"
																					displayBlock
																				>
																					{cardExplained.description}
																				</Typography>
																			)}
																		</>
																	) : (
																		<Typography variant="subtitle2">
																			Opponent's Card
																		</Typography>
																	)
																}
															>
																<Card
																	className={clsx(
																		classes.card,
																		!isCurrentClientPlayer && classes.hiddenCard
																	)}
																	interactive={
																		!gameResult &&
																		ctx.currentPlayer === index &&
																		isCurrentClientPlayer
																	}
																	onClick={() => {
																		if (ctx.currentPlayer === index) {
																			moves.playCard(cardInHandIndex);
																		}
																	}}
																>
																	<Typography>
																		{isCurrentClientPlayer ? card.value : "❔"}
																	</Typography>
																</Card>
															</Tooltip>
														</Grid>
													);
												})}
											</Grid>
										</Grid>
										<Grid item xs={4}>
											<Typography variant="subtitle2">Repair Zone</Typography>
											<MuiCard>
												<MuiCardContent>
													{player.repairZone.length === 0 ? (
														<Typography variant="caption" color="secondary">
															No Part Here :-(
														</Typography>
													) : (
														<Grid container>
															{player.repairZone.map(card => {
																return (
																	<Grid item key={card.id}>
																		<Card className={classes.card}>
																			<Typography>{card.value}</Typography>
																		</Card>
																	</Grid>
																);
															})}
														</Grid>
													)}
												</MuiCardContent>
											</MuiCard>
										</Grid>
									</Grid>
								</MuiCardContent>
							</MuiCard>
						</Grid>
					);
				})}
			</Grid>
			{gameResult && (
				<>
					<Alert
						isOpen={showGameResult}
						onClose={() => {
							setShowGameResult(false);
						}}
					>
						<Typography>{gameResult}</Typography>
					</Alert>
					<Grid container alignItems="center" spacing={2}>
						<Grid item>
							<Button
								text="Game Result"
								onClick={() => {
									setShowGameResult(true);
								}}
							/>
						</Grid>
						<Grid>
							<Typography color="secondary">
								Game is over. Please exit game. Thanks.
							</Typography>
						</Grid>
					</Grid>
				</>
			)}
		</Container>
	);
};
