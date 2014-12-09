game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
/*-----------------------------------------------------------------------------
 * Below is the code that opens up my title screen image and allows me to press
 * ENTER to starrt up the game.
 *----------------------------------------------------------------------------- 
 */
	onResetEvent: function() {
            
            me.input.bindKey(me.input.KEY.ENTER , "start");
            me.game.world.addChild(new me.Sprite (0, 0, me.loader.getImage("title-screen")), -10);
/*-----------------------------------------------------------------------------
 * Below is the code that writes in a certain spot on my screen in my choice of
 * font and color
 *----------------------------------------------------------------------------- 
 */
            me.game.world.addChild(new (me.Renderable.extend ({
                init:function() {
                    this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
                    this.font = new me.Font("Impact", 46, "black");
                },
/*-----------------------------------------------------------------------------
 * Below is the code that alows any words I want to appear on my title screen
 * usinga font drawer.
 *----------------------------------------------------------------------------- 
 */                
                draw:function(renderer) {
                    this.font.draw(renderer.getContext(), "",650, 320);
                    this.font.draw(renderer.getContext(), "Press ENTER To  Play", 350, 320);
                }
            })));
            
            
            this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
                if(action === 'start') {
                    me.state.change(me.state.PLAY);
                }
            });
            
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
/*-----------------------------------------------------------------------------
 * This alows my title screen to reapear when the game restarts
 *----------------------------------------------------------------------------- 
 */        
	onDestroyEvent: function() {
		//me.input.unbindKey(me.input.KEY.ENTER); 
                me.event.unsubscribe(this.handler);
	}
});
