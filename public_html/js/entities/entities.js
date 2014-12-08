// TODO
/*-----------------------------------------------------------------------------
 * Charecter/Player code that makes my character appear!
 *-----------------------------------------------------------------------------
 */
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function(){
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }     
            }]);  
/*-----------------------------------------------------------------------------
 * Character/Player code that allowas my character to move with animation!
 *-----------------------------------------------------------------------------
 */        
        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        
        this.renderable.setCurrentAnimation("idle");
        
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        },
/*-----------------------------------------------------------------------------
 * Character/Player code that allows my character to move up left and right - 
 * with the touch of the arrow keys referring to the movement!
 *----------------------------------------------------------------------------- 
 */
    update: function(delta){
        if(me.input.isKeyPressed("right")){
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(false);
        } else if (me.input.isKeyPressed('left')) {
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }else{
            this.body.vel.x = 0;
        }
        
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling)   {
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        }
/*-----------------------------------------------------------------------------
 * Character/Player code that allows my character to stop moving when keys are
 * not being pressed making him "idle"
 *-----------------------------------------------------------------------------
 */        
        if(this.body.vel.x !== 0) {
            if(!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        }else{
            this.renderable.setCurrentAnimation("idle");
        }
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
/*-----------------------------------------------------------------------------
 * Character/Player code that allows my  character to collide with an invisible
 * trigger entry that allows the character to move on to the next level! 
 *----------------------------------------------------------------------------- 
 */   
    collideHandler: function(response) {
        
    }
});

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function(){
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
});

game.BadGuy = me.Entity.extend ({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function(){
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }     
            }]);  
        
        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.z = x + width - this.spritewidth;
        this.updateBounds();
        
        this.alwaysUpdate = true;
        
        this.walkLeft = false;
        this.alive = true;
        this.type = "badguy";
        
        //this.renderable.addAnimation("run", [0, 1, 2], 80);
        //this.renderable.setCurrentAnimation("run");
        
        this.body.setVelocity(4, 6);
        
        
        
    },
    
    update: function (delta) {
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(this.alive) {
            if(this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            }else if(!this.walkLeft && this.pos.x >= this.endX){
                this.walkleft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        }else{
            me.game.world.removeChild(this);
        }
        
        this._super(me.Entity, "update", [delta]);
        return true;
        
    },
    
    collideHandler: function() {
        
    }
});
