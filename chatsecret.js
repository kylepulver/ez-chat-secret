console.log("EZ Chat Secret | Loaded");

Hooks.on("renderChatMessage", async (message, html, data) => {
    if (!message.isRoll)
        return;

    // Completely hide private rolls
    if ((message.whisper || []).length == 1 && !message.blind) {
        if (message.isAuthor || message.whisper.includes(game.user.id)) {
            html.find(`.action`).prepend(`<span class="ez-chat-secret-text">Whisper</span> `);

            html.find('.dice-total').each(function(index, element) {
                const dicetotal = $(this).text();
                $(this).html(`<span class="ez-chat-secret-text">${dicetotal}</span>`)
            })
            html.find('.part-total').each(function(index, element) {
                const parttotal = $(this).text();
                $(this).html(`<span class="ez-chat-secret-text">${parttotal}</span>`)
            })
            html.find('.roll.die.d20').each(function(index, element) {
                const dieroll = $(this).text();
                $(this).html(`<span class="ez-chat-secret-text">${dieroll}</span>`)
            })

          
            return;
        }
        else {
            html.css("overflow", "hidden");
            html.css("height", "0");
            html.css("padding", "0");
            html.css("margin", "0");
            html.css("border", "0");
            return;
        }
       
    }

    if (!message.blind)
        return;

    // Force showbreakdown to be true
    const renderRolls = async (rolls) => {
        let r = "";
        for ( const roll of rolls ) {
            roll.options.showBreakdown = true;
            r += await roll.render();
        }
        return r;
      }

    const source = message._source;

    let content = await renderRolls(message.rolls)
    content = $(content);

    // need to check for each dice-total because of rerolls
    
    if (!game.user.isGM) {
        content.find('.dice-total').html(`<span class="ez-chat-secret-text">??</span>`)
        content.find('.part-total').html(`<span class="ez-chat-secret-text">?</span>`)
        content.find('.roll.die.d20').html(`<span class="ez-chat-secret-text">?</span>`)
        content.find('.roll.die.d20.min').removeClass("min")
        content.find('.roll.die.d20.max').removeClass("max")
    }
    else {
        content.find('.dice-total').each(function(index, element) {
            const dicetotal = $(this).text();
            $(this).html(`<span class="ez-chat-secret-text">${dicetotal}</span>`)
        })
        content.find('.part-total').each(function(index, element) {
            const parttotal = $(this).text();
            $(this).html(`<span class="ez-chat-secret-text">${parttotal}</span>`)
        })
        content.find('.roll.die.d20').each(function(index, element) {
            const dieroll = $(this).text();
            $(this).html(`<span class="ez-chat-secret-text">${dieroll}</span>`)
        })
    }

    html.find(`.message-content`).html(content);
    html.find(`.message-content`).prepend(`<div class="flavor-text">${source.flavor}</div>`);
    if (!game.user.isGM) {
        html.find('.rk .success').replaceWith(`<span class="ez-chat-secret-text">??</span>`)
    }

    html.find(`.action`).prepend(`<span class="ez-chat-secret-text">Secret</span> `);
    html.find('.message-sender').html(message.alias)

    // Remove class that hides the character name from some Dorako thing
    html.find('.message-sender.dorako-display-none').removeClass('dorako-display-none')
})