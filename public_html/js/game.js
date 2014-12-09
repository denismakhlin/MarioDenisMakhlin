
/* Game namespace */
var game = {
/*-----------------------------------------------------------------------------
 * Below is basic pre made code that came with the melon.js file
 *----------------------------------------------------------------------------- 
 */
	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, 'auto')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

/*-----------------------------------------------------------------------------
 * Below is the code that registers my character, and any object layers
 * I made in Tiled into my game, and allows them to appear and work.
 *----------------------------------------------------------------------------- 
 */

	"loaded" : function () {
                me.pool.register("mario", game.PlayerEntity, true);
                me.pool.register("BadGuy", game.BadGuy);
                me.pool.register("mushroom", game.Mushroom);
                me.pool.register("levelTrigger", game.LevelTrigger);
                
/*-----------------------------------------------------------------------------
 * Below is the code that loads up the title screen and the game screen.
 *----------------------------------------------------------------------------- 
 */            
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());

/*-----------------------------------------------------------------------------
 * Below is the code that is the startup title-screen
 *----------------------------------------------------------------------------- 
 */
		me.state.change(me.state.MENU   );
	}
};
