/**
 * Utilities
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


/**
 * Parse a Discord invite URL to retrieve the invite code
 *
 * @since       1.0.0
 * @param       {string} invite The invite URL
 * @return      {string|bool} code The parsed code, or false if invalid
 */
function parseInviteCode(invite) {
    let inviteRegex = /https?:\/\/discord\.gg\/([A-Za-z0-9-]+)\/?/;
    let code        = inviteRegex.exec(invite);

    if(code) {
        code = code[1];
    }

    return code;
}


/**
 * Get the server name from an invite
 *
 * @since       1.0.0
 * @param       {string} invite The invite code
 * @return      {string} name The server name
 */
function getServerName(invite) {
    let config    = require(GLOBAL.k9path + '/lib/core/config.js');
    let Discordie = require('discordie');
    let server_id = config.get('last_server_id');
    let server    = GLOBAL.bot.Guilds.get(server_id);

    if(server.name) {
        return server.name;
    } else {
        return null;
    }
}

module.exports = {
    parseInviteCode: parseInviteCode,
    getServerName:   getServerName
};