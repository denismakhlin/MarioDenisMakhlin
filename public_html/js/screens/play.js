game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
/*-----------------------------------------------------------------------------
 * Below is the code that lets me change what level I want to appear first
 *----------------------------------------------------------------------------- 
 */               
                me.levelDirector.loadLevel("DenisLevel06");
                
                this.resetPlayer(0, 400);
/*-----------------------------------------------------------------------------
 * Below is the code that inputs any keys on the keyboard to be the button I
 * use to make tha actions I wrote code on previosly.
 *----------------------------------------------------------------------------- 
 */                
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindKey(me.input.KEY.LEFT, 'left');
                me.input.bindKey(me.input.KEY.UP, 'jump');
                me.input.bindKey(me.input.KEY.SPACE, 'jump');
                me.input.bindKey(me.input.KEY.W, 'jump');
                me.input.bindKey(me.input.KEY.A, 'left');
                me.input.bindKey(me.input.KEY.D, 'right');
                

		// add our HUD to the game world
/*-----------------------------------------------------------------------------
 * Below is the code that adds the HUD into the world.
 *----------------------------------------------------------------------------- 
 */
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},




	/**
	 *  action to perform when leaving this screen (state change)
	 */
/*-----------------------------------------------------------------------------
 * Below is the code that gets rid of my player when I die.
 *----------------------------------------------------------------------------- 
 */       
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},
/*-----------------------------------------------------------------------------
 * Below is the code that resets my player when I enter a new level.
 *----------------------------------------------------------------------------- 
 */        
        resetPlayer: function(x, y){
                var player = me.pool.pull("mario", x, y, {});
                me.game.world.addChild(player, 30);
        }      
});
