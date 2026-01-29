import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CardGroup, OddsCalculator } from "poker-odds-calculator";
import { DECK } from "./deck.js";
import "./index.css";

let playerCount = 2;
let activeFieldForPlayerHand = null;
let activeCommunityCard = null;
let cardsInUse = [];

const SUIT_COLORS = {
    clubs: "#1dd1a1",
    diamonds: "#54a0ff",
    hearts: "#ee5253",
    spades: "#8395a7",
};
const SELECTED_COMMUNITY_CARD = "#A9A9A9";

//document.addEventListener("click", checkCards);
//document.addEventListener("change", checkCards);
document.addEventListener("click", checkClick);

// If a community card is marked and the user clicks somewhere else, reset the background color
// for that card, so it is unmarked.
function checkClick(e) {
    const card_classes = ["c", "d", "h", "s"];
    if (
        activeCommunityCard &&
        e.target.className != "community_card" &&
        !card_classes.includes(e.target.className)
    ) {
        document.getElementById(activeCommunityCard).style.backgroundColor = "";
        activeCommunityCard = null;
    }
}

// Initially my plan was to allow the user to also type in their cards in the text fields, but
// it turns out that it's very combersome to make sure that the user types in correct cards
// as well as cards that haven't already been used.
// This function won't be necessary, as long as we don't allow the user to be able to type in
// their hands manually in the text fields. Maybe we won't allow that for simplicity's sake?
/*function checkCards() {
    // Kolla så att cardsInUse stämmer överens med hur det ser ut på själva sidan!!!!
    // Uppdatera sedan, så att kort som tagits bort kan användas igen osv;
    const handsInTheUI = [];
    let community_cards = document.getElementsByClassName("community_card");
    let player_hands = document.getElementsByClassName("player_hand");
    //log(player_hands);

    // Add all the cards that are in play on the board
    for (let i = 0; i < community_cards.length; i++) {
        if (community_cards[i].innerHTML != "?") {
            //log(community_cards[i].innerHTML);
            handsInTheUI.push(community_cards[i].innerHTML);
        }
    }

    // Add all the cards that are in use by the players to handsInTheUI
    for (let i = 0; i < player_hands.length; i++) {
        if (player_hands[i].value) {
            if (player_hands[i].value.length > 2) {
                const first_card =
                    player_hands[i].value[0] + player_hands[i].value[1];
                const second_card =
                    player_hands[i].value[2] + player_hands[i].value[3];
                handsInTheUI.push(first_card);
                handsInTheUI.push(second_card);
            } else {
                handsInTheUI.push(player_hands[i].value);
            }
        }
    }

    //log(`handsInTheUI = ${handsInTheUI}\n`);
}*/

// TODO: Make sure that we regex and check so that the user enter a card that isn't in use. Also
// make sure that the user types input in the correct format. At least for now, we won't
// implement this function.
/*function textFieldOnKeyDown(e) {
    const pattern = /([AKQJ]|[2-9])(s|h|d|c)/;
    const result = e.target.value.match(pattern);
    //alert(result);
}*/

// Make a table of all cards. Give the <td> element class names "s", "h", "d" and "c"
// representing spades, hearts, diamonds, clubs.
function AllCards() {
    const cards = Object.keys(DECK).reverse();
    let card_lists = [];
    for (let i = 0; i < cards.length; i += 4) {
        card_lists.push(cards.slice(i, i + 4));
    }
    return (
        <>
            <table id="all_cards">
                {card_lists.map((row) => {
                    return (
                        <tr>
                            {row.map((hand) => {
                                {
                                    return (
                                        <td
                                            className={hand[1]}
                                            onClick={clickCard}
                                        >
                                            {hand}
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                    );
                })}
            </table>
        </>
    );
}

// Function for when the user clicks on a card from the table to the left
function clickCard(e) {
    // If a input field is active and if the card is not already in use and if the player doesn't
    // already have two cards, add that card to the input field.
    if (activeFieldForPlayerHand) {
        const hand = e.target.innerHTML;
        let text_field = document.getElementById(activeFieldForPlayerHand);
        if (text_field.value.length < 4 && !isInUse(hand)) {
            text_field.value += hand;
            cardsInUse.push(hand);
        }
    }

    // If a community card is active, add the card to the selected community card.
    if (activeCommunityCard) {
        const hand = e.target.innerHTML;
        const communityCardSelected =
            document.getElementById(activeCommunityCard);
        if (!isInUse(hand)) {
            communityCardSelected.innerHTML = hand;
            cardsInUse.push(hand);

            // Add color to the community card for the different suits
            if (hand[1] == "c") {
                communityCardSelected.style.color = SUIT_COLORS.clubs;
            } else if (hand[1] == "d") {
                communityCardSelected.style.color = SUIT_COLORS.diamonds;
            } else if (hand[1] == "h") {
                communityCardSelected.style.color = SUIT_COLORS.hearts;
            } else if (hand[1] == "s") {
                communityCardSelected.style.color = SUIT_COLORS.spades;
            }

            // Move focus to the next community card
            let id = Number(communityCardSelected.id[2]);
            if (id < 5) {
                id++;
                document.getElementById(
                    activeCommunityCard,
                ).style.backgroundColor = "";
                activeCommunityCard = document.getElementById("cc" + id).id;
                document.getElementById(
                    activeCommunityCard,
                ).style.backgroundColor = SELECTED_COMMUNITY_CARD;
            }
        }
    }
}

function isInUse(card) {
    for (let i = 0; i < cardsInUse.length; i++) {
        if (card == cardsInUse[i]) {
            return true;
        }
    }
    return false;
}

// Generates the community cards
function CommunityCards() {
    function clickCommunityCard(e) {
        if (activeCommunityCard) {
            document.getElementById(activeCommunityCard).style.backgroundColor =
                "";
        }
        activeCommunityCard = e.target.id;
        document.getElementById(activeCommunityCard).style.backgroundColor =
            SELECTED_COMMUNITY_CARD;
        activeFieldForPlayerHand = null;
    }

    return (
        <>
            <h2>Community cards</h2>
            <table id="board">
                <tr>
                    <td
                        id="cc1"
                        class="community_card"
                        onClick={clickCommunityCard}
                    >
                        ?
                    </td>
                    <td
                        id="cc2"
                        class="community_card"
                        onClick={clickCommunityCard}
                    >
                        ?
                    </td>
                    <td
                        id="cc3"
                        class="community_card"
                        onClick={clickCommunityCard}
                    >
                        ?
                    </td>
                    <td
                        id="cc4"
                        class="community_card"
                        onClick={clickCommunityCard}
                    >
                        ?
                    </td>
                    <td
                        id="cc5"
                        class="community_card"
                        onClick={clickCommunityCard}
                    >
                        ?
                    </td>
                </tr>
            </table>
        </>
    );
}

function textFieldOnFocus(e) {
    activeFieldForPlayerHand = e.target.id;
    activeCommunityCard = null;
}

// Generate the players' text fields: which hand they have and how much equity that hand has
function Players() {
    return (
        <>
            <table id="players" width="100%">
                <thead>
                    <tr>
                        <th id="player_column"></th>
                        <th id="hand_column">Hand</th>
                        <th id="equity_columnn">Equity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="player1" class="player">
                        <td>
                            <label for="player1">Player 1:</label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="hand1"
                                id="hand1"
                                onFocus={textFieldOnFocus}
                                className="player_hand"
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="equity1"
                                id="equity1"
                                className="equity"
                                readOnly
                            ></input>
                        </td>
                    </tr>
                    <tr id="player2" class="player">
                        <td>
                            <label for="player2">Player 2:</label>
                        </td>
                        <td>
                            <input
                                type="text"
                                name="hand2"
                                id="hand2"
                                onFocus={textFieldOnFocus}
                                className="player_hand"
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="equity2"
                                id="equity2"
                                className="equity"
                                readOnly
                            ></input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

// Render the buttons for adding a new player, calculating the equities and clearing all inputs.
function Buttons() {
    function add_player() {
        if (playerCount <= 9) {
            playerCount++;
            const tableOfPlayers = document.getElementById("players");
            let row = tableOfPlayers.insertRow(playerCount);
            row.className = "player";
            row.id = "player" + playerCount;
            row.insertCell(0).innerHTML =
                `<label for="player${playerCount}">Player ${playerCount}:</label>`;
            row.insertCell(1).innerHTML =
                `<input type="text" name="hand${playerCount}" id="hand${playerCount}" class="player_hand" readonly />`;
            row.insertCell(2).innerHTML =
                `<input type="text" name="equity${playerCount}" id="equity${playerCount}" class="equity" readonly />`;
            document
                .getElementById("hand" + playerCount)
                .addEventListener("focus", textFieldOnFocus);
        }
    }

    function calculate() {
        // First make sure that all input is correct
        const handInputs = document.getElementsByClassName("player_hand");
        const handsInStr = [];
        for (let i = 0; i < handInputs.length; i++) {
            if (handInputs[i].value.length < 4) {
                //handInputs[i].style.backgroundColor = "red";
                alert("You must specify two cards for every player!");
                return null;
            }
            handsInStr.push(handInputs[i].value);
        }

        /*if (handsInStr.length <= 1) {
        alert("You must specify at least two hands with two cards!");
        return null;
    }*/

        // Convert the hands into object CardGroup from poker-odds-calculartor
        const hands = [];
        for (let i = 0; i < handsInStr.length; i++) {
            hands.push(CardGroup.fromString(handsInStr[i]));
        }

        let board_str = "";
        let community_cards = document.getElementsByClassName("community_card");
        for (let i = 0; i < community_cards.length; i++) {
            if (community_cards[i].innerText != "?") {
                board_str += community_cards[i].innerText;
            }
        }
        if (board_str.length != 0 && board_str.length < 6) {
            alert("Must specify at least three community cards or zero.");
            return null;
        }

        if (board_str.length >= 6) {
            // Make sure the community cards are specified in the correct order
            if (
                community_cards[0].innerText == "?" ||
                community_cards[1].innerText == "?" ||
                community_cards[2].innerText == "?"
            ) {
                alert("The community cards aren't in the correct order.");
                return null;
            }

            const board = CardGroup.fromString(board_str);
            const result = OddsCalculator.calculate(hands, board);
            for (let i = 0; i < result.equities.length; i++) {
                document.getElementById("equity" + (i + 1)).value =
                    result.equities[i].toString() + "%";
            }

            // TODO: Give the input field with the highest equity a green color?
            /*const equities = document.getElementsByClassName("equity");
        let highest_score = 0;
        const highest_id = 0;
        for (let i = 0; i < result.equities.length; i++) {
            if (result.equities[i].getEquity() > highest_score) {
                highest_score = result.equities[i].getEquity();
                highest_id = i;
            }
        }
        alert("Störst equity har " + highest_id);*/
        }
    }

    function clear() {
        // Remove all players except for two
        if (playerCount > 2) {
            let inputs = document.getElementsByClassName("player");
            //log(inputs.length);
            for (let i = inputs.length - 1; i >= 2; i--) {
                inputs[i].remove();
            }
            playerCount = 2;
        }
        document.getElementById("hand1").value = "";
        document.getElementById("hand1").style.backgroundColor = "";
        document.getElementById("hand2").value = "";
        document.getElementById("hand2").style.backgroundColor = "";
        document.getElementById("equity1").value = "";
        document.getElementById("equity2").value = "";

        // Reset community cards
        const cc = document.getElementsByClassName("community_card");
        for (let i = 0; i < cc.length; i++) {
            cc[i].innerHTML = "?";
            cc[i].style.color = "#000000";
            cc[i].style.backgroundColor = "";
        }
        cardsInUse = [];

        activeCommunityCard = null;
        activeFieldForPlayerHand = null;
    }

    return (
        <>
            <div id="buttons">
                <button type="button" onClick={add_player}>
                    Add player
                </button>
                <button type="submit" onClick={calculate}>
                    Calculate
                </button>
                <button type="reset" onClick={clear}>
                    Clear
                </button>
            </div>
        </>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <div id="left_column">
            <AllCards />
        </div>
        <div id="right_column">
            <CommunityCards />
            <Players />
            <Buttons />
        </div>
    </StrictMode>,
);
