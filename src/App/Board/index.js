import React from "react";
import {
	Container,
	Card as MuiCard,
	CardHeader,
	CardContent,
	CardActions,
	Typography,
	Grid,
	Avatar,
	Icon,
	Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card } from "@blueprintjs/core";
import { emojiRequirements } from "../Game/";

const useStyles = makeStyles(theme => ({
	card: {
		width: 55,
		margin: theme.spacing(0.5),
		textAlign: "center",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	divider: {
		margin: theme.spacing(2, 0)
	},
	playerZone: {
		margin: theme.spacing(2, 0)
	}
}));

export default props => {
	const { G, ctx, moves, events } = props;
	const classes = useStyles(props);
	return (
		<Container>
			<Grid container alignItems="center" spacing={2}>
				<Grid item xs={5}>
					<MuiCard>
						<CardHeader title="Deck" />
						<CardContent>
							<Grid container>
								<Grid item xs={6}>
									<Card className={classes.card}>
										<Typography>{G.deck.length}</Typography>
									</Card>
								</Grid>
								<Grid item xs={6}>
									<Button
										text="Draw Card"
										onClick={() => {
											moves.drawCard();
											events.endTurn();
										}}
										disabled={G.deck.length <= 0}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</MuiCard>
				</Grid>
				<Grid item xs={5}>
					<MuiCard>
						<CardHeader title="Repair" />
						<CardContent>
							<Grid container alignItems="center" spacing={2}>
								<Grid item>
									<Card className={classes.card}>
										<Typography>{emojiRequirements[G.target].type}</Typography>
									</Card>
								</Grid>
								<Grid item>
									<Typography>
										{emojiRequirements[G.target].requirements}
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</MuiCard>
				</Grid>
				<Grid item xs={2}>
					<MuiCard>
						<CardHeader title="Next" />
						<CardContent>
							<Card className={classes.card}>
								<Typography>{emojiRequirements[G.nextTarget].type}</Typography>
							</Card>
						</CardContent>
					</MuiCard>
				</Grid>
			</Grid>

			<Divider classes={{ root: classes.divider }}></Divider>

			{Object.keys(G.players).map(index => {
				const player = G.players[index];
				return (
					<MuiCard
						key={`player-${index}`}
						classes={{ root: classes.playerZone }}
					>
						<CardHeader
							avatar={
								<Avatar>
									{ctx.currentPlayer === index && <Icon>arrow_right</Icon>}
								</Avatar>
							}
							title={`Player ${parseInt(index) + 1}`}
						/>
						<CardContent>
							<Typography variant="subtitle2">Hands</Typography>
							<Grid container>
								{player.hands.map(card => {
									return (
										<Grid item key={card.id}>
											<Card className={classes.card}>
												<Typography>{card.value}</Typography>
											</Card>
										</Grid>
									);
								})}
							</Grid>
						</CardContent>
					</MuiCard>
				);
			})}
		</Container>
	);
};
