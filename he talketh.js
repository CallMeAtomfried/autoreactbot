//Getting the stuff
const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
console.log("Starting up!");

//Global variables
//Botclient
const client = new Discord.Client();
//Responses
var autoreacts = JSON.parse(fs.readFileSync(`${__dirname}/config/autoreacts.json`).toString());


//log in
client.login(config.token);

client.on("message", (message) => {
	
	//Add responses
	if(message.content.startsWith(`${config.prefix}ar`)){
		addresponse(message.content.substring(3+config.prefix.length), message);
		
	//Remove responses	
	} else if(message.content.startsWith(`${config.prefix}rr`)){
		removeresponse(message.content.substring(3+config.prefix.length), message);
		
	//List responses
	} else if(message.content.startsWith(`${config.prefix}lr`)){
		listresponses(message.content.substring(3+config.prefix.length), message);
		
	//here be the replying part
	} else {
		//Only if entire message is the thing
		if(autoreacts.full[message.content]!=undefined){
			message.channel.send(autoreacts.full[message.content][randomProperty(autoreacts.full[message.content])]);
		} else {
			//If the thing is somewher in the message
			for(x in autoreacts.part){
				if(message.content.includes(x)) {
					message.channel.send(autoreacts.part[x][randomProperty(autoreacts.part[x])]);
				}
					
			}
		}
	}
	
	
	
	
		
		
	
});

//not important, allows for several responses to the same trigger, chosen at random
function randomProperty(object) {
  var keys = Object.keys(object);
  return keys[Math.floor(keys.length * Math.random())];
}

//$addresponse string; response; mode
//where mode is either "full" or "contains". Invalid values or no value for mode default to "full"


function addresponse(message, msg){
	var mode = "";
	
	//get the arguments
	args = message.split(";");
	//check if they exist
	if(args[0]!=undefined&&args[1]!=undefined){
		//ugly but works
		if(args[2]=="full"||args[2]==undefined) { mode = "full"}
		else if(args[2]=="contains") { mode = "part"}
		else { mode = "full"};
		
		//i refuse to explain this
		autoreacts.maxID++;
		
		//This just adds the trigger and the response in the file and saves it so it doesnt disappear when the bot goes down
		if(autoreacts[mode][args[0]]==undefined)autoreacts[mode][args[0]]={};
			autoreacts[mode][args[0]][autoreacts.maxID]=args[1];
			msg.channel.send(`Added Autoresponse "${args[1]}" to trigger "${args[0]}" with ID ${autoreacts.maxID}`);
			fs.writeFile(`${__dirname}/config/autoreacts.json` , JSON.stringify(autoreacts), function(){});
	} else {
		//telling poeple what to do is my favourite
		msg.channel.send(`Correct use: ${config.prefix}ar Trigger; Response; *Mode (Optional, either "full" or "contains", defaults to "full".`)
	}
}

function removeresponse(message, msg){
	//so nothing gets accidentally fucked
	var id = -1;
	//is integer? its stupid but instanceof and inInteger did not work
	if(parseInt(message).toString()!="NaN"){
		id=parseInt(message);
		
		//loopity loop
		for(x in autoreacts.full){
			console.log(autoreacts.full[x][id]);
			if(autoreacts.full[x][id]!=undefined){
				delete autoreacts.full[x][id];
				if(JSON.stringify(autoreacts.full[x])=="{}") delete autoreacts.full[x];
			}
		}
		for(x in autoreacts.part){
			if(autoreacts.part[x][id]!=undefined){
				delete autoreacts.part[x][id];
				if(JSON.stringify(autoreacts.part[x])=="{}") delete autoreacts.part[x];
			
			}
		}
		
		//provide the good news and save
		msg.channel.send(`Successfully deleted autoresponse (ID: ${id})`)
		fs.writeFile(`${__dirname}/config/autoreacts.json` , JSON.stringify(autoreacts), function(){});
	} else {
		//tragedy 
		msg.channel.send(`Correct use: ${config.prefix}rr ID (integer)`);
	}
	
	
	
}

function listresponses(term, msg){
	
	var output= "";
	
	for(x in autoreacts.part){
		if(x.includes(term)){
			var keys = Object.keys(autoreacts.part[x]);
			for(k in keys){
				console.log(x);
				output += `ID: ${keys[k]}, Trigger: ${x}, Response: ${autoreacts.part[x][keys[k]]}\n`
			}
		}
		
	}
	for(x in autoreacts.full){
		if(x.includes(term)){
			var keys = Object.keys(autoreacts.full[x]);
			for(k in keys){
				console.log(x);
				output += `ID: ${keys[k]}, Trigger: ${x}, Response: ${autoreacts.full[x][keys[k]]}\n`
			}
		}
		
	}
	
	msg.channel.send(output||"No responses found");
	
}

