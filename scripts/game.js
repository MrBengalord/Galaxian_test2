/**
 * GalaxianEmpire - Space-themed arcade shooter with strategic meta-gameplay
 * Main game engine file
 */

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listener for start button
    document.getElementById('start-game').addEventListener('click', function() {
        // Remove title screen elements
        var titleScreen = document.getElementById('titleScreen');
        if (titleScreen) titleScreen.remove();
        var bottom_menu = document.getElementById('bottom-menu');
        if (bottom_menu) bottom_menu.style.display = 'none';
        var game_header = document.getElementById('game-header');
        if (game_header) game_header.style.display = 'none';
        
        // Hide start button
        this.style.display = 'none';
        
        // Initialize and start game
        if (game.init()) {
            game.start();
        }
    });
});

/**
 * ImageRepository - Singleton object for managing game images
 */
var ImageRepository = new function() {
    // Define images
    this.empty = null;
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
    this.enemy = new Image();
    this.enemyBullet = new Image();
    this.explosion = new Image();
    this.powerup = new Image();
    
    // Track loading progress
    var numImages = 7;
    var numLoaded = 0;
    
    // Function to check if all images are loaded
    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            window.init();
        }
    }
    
    // Set up onload handlers
    this.background.onload = function() {
        imageLoaded();
    }
    this.spaceship.onload = function() {
        imageLoaded();
    }
    this.bullet.onload = function() {
        imageLoaded();
    }
    this.enemy.onload = function() {
        imageLoaded();
    }
    this.enemyBullet.onload = function() {
        imageLoaded();
    }
    this.explosion.onload = function() {
        imageLoaded();
    }
    this.powerup.onload = function() {
        imageLoaded();
    }
    
    // Set image sources
    this.background.src = "img/bg.png";
    this.spaceship.src = "img/ship.png";
    this.bullet.src = "img/bullet.png";
    this.enemy.src = "img/enemy.png";
    this.enemyBullet.src = "img/enemy-bullet.png";
    this.explosion.src = "img/explosion.png";
    this.powerup.src = "img/powerup.png";
};

/**
 * Drawable - Abstract base class for game objects
 */
function Drawable() {
    this.init = function(x, y, width, height) {
        // Default variables
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    
    // Default properties
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = "";
    this.isColliding = false;
    this.type = "";
    
    // Abstract draw method to be implemented by child classes
    this.draw = function() {};
    
    // Default collision detection method
    this.isCollidingWith = function(object) {
        return (this.x < object.x + object.width &&
                this.x + this.width > object.x &&
                this.y < object.y + object.height &&
                this.y + this.height > object.y);
    };
}

/**
 * Background - Creates scrolling background effect
 */
function Background() {
    this.speed = 1; // Speed of background scrolling
    
    // Implement draw method
    this.draw = function() {
        // Pan background
        this.y += this.speed;
        
        // Draw main background image
        this.context.drawImage(ImageRepository.background, this.x, this.y);
        
        // Draw second image at the top edge of the first image
        this.context.drawImage(ImageRepository.background, this.x, this.y - this.canvasHeight);
        
        // If the image scrolled off the screen, reset
        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }
    };
}
// Set Background to inherit from Drawable
Background.prototype = new Drawable();

/**
 * Bullet - Player projectile object
 */
function Bullet() {
    this.alive = false; // Is true if the bullet is currently in use
    this.type = "bullet";
    this.collidableWith = "enemy";
    
    // Sets the bullet values
    this.spawn = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
        this.isColliding = false;
    };
    
    /*
     * Uses a "dirty rectangle" to erase the bullet and moves it.
     * Returns true if the bullet moved off the screen, indicating that
     * the bullet is ready to be cleared by the pool, otherwise draws
     * the bullet.
     */
    this.draw = function() {
        this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
        this.y -= this.speed;
        
        if (this.isColliding) {
            return true;
        }
        if (this.y <= 0 - this.height) {
            return true;
        } else {
            this.context.drawImage(ImageRepository.bullet, this.x, this.y);
            return false;
        }
    };
    
    // Resets the bullet values
    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
Bullet.prototype = new Drawable();

/**
 * EnemyBullet - Enemy projectile object
 */
function EnemyBullet() {
    this.alive = false; // Is true if the bullet is currently in use
    this.type = "enemyBullet";
    this.collidableWith = "ship";
    
    // Sets the bullet values
    this.spawn = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
        this.isColliding = false;
    };
    
    /*
     * Uses a "dirty rectangle" to erase the bullet and moves it.
     * Returns true if the bullet moved off the screen, indicating that
     * the bullet is ready to be cleared by the pool, otherwise draws
     * the bullet.
     */
    this.draw = function() {
        this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
        this.y += this.speed;
        
        if (this.isColliding) {
            return true;
        }
        if (this.y >= this.canvasHeight) {
            return true;
        } else {
            this.context.drawImage(ImageRepository.enemyBullet, this.x, this.y);
            return false;
        }
    };
    
    // Resets the bullet values
    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
EnemyBullet.prototype = new Drawable();

/**
 * Enemy - Enemy ship object
 */
function Enemy() {
    this.alive = false; // Is true if the enemy is currently in use
    this.type = "enemy";
    this.collidableWith = "bullet";
    this.percentFire = 0.01; // Chance of firing per frame
    this.score = 10; // Score for destroying this enemy
    
    // Movement pattern variables
    this.speedX = 0;
    this.speedY = 0;
    this.movePattern = 0; // 0: straight, 1: sine wave, 2: dive
    this.patternStep = 0;
    this.patternAmplitude = 30;
    this.patternFrequency = 0.02;
    
    // Sets the enemy values
    this.spawn = function(x, y, speedX, speedY, movePattern) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.movePattern = movePattern;
        this.alive = true;
        this.isColliding = false;
        this.patternStep = 0;
    };
    
    // Update enemy position based on movement pattern
    this.draw = function() {
        this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
        
        // Check if enemy is colliding
        if (this.isColliding) {
            return true;
        }
        
        // Update position based on movement pattern
        this.patternStep++;
        
        switch(this.movePattern) {
            case 0: // Straight down
                this.x += this.speedX;
                this.y += this.speedY;
                break;
            case 1: // Sine wave
                this.x = this.x + this.speedX + Math.sin(this.patternStep * this.patternFrequency) * this.patternAmplitude / 20;
                this.y += this.speedY;
                break;
            case 2: // Dive attack
                if (this.patternStep < 30) {
                    this.x += this.speedX;
                    this.y += this.speedY * 0.5;
                } else if (this.patternStep < 60) {
                    this.x += this.speedX * 2;
                    this.y += this.speedY * 2;
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                }
                break;
        }
        
        // Check if enemy is off screen
        if (this.y > this.canvasHeight || 
            this.x < -this.width || 
            this.x > this.canvasWidth) {
            return true;
        } else {
            // Draw the enemy
            this.context.drawImage(ImageRepository.enemy, this.x, this.y);
            
            // Enemy has a chance to fire
            if (Math.random() < this.percentFire && game.enemyBulletPool.getPool().length > 0) {
                game.enemyBulletPool.get(this.x + this.width/2, this.y + this.height, 2);
            }
            
            return false;
        }
    };
    
    // Resets the enemy values
    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = false;
        this.isColliding = false;
        this.patternStep = 0;
    };
}
Enemy.prototype = new Drawable();

/**
 * Explosion - Visual effect when objects are destroyed
 */
function Explosion() {
    this.alive = false; // Is true if the explosion is currently in use
    
    // Animation variables
    this.frames = 8;
    this.currentFrame = 0;
    this.spriteWidth = 32; // Width of a single explosion frame
    this.spriteHeight = 32; // Height of a single explosion frame
    this.frameSpeed = 3; // Frames to wait before next animation frame
    this.frameCounter = 0;
    
    // Sets the explosion values
    this.spawn = function(x, y) {
        this.x = x - this.spriteWidth/2;
        this.y = y - this.spriteHeight/2;
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.alive = true;
    };
    
    // Animate the explosion
    this.draw = function() {
        if (!this.alive) {
            return false;
        }
        
        this.frameCounter++;
        
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            if (this.currentFrame >= this.frames) {
                this.alive = false;
                return true;
            }
        }
        
        // Calculate position in sprite sheet
        var srcX = this.currentFrame * this.spriteWidth;
        
        // Draw the current frame
        this.context.drawImage(
            ImageRepository.explosion, 
            srcX, 0, 
            this.spriteWidth, this.spriteHeight, 
            this.x, this.y, 
            this.spriteWidth, this.spriteHeight
        );
        
        return false;
    };
    
    // Resets the explosion
    this.clear = function() {
        this.alive = false;
    };
}
Explosion.prototype = new Drawable();

/**
 * PowerUp - Collectible item that enhances player abilities
 */
function PowerUp() {
    this.alive = false; // Is true if the powerup is currently in use
    this.type = "powerup";
    this.collidableWith = "ship";
    this.powerType = 0; // 0: weapon, 1: shield, 2: speed, 3: special
    
    // Sets the powerup values
    this.spawn = function(x, y, speed, powerType) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.powerType = powerType;
        this.alive = true;
        this.isColliding = false;
    };
    
    // Update powerup position
    this.draw = function() {
        this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
        this.y += this.speed;
        
        if (this.isColliding) {
            return true;
        }
        
        if (this.y > this.canvasHeight) {
            return true;
        } else {
            this.context.drawImage(ImageRepository.powerup, this.x, this.y);
            return false;
        }
    };
    
    // Resets the powerup values
    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.powerType = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
PowerUp.prototype = new Drawable();

/**
 * Pool - Object pool for efficient resource management
 */
function Pool(maxSize) {
    var size = maxSize; // Max objects allowed in the pool
    var pool = [];
    
    this.getPool = function() {
        return pool;
    };
    
    /*
     * Populates the pool array with objects
     */
    this.init = function(object) {
        if (object == "bullet") {
            for (var i = 0; i < size; i++) {
                // Initialize the object
                var bullet = new Bullet();
                bullet.init(0, 0, ImageRepository.bullet.width, ImageRepository.bullet.height);
                bullet.collidableWith = "enemy";
                bullet.type = "bullet";
                pool[i] = bullet;
            }
        } else if (object == "enemy") {
            for (var i = 0; i < size; i++) {
                var enemy = new Enemy();
                enemy.init(0, 0, ImageRepository.enemy.width, ImageRepository.enemy.height);
                pool[i] = enemy;
            }
        } else if (object == "enemyBullet") {
            for (var i = 0; i < size; i++) {
                var bullet = new EnemyBullet();
                bullet.init(0, 0, ImageRepository.enemyBullet.width, ImageRepository.enemyBullet.height);
                pool[i] = bullet;
            }
        } else if (object == "explosion") {
            for (var i = 0; i < size; i++) {
                var explosion = new Explosion();
                explosion.init(0, 0, ImageRepository.explosion.width / 8, ImageRepository.explosion.height);
                pool[i] = explosion;
            }
        } else if (object == "powerup") {
            for (var i = 0; i < size; i++) {
                var powerup = new PowerUp();
                powerup.init(0, 0, ImageRepository.powerup.width, ImageRepository.powerup.height);
                pool[i] = powerup;
            }
        }
    };
    
    /*
     * Grabs the last item in the list and initializes it and
     * pushes it to the front of the array.
     */
    this.get = function(x, y, speed, option1, option2) {
        if (!pool[size - 1].alive) {
            if (pool[size - 1].type == "bullet" || pool[size - 1].type == "enemyBullet") {
                pool[size - 1].spawn(x, y, speed);
            } else if (pool[size - 1].type == "enemy") {
                pool[size - 1].spawn(x, y, speed, option1, option2); // option1 = speedY, option2 = movePattern
            } else if (pool[size - 1].type == "explosion") {
                pool[size - 1].spawn(x, y);
            } else if (pool[size - 1].type == "powerup") {
                pool[size - 1].spawn(x, y, speed, option1); // option1 = powerType
            }
            
            pool.unshift(pool.pop());
            return true;
        } else {
            return false;
        }
    };
    
    /*
     * Used for the ship to be able to get two bullets at once
     */
    this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
        if (!pool[size - 1].alive && !pool[size - 2].alive) {
            this.get(x1, y1, speed1);
            this.get(x2, y2, speed2);
            return true;
        } else {
            return false;
        }
    };
    
    /*
     * Draws any in-use objects. If the object goes off the screen,
     * clears it and pushes it to the front of the array.
     */
    this.animate = function() {
        for (var i = 0; i < size; i++) {
            // Only draw until we find an object that is not alive
            if (pool[i].alive) {
                if (pool[i].draw()) {
                    pool[i].clear();
                    pool.push((pool.splice(i, 1))[0]);
                    i--;
                }
            } else {
                break;
            }
        }
    };
    
    /*
     * Checks for collisions between objects
     */
    this.checkCollisions = function(object) {
        for (var i = 0; i < size; i++) {
            if (pool[i].alive && pool[i].collidableWith === object.type &&
                pool[i].isCollidingWith(object) && !pool[i].isColliding) {
                pool[i].isColliding = true;
                object.isColliding = true;
                return true;
            }
        }
        return false;
    };
}

/**
 * Ship - Player's ship object
 */
function Ship() {
    this.speed = 3;
    this.bulletPool = new Pool(30);
    this.bulletPool.init("bullet");
    this.fireRate = 15; // Higher number = slower fire rate
    this.counter = 0;
    this.score = 0;
    this.lives = 3;
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    this.weaponLevel = 1; // 1: single, 2: double, 3: triple
    this.type = "ship";
    this.collidableWith = "enemyBullet";
    
    // Touch control variables
    this.touchX = 0;
    this.isTouching = false;
    
    this.draw = function() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Handle invulnerability
        if (this.invulnerable) {
            this.invulnerableTimer++;
            
            // Flash the ship when invulnerable
            if (this.invulnerableTimer % 10 < 5) {
                this.context.globalAlpha = 0.5;
            }
            
            // End invulnerability after 3 seconds (180 frames at 60fps)
            if (this.invulnerableTimer > 180) {
                this.invulnerable = false;
                this.invulnerableTimer = 0;
            }
        }
        
        // Draw the ship
        this.context.drawImage(ImageRepository.spaceship, this.x, this.y);
        
        // Reset alpha
        this.context.globalAlpha = 1.0;
        
        // Update score display
        document.getElementById('score-value').textContent = this.score;
        
        // Update lives display
        var livesDisplay = document.getElementById('lives-display');
        if (livesDisplay) {
            livesDisplay.innerHTML = '';
            for (var i = 0; i < this.lives; i++) {
                var lifeIcon = document.createElement('div');
                lifeIcon.className = 'life-icon';
                livesDisplay.appendChild(lifeIcon);
            }
        }
    };
    
    this.move = function() {
        this.counter++;
        
        // Handle keyboard controls
        if (KEY_STATUS.left || KEY_STATUS.right ||
            KEY_STATUS.down || KEY_STATUS.up) {
            
            // Update x and y according to the direction to move
            if (KEY_STATUS.left) {
                this.x -= this.speed;
                if (this.x <= 0) // Keep player within the screen
                    this.x = 0;
            } else if (KEY_STATUS.right) {
                this.x += this.speed;
                if (this.x >= this.canvasWidth - this.width)
                    this.x = this.canvasWidth - this.width;
            }
            
            if (KEY_STATUS.up) {
                this.y -= this.speed;
                if (this.y <= this.canvasHeight/4*3)
                    this.y = this.canvasHeight/4*3;
            } else if (KEY_STATUS.down) {
                this.y += this.speed;
                if (this.y >= this.canvasHeight - this.height)
                    this.y = this.canvasHeight - this.height;
            }
        }
        
        // Handle touch controls
        if (this.isTouching) {
            // Move ship towards touch position (horizontally only)
            if (Math.abs(this.touchX - (this.x + this.width/2)) > this.speed) {
                if (this.touchX < this.x + this.width/2) {
                    this.x -= this.speed;
                    if (this.x <= 0)
                        this.x = 0;
                } else {
                    this.x += this.speed;
                    if (this.x >= this.canvasWidth - this.width)
                        this.x = this.canvasWidth - this.width;
                }
            }
        }
        
        // Fire bullets automatically
        if (this.counter >= this.fireRate) {
            this.fire();
            this.counter = 0;
        }
        
        // Redraw the ship
        this.draw();
    };
    
    // Fire bullets based on weapon level
    this.fire = function() {
        switch(this.weaponLevel) {
            case 1: // Single bullet
                this.bulletPool.get(this.x + this.width/2 - 1, this.y, 3);
                break;
            case 2: // Double bullets
                this.bulletPool.getTwo(this.x + 10, this.y, 3,
                                      this.x + this.width - 10, this.y, 3);
                break;
            case 3: // Triple bullets (spread)
                this.bulletPool.get(this.x + this.width/2 - 1, this.y, 3);
                this.bulletPool.getTwo(this.x + 5, this.y + 5, 2.5,
                                      this.x + this.width - 5, this.y + 5, 2.5);
                break;
        }
    };
    
    // Handle ship being hit
    this.hit = function() {
        if (!this.invulnerable) {
            this.lives--;
            
            if (this.lives <= 0) {
                // Game over
                game.gameOver();
            } else {
                // Make ship invulnerable temporarily
                this.invulnerable = true;
                this.invulnerableTimer = 0;
                
                // Reset weapon level
                this.weaponLevel = 1;
            }
        }
    };
    
    // Handle powerup collection
    this.collectPowerup = function(powerType) {
        switch(powerType) {
            case 0: // Weapon upgrade
                if (this.weaponLevel < 3) {
                    this.weaponLevel++;
                } else {
                    // Max weapon level - give points instead
                    this.score += 500;
                }
                break;
            case 1: // Shield
                this.invulnerable = true;
                this.invulnerableTimer = 0;
                break;
            case 2: // Speed boost
                this.speed = 5; // Temporary speed boost
                setTimeout(function() {
                    game.ship.speed = 3; // Reset speed after 5 seconds
                }, 5000);
                break;
            case 3: // Extra life
                if (this.lives < 5) {
                    this.lives++;
                } else {
                    // Max lives - give points instead
                    this.score += 1000;
                }
                break;
        }
    };
    
    // Set up touch controls
    this.setupTouchControls = function() {
        var self = this;
        
        // Touch start event
        this.canvasElement.addEventListener('touchstart', function(e) {
            e.preventDefault();
            var touch = e.touches[0];
            var rect = self.canvasElement.getBoundingClientRect();
            self.touchX = touch.clientX - rect.left;
            self.isTouching = true;
        });
        
        // Touch move event
        this.canvasElement.addEventListener('touchmove', function(e) {
            e.preventDefault();
            var touch = e.touches[0];
            var rect = self.canvasElement.getBoundingClientRect();
            self.touchX = touch.clientX - rect.left;
        });
        
        // Touch end event
        this.canvasElement.addEventListener('touchend', function(e) {
            e.preventDefault();
            self.isTouching = false;
        });
    };
}
Ship.prototype = new Drawable();

/**
 * QuadTree - Used for efficient collision detection
 */
function QuadTree(level, bounds) {
    this.maxObjects = 10; // Maximum objects before node split
    this.maxLevels = 5; // Maximum levels of the tree
    this.level = level || 0; // Current level
    this.bounds = bounds; // Bounds of this node
    this.objects = []; // Objects in this node
    this.nodes = []; // Child nodes
    
    // Clears the quadtree and all child nodes
    this.clear = function() {
        this.objects = [];
        
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]) {
                this.nodes[i].clear();
            }
        }
        
        this.nodes = [];
    };
    
    // Splits the node into 4 child nodes
    this.split = function() {
        var subWidth = this.bounds.width / 2;
        var subHeight = this.bounds.height / 2;
        var x = this.bounds.x;
        var y = this.bounds.y;
        
        // Create child nodes
        this.nodes[0] = new QuadTree(this.level + 1, {
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        });
        this.nodes[1] = new QuadTree(this.level + 1, {
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        });
        this.nodes[2] = new QuadTree(this.level + 1, {
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        });
        this.nodes[3] = new QuadTree(this.level + 1, {
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        });
    };
    
    // Determine which node the object belongs to
    this.getIndex = function(rect) {
        var index = -1;
        var verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
        var horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);
        
        // Object can completely fit within the top quadrants
        var topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
        // Object can completely fit within the bottom quadrants
        var bottomQuadrant = (rect.y > horizontalMidpoint);
        
        // Object can completely fit within the left quadrants
        if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        }
        // Object can completely fit within the right quadrants
        else if (rect.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }
        
        return index;
    };
    
    // Insert an object into the quadtree
    this.insert = function(rect) {
        if (this.nodes.length) {
            var index = this.getIndex(rect);
            
            if (index !== -1) {
                this.nodes[index].insert(rect);
                return;
            }
        }
        
        this.objects.push(rect);
        
        // Split if we exceed the capacity and haven't reached max levels
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }
            
            // Add all objects to their corresponding nodes
            for (var i = 0; i < this.objects.length; i++) {
                var index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects[i]);
                    this.objects.splice(i, 1);
                    i--;
                }
            }
        }
    };
    
    // Return all objects that could collide with the given object
    this.retrieve = function(rect) {
        var index = this.getIndex(rect);
        var returnObjects = this.objects;
        
        // If we have child nodes, retrieve their objects as well
        if (this.nodes.length) {
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(rect));
            } else {
                // Object doesn't fit neatly into a node, check all nodes
                for (var i = 0; i < this.nodes.length; i++) {
                    returnObjects = returnObjects.concat(this.nodes[i].retrieve(rect));
                }
            }
        }
        
        return returnObjects;
    };
}

/**
 * Game - Main game object
 */
function Game() {
    // Game state
    this.gameRunning = false;
    this.isPaused = false;
    this.level = 1;
    this.enemiesRemaining = 0;
    this.spawnWave = 0;
    this.spawnDelay = 0;
    this.quadTree = null;
    
    // Initialize the game
    this.init = function() {
        // Get the canvas elements
        this.bgCanvas = document.getElementById('background');
        this.shipCanvas = document.getElementById('ship');
        this.mainCanvas = document.getElementById('main');
        
        // Set fixed canvas sizes
        this.bgCanvas.width = 360;
        this.bgCanvas.height = 600;
        this.shipCanvas.width = 360;
        this.shipCanvas.height = 600;
        this.mainCanvas.width = 360;
        this.mainCanvas.height = 600;
        
        // Test to see if canvas is supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.shipContext = this.shipCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');
            
            // Initialize objects to contain their context and canvas information
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            
            Ship.prototype.context = this.shipContext;
            Ship.prototype.canvasWidth = this.shipCanvas.width;
            Ship.prototype.canvasHeight = this.shipCanvas.height;
            Ship.prototype.canvasElement = this.shipCanvas;
            
            Bullet.prototype.context = this.mainContext;
            Bullet.prototype.canvasWidth = this.mainCanvas.width;
            Bullet.prototype.canvasHeight = this.mainCanvas.height;
            
            Enemy.prototype.context = this.mainContext;
            Enemy.prototype.canvasWidth = this.mainCanvas.width;
            Enemy.prototype.canvasHeight = this.mainCanvas.height;
            
            EnemyBullet.prototype.context = this.mainContext;
            EnemyBullet.prototype.canvasWidth = this.mainCanvas.width;
            EnemyBullet.prototype.canvasHeight = this.mainCanvas.height;
            
            Explosion.prototype.context = this.mainContext;
            Explosion.prototype.canvasWidth = this.mainCanvas.width;
            Explosion.prototype.canvasHeight = this.mainCanvas.height;
            
            PowerUp.prototype.context = this.mainContext;
            PowerUp.prototype.canvasWidth = this.mainCanvas.width;
            PowerUp.prototype.canvasHeight = this.mainCanvas.height;
            
            // Initialize the background object
            this.background = new Background();
            this.background.init(0, 0);
            
            // Initialize the ship object
            this.ship = new Ship();
            var shipStartX = this.shipCanvas.width/2 - ImageRepository.spaceship.width/2;
            var shipStartY = this.shipCanvas.height/4*3 + ImageRepository.spaceship.height;
            this.ship.init(shipStartX, shipStartY, ImageRepository.spaceship.width, ImageRepository.spaceship.height);
            
            // Initialize the bullet pool
            this.enemyBulletPool = new Pool(50);
            this.enemyBulletPool.init("enemyBullet");
            
            // Initialize the enemy pool
            this.enemyPool = new Pool(30);
            this.enemyPool.init("enemy");
            
            // Initialize the explosion pool
            this.explosionPool = new Pool(10);
            this.explosionPool.init("explosion");
            
            // Initialize the powerup pool
            this.powerupPool = new Pool(5);
            this.powerupPool.init("powerup");
            
            // Initialize the quadtree
            this.quadTree = new QuadTree(0, {
                x: 0,
                y: 0,
                width: this.mainCanvas.width,
                height: this.mainCanvas.height
            });
            
            // Set up game UI
            this.setupUI();
            
            // Set up touch controls
            this.ship.setupTouchControls();
            
            // Set up pause functionality
            this.setupPauseButton();
            
            return true;
        } else {
            return false;
        }
    };
    
    // Set up game UI elements
    this.setupUI = function() {
        // Create score display
        var scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.className = 'game-ui';
        scoreDisplay.innerHTML = 'Score: <span id="score-value">0</span>';
        document.body.appendChild(scoreDisplay);
        
        // Create lives display
        var livesDisplay = document.createElement('div');
        livesDisplay.id = 'lives-display';
        livesDisplay.className = 'game-ui';
        document.body.appendChild(livesDisplay);
        
        // Create special ability button
        var specialAbility = document.createElement('div');
        specialAbility.id = 'special-ability';
        specialAbility.className = 'game-ui';
        document.body.appendChild(specialAbility);
        
        // Create game over screen
        var gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over';
        gameOverScreen.innerHTML = '<h2>Game Over</h2>' +
                                  '<div id="final-score">Score: 0</div>' +
                                  '<button id="restart-button">Play Again</button>';
        document.body.appendChild(gameOverScreen);
        
        // Create level complete screen
        var levelCompleteScreen = document.createElement('div');
        levelCompleteScreen.id = 'level-complete';
        levelCompleteScreen.innerHTML = '<h2>Level Complete!</h2>' +
                                       '<div id="level-score">Score: 0</div>' +
                                       '<button id="continue-button">Continue</button>';
        document.body.appendChild(levelCompleteScreen);
        
        // Create pause menu
        var pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.innerHTML = '<h2>Paused</h2>' +
                             '<button class="pause-button" id="resume-button">Resume</button>' +
                             '<button class="pause-button" id="quit-button">Quit</button>';
        document.body.appendChild(pauseMenu);
        
        // Show UI elements
        document.querySelectorAll('.game-ui').forEach(function(el) {
            el.style.display = 'block';
        });
        
        // Set up restart button
        document.getElementById('restart-button').addEventListener('click', function() {
            document.getElementById('game-over').style.display = 'none';
            game.restart();
        });
        
        // Set up continue button
        document.getElementById('continue-button').addEventListener('click', function() {
            document.getElementById('level-complete').style.display = 'none';
            game.nextLevel();
        });
        
        // Set up resume button
        document.getElementById('resume-button').addEventListener('click', function() {
            game.resumeGame();
        });
        
        // Set up quit button
        document.getElementById('quit-button').addEventListener('click', function() {
            game.quitGame();
        });
    };
    
    // Set up pause button
    this.setupPauseButton = function() {
        var self = this;
        
        // Add pause button
        var pauseButton = document.createElement('div');
        pauseButton.id = 'pause-button';
        pauseButton.className = 'game-ui';
        pauseButton.innerHTML = '❚❚';
        pauseButton.style.position = 'absolute';
        pauseButton.style.top = '10px';
        pauseButton.style.right = '10px';
        pauseButton.style.zIndex = '20';
        pauseButton.style.fontSize = '24px';
        pauseButton.style.color = '#4da6ff';
        pauseButton.style.cursor = 'pointer';
        document.body.appendChild(pauseButton);
        
        // Add event listener
        pauseButton.addEventListener('click', function() {
            self.pauseGame();
        });
        
        // Also pause when ESC key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 27) { // ESC key
                if (self.gameRunning && !self.isPaused) {
                    self.pauseGame();
                } else if (self.gameRunning && self.isPaused) {
                    self.resumeGame();
                }
            }
        });
    };
    
    // Start the game
    this.start = function() {
        this.gameRunning = true;
        this.ship.draw();
        this.ship.bulletPool.init("bullet");
        this.startLevel(1);
        animate();
    };
    
    // Start a specific level
    this.startLevel = function(levelNum) {
        this.level = levelNum;
        this.enemiesRemaining = 20 + (levelNum * 5); // More enemies per level
        this.spawnWave = 0;
        this.spawnDelay = 0;
    };
    
    // Spawn a wave of enemies
    this.spawnEnemies = function() {
        if (this.enemiesRemaining <= 0 && this.enemyPool.getPool().filter(function(enemy) { return enemy.alive; }).length === 0) {
            // Level complete
            this.levelComplete();
            return;
        }
        
        if (this.spawnDelay > 0) {
            this.spawnDelay--;
            return;
        }
        
        // Determine wave type based on level and previous waves
        var waveType = this.spawnWave % 3;
        var enemiesInWave = Math.min(5, this.enemiesRemaining);
        
        switch(waveType) {
            case 0: // Line formation
                for (var i = 0; i < enemiesInWave; i++) {
                    if (this.enemiesRemaining > 0) {
                        var x = 30 + (i * 60);
                        this.enemyPool.get(x, -50, 0, 1, 0); // x, y, speedX, speedY, movePattern
                        this.enemiesRemaining--;
                    }
                }
                break;
            case 1: // V formation
                for (var i = 0; i < enemiesInWave; i++) {
                    if (this.enemiesRemaining > 0) {
                        var x = this.mainCanvas.width/2 + (i % 2 === 0 ? 1 : -1) * (i * 30);
                        this.enemyPool.get(x, -50 - (i * 20), 0, 1, 1); // Sine wave pattern
                        this.enemiesRemaining--;
                    }
                }
                break;
            case 2: // Random dive bombers
                for (var i = 0; i < enemiesInWave; i++) {
                    if (this.enemiesRemaining > 0) {
                        var x = Math.random() * (this.mainCanvas.width - 50);
                        this.enemyPool.get(x, -50 - (i * 30), (Math.random() - 0.5) * 2, 1.5, 2); // Dive pattern
                        this.enemiesRemaining--;
                    }
                }
                break;
        }
        
        this.spawnWave++;
        this.spawnDelay = 120; // 2 seconds at 60fps
        
        // Spawn a powerup occasionally
        if (Math.random() < 0.3) { // 30% chance per wave
            var x = Math.random() * (this.mainCanvas.width - 30);
            var powerType = Math.floor(Math.random() * 4); // 0-3
            this.powerupPool.get(x, -30, 1, powerType);
        }
    };
    
    // Check for collisions between game objects
    this.detectCollision = function() {
        var objects = [];
        
        // Add the ship
        this.quadTree.insert({
            x: this.ship.x,
            y: this.ship.y,
            width: this.ship.width,
            height: this.ship.height,
            type: this.ship.type,
            object: this.ship
        });
        
        // Add enemies
        this.enemyPool.getPool().forEach(function(enemy) {
            if (enemy.alive) {
                this.quadTree.insert({
                    x: enemy.x,
                    y: enemy.y,
                    width: enemy.width,
                    height: enemy.height,
                    type: enemy.type,
                    object: enemy
                });
            }
        }, this);
        
        // Add bullets
        this.ship.bulletPool.getPool().forEach(function(bullet) {
            if (bullet.alive) {
                this.quadTree.insert({
                    x: bullet.x,
                    y: bullet.y,
                    width: bullet.width,
                    height: bullet.height,
                    type: bullet.type,
                    object: bullet
                });
            }
        }, this);
        
        // Add enemy bullets
        this.enemyBulletPool.getPool().forEach(function(bullet) {
            if (bullet.alive) {
                this.quadTree.insert({
                    x: bullet.x,
                    y: bullet.y,
                    width: bullet.width,
                    height: bullet.height,
                    type: bullet.type,
                    object: bullet
                });
            }
        }, this);
        
        // Add powerups
        this.powerupPool.getPool().forEach(function(powerup) {
            if (powerup.alive) {
                this.quadTree.insert({
                    x: powerup.x,
                    y: powerup.y,
                    width: powerup.width,
                    height: powerup.height,
                    type: powerup.type,
                    object: powerup
                });
            }
        }, this);
        
        // Check for collisions
        this.checkCollisions();
        
        // Clear the quadtree
        this.quadTree.clear();
    };
    
    // Check for collisions between objects
    this.checkCollisions = function() {
        // Check enemy collisions
        this.enemyPool.getPool().forEach(function(enemy) {
            if (enemy.alive) {
                // Check if enemy collides with player bullets
                this.ship.bulletPool.getPool().forEach(function(bullet) {
                    if (bullet.alive && bullet.isCollidingWith(enemy)) {
                        bullet.isColliding = true;
                        enemy.isColliding = true;
                        
                        // Create explosion
                        this.explosionPool.get(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                        
                        // Add score
                        this.ship.score += enemy.score;
                    }
                }, this);
                
                // Check if enemy collides with player ship
                if (!this.ship.invulnerable && enemy.isCollidingWith(this.ship)) {
                    enemy.isColliding = true;
                    
                    // Create explosion
                    this.explosionPool.get(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                    
                    // Player takes damage
                    this.ship.hit();
                }
            }
        }, this);
        
        // Check enemy bullet collisions with player
        this.enemyBulletPool.getPool().forEach(function(bullet) {
            if (bullet.alive && !this.ship.invulnerable && bullet.isCollidingWith(this.ship)) {
                bullet.isColliding = true;
                
                // Create small explosion
                this.explosionPool.get(bullet.x, bullet.y);
                
                // Player takes damage
                this.ship.hit();
            }
        }, this);
        
        // Check powerup collisions with player
        this.powerupPool.getPool().forEach(function(powerup) {
            if (powerup.alive && powerup.isCollidingWith(this.ship)) {
                powerup.isColliding = true;
                
                // Apply powerup effect
                this.ship.collectPowerup(powerup.powerType);
            }
        }, this);
    };
    
    // Game over
    this.gameOver = function() {
        this.gameRunning = false;
        
        // Update final score
        document.getElementById('final-score').textContent = 'Score: ' + this.ship.score;
        
        // Show game over screen
        document.getElementById('game-over').style.display = 'flex';
    };
    
    // Level complete
    this.levelComplete = function() {
        // Update level score
        document.getElementById('level-score').textContent = 'Score: ' + this.ship.score;
        
        // Show level complete screen
        document.getElementById('level-complete').style.display = 'flex';
    };
    
    // Move to next level
    this.nextLevel = function() {
        this.startLevel(this.level + 1);
    };
    
    // Restart the game
    this.restart = function() {
        // Reset game state
        this.level = 1;
        
        // Reset ship
        this.ship.x = this.shipCanvas.width/2 - ImageRepository.spaceship.width/2;
        this.ship.y = this.shipCanvas.height/4*3 + ImageRepository.spaceship.height;
        this.ship.lives = 3;
        this.ship.score = 0;
        this.ship.invulnerable = false;
        this.ship.weaponLevel = 1;
        
        // Clear all pools
        this.enemyPool.getPool().forEach(function(enemy) {
            enemy.clear();
        });
        this.enemyBulletPool.getPool().forEach(function(bullet) {
            bullet.clear();
        });
        this.ship.bulletPool.getPool().forEach(function(bullet) {
            bullet.clear();
        });
        this.explosionPool.getPool().forEach(function(explosion) {
            explosion.clear();
        });
        this.powerupPool.getPool().forEach(function(powerup) {
            powerup.clear();
        });
        
        // Start the game
        this.gameRunning = true;
        this.startLevel(1);
    };
    
    // Pause the game
    this.pauseGame = function() {
        if (this.gameRunning && !this.isPaused) {
            this.isPaused = true;
            document.getElementById('pause-menu').style.display = 'flex';
        }
    };
    
    // Resume the game
    this.resumeGame = function() {
        if (this.gameRunning && this.isPaused) {
            this.isPaused = false;
            document.getElementById('pause-menu').style.display = 'none';
        }
    };
    
    // Quit the game and return to title screen
    this.quitGame = function() {
        // Reset game state
        this.gameRunning = false;
        this.isPaused = false;
        
        // Hide game UI
        document.querySelectorAll('.game-ui').forEach(function(el) {
            el.style.display = 'none';
        });
        
        // Hide pause menu
        document.getElementById('pause-menu').style.display = 'none';
        
        // Reload the page to return to title screen
        window.location.reload();
    };
}

// Initialize the game when window loads
var game = new Game();

// The keycodes that will be mapped when a user presses a button
KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

// Creates the array to hold the KEY_CODES and sets all their values to false
KEY_STATUS = {};
for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}

// Sets up the document to listen to onkeydown events
document.onkeydown = function(e) {
    // Firefox and opera use charCode instead of keyCode to return which key was pressed
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
}

// Sets up the document to listen to onkeyup events
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
}

// The animation loop
function animate() {
    if (game.gameRunning && !game.isPaused) {
        requestAnimationFrame(animate);
        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyPool.animate();
        game.enemyBulletPool.animate();
        game.explosionPool.animate();
        game.powerupPool.animate();
        game.spawnEnemies();
        game.quadTree.clear();
        game.quadTree.insert({
            x: 0,
            y: 0,
            width: game.mainCanvas.width,
            height: game.mainCanvas.height
        });
        game.detectCollision();
    } else if (game.gameRunning && game.isPaused) {
        requestAnimationFrame(animate);
        // Game is paused, don't update anything
    }
}

// Request Animation Frame shim
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Ensure requestAnimationFrame is defined
window.requestAnimationFrame = window.requestAnimationFrame || window.requestAnimFrame;

// Initialize function called once all images are loaded
function init() {
    // Hide loading screen if it exists
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// Center game on window resize
window.addEventListener('resize', centerGame);
function centerGame() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.top = '50%';
        gameContainer.style.left = '50%';
        gameContainer.style.transform = 'translate(-50%, -50%)';
    }
}
