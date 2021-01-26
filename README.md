# autoreactbot
A Discord bot that does nothing but react.

It waits for specific triggers and sends a message. Allows for multiple responses that get choosen form at random.

# Commands:

To add a trigger: 
$ar Trigger; Response; (mode)

Trigger and response are mandatory, mode is optional and can be set to "full" if the trigger should fire only if the message matches said trigger entirely or to "contains" if the bot should react if a trigger is somewhere within that message. Defaults to "full". Note that the quotation marks must not be included.

To remove a trigger: 

Triggers cannot be releted entirely, yet, but responses can. 

$rr ID

ID must be an integer. Else nothing happens. To find out the ID, you can search for triggers and their corresponding responses by doing

$lr [search text]

It must not be an exact match, this will return every response to every trigger that contains the text you entered.
The search results will show you the ID with which to delete a response, the trigger the response belongs to and the response itself. Triggers are automatically deleted if no response is associated with them
