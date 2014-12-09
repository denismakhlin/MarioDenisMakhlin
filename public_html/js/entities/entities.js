// TODO
/*-----------------------------------------------------------------------------
 * Charecter/Player code that makes my character appear. Below It shows all the
 * lines of code used to porportion my character. The width, height, and image.
 *-----------------------------------------------------------------------------
 */
var game;

game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
            }]);
/*-----------------------------------------------------------------------------
 * Character/Player code that allowas my character to move with animation. Each
 * number represents an image which is put in an order of the last number, "80",
 * which is the speed of how fast the player's iimages move. I have code for the
 * movement, the idle stance, or staying still, and I have code for the speed 
 * (80), which gets faster the lower the number is.
 *-----------------------------------------------------------------------------
*/
        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("bigIdle", [19]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        this.renderable.addAnimation("bigWalk", [14, 15, 16, 17, 18, 19], 80);
        this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
        this.renderable.addAnimation("grow", [4, 5, 6, 7], 80);

        this.renderable.setCurrentAnimation("idle");
        this.big = false;
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
/*-----------------------------------------------------------------------------
 * Character/Player code that allows my character to move up left and right - 
 * with the touch of the arrow keys referring to the movement. Melon JS then
 * allows you to choose any key on the  keyboard to  represent the action
 * you called one. If you notice the timer tick line of code, this lets the 
 * game update whenever it needs to in order to have a smooth game process.
 *----------------------------------------------------------------------------- 
*/
    update: function(delta) {
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.flipX(false);
        } else if (me.input.isKeyPressed('left')) {
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }

        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        }
        
/*-----------------------------------------------------------------------------
 * Character/Player code that allows my character to stop moving when keys are
 * not being pressed making him "idle". It is done by making the animation be 
 * represented by a certain image. I also have code for, "small-walk." This 
 * code is used when the player is already in its big size, but it gets 
 * eaten by a, "Bad GUY, so it shrinks back to its normal heigt walkin in its
 * "small-walk"
 *-----------------------------------------------------------------------------
*/     
        
        if (!this.big) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("idle");
            }
        } else {

/*-----------------------------------------------------------------------------
 * Below is the code for my, "Big Walk animation. Again,  this is done by using
 * an image. The code below allowas t=for the animation actually occer when
 * the body velocity is not zero, or when it touches tthe mushroo.
 *-----------------------------------------------------------------------------
 */

            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
                }
/*-----------------------------------------------------------------------------
 * Below is my code for the "Big-Idle" animation. This is the oppisote of the 
 * regular idle in my previous code. In this line of code, it is saying if the
 * animation of the player stops, make the player stationary still using the 
 * large idle image I called on previosly.
 *----------------------------------------------------------------------------- 
 */
            } else {
                this.renderable.setCurrentAnimation("bigIdle");

            }

        }

        this._super(me.Entity, "update", [delta]);
        return true;
    },
/*-----------------------------------------------------------------------------
 * Below is my code that says that if the bad guy has touched my player, I will
 * use my else statement to use the shrink and idle animation again to make my
 * player small. Next, it is saying once I am in this stage and I get touched
 * again, the game will end, and I will appear back in the menu or game over
 * screen. However, if I jump on it using the sespons code and the ydif <= -115
 * line, it allows my player to still live, but the bad guy to die.
 *----------------------------------------------------------------------------- 
*/
    collideHandler: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        console.log(ydif);

        if (response.b.type === 'badguy') {
            if (ydif <= -115) {
                response.b.alive = false;
            } else {
                if (this.big) {
                    this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;
                    this.renderable.setCurrentAnimation("shrink", "idle");
                    this.renderable.setCurrentAnimationFrame();
                } else {
                    me.state.change(me.state.MENU);
                }
            }
/*-----------------------------------------------------------------------------
 * Below is the code that actually sets a change after the collison on the 
 * mushroom causing my character to grow into the "Big-Idle image.
 *----------------------------------------------------------------------------- 
 */
        } else if (response.b.type === 'mushroom') {
            this.renderable.setAnimationFrame("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }
    }
});

/*-----------------------------------------------------------------------------
 * Below is the code that uses the trigger entry I made isn my tiled, to load 
 * up the next level upon collisin with my character. Upon this collision,
 * the code below allows my player to respawn.
 *----------------------------------------------------------------------------- 
 */

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
});

/*-----------------------------------------------------------------------------
 * Below is the code for my, "Bad Guy" to appear in full width and height.
 *-----------------------------------------------------------------------------
*/

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }
            }]);
/*-----------------------------------------------------------------------------
 * Below is the code that alows my Bad Guy to keep updating with movement using
 * x factorss witch add the sprite's width.
 *----------------------------------------------------------------------------- 
 */
        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();

        this.alwaysUpdate = true;

        this.walkLeft = false;
        this.alive = true;
        this.type = "badguy";

        //this.renderable.addAnimation("run", [0, 1, 2], 80);
        //this.renderable.setCurrentAnimation("run");

        this.body.setVelocity(4, 6);



    },

/*-----------------------------------------------------------------------------
 * Below is the code that allows my bad guy to move back in froth in its
 * object-box that I made in Tiled usng the end of the box and start of the box
 * referring to startX or endX
 *----------------------------------------------------------------------------- 
 */

    update: function(delta) {
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        } else {
            me.game.world.removeChild(this);
        }

        this._super(me.Entity, "update", [delta]);
        return true;

    },
    collideHandler: function() {

    }
});

/*-----------------------------------------------------------------------------
 * Below is the code that allows my mushroom image to appear with the use
 * of Tiled. The code below allows my mushroom to have the right height and
 * width.
 *----------------------------------------------------------------------------- 
 */

game.Mushroom = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mushroom",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        me.collision.check(this);
        this.type = "mushroom";

    }
});
