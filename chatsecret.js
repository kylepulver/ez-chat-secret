console.log("EZ Chat Secret | Loaded");

Hooks.on("renderChatMessage", async (message, html, data) => {
    if (!message.blind)
        return;

    if (!message.isRoll)
        return;

    console.log(message);

    
    const renderRolls = async (rolls) => {
        let html = "";
        for ( const roll of rolls ) {
            roll.options.showBreakdown = true;
            html += await roll.render();
        }
        return html;
      }

    const source = message._source;
    // const flavor = source.flavor.split(`data-visibility="gm"`).join("");
    const flavor = source.flavor;

    let content = await renderRolls(message.rolls)
    content = $(content);

    html.find(`.flavor-text`).html(flavor);
    
    if (!game.user.isGM) {
        content.find('.dice-total').html(`<span class="ez-chat-secret-text">??</span>`)
        content.find('.part-total').html(`<span class="ez-chat-secret-text">?</span>`)
        content.find('.roll.die.d20').html(`<span class="ez-chat-secret-text">?</span>`)
        content.find('.roll.die.d20.min').removeClass("min")
        content.find('.roll.die.d20.max').removeClass("max")

        html.find('.rk').replaceWith(`<span>Recall Knowledge</span>`)
    }

    html.find(`.message-content`).html(content);
    html.find(`.action`).prepend(`<span class="ez-chat-secret-text">Secret</span> `);
    html.find('.message-sender').html(message.alias)
})