/**
 * GalaxianEmpire - Main Integration Module
 * Integrates core gameplay with meta-gameplay features
 */

// Initialize all game systems
document.addEventListener('DOMContentLoaded', function() {
    // Create meta-game systems
    window.galaxyMap = new GalaxyMap();
    window.paeSystem = new PAESystem();
    window.reputationSystem = new ReputationSystem();
    
    // Initialize meta-game systems
    galaxyMap.init();
    paeSystem.init();
    reputationSystem.init();
    
    // Add meta-game UI buttons to main menu
    createMetaGameButtons();
    
    // Set up event listeners for game events
    setupGameEventListeners();
});

/**
 * Create meta-game UI buttons in the main menu
 */
function createMetaGameButtons() {
    // Create container for meta-game buttons
    const metaButtonsContainer = document.createElement('div');
    metaButtonsContainer.id = 'meta-buttons-container';
    metaButtonsContainer.style.display = 'none'; // Hidden by default
    document.body.appendChild(metaButtonsContainer);
    
    // Create Galaxy Map button
    const galaxyMapButton = document.createElement('button');
    galaxyMapButton.id = 'galaxy-map-button';
    galaxyMapButton.className = 'meta-game-button';
    galaxyMapButton.innerHTML = '<img src="assets/galaxy-icon.png" alt="Galaxy Map"><span>Galaxy Map</span>';
    galaxyMapButton.addEventListener('click', function() {
        galaxyMap.showMap();
    });
    metaButtonsContainer.appendChild(galaxyMapButton);
    
    // Create Rewards button
    const rewardsButton = document.createElement('button');
    rewardsButton.id = 'rewards-button';
    rewardsButton.className = 'meta-game-button';
    rewardsButton.innerHTML = '<img src="assets/rewards-icon.png" alt="Rewards"><span>Rewards</span>';
    rewardsButton.addEventListener('click', function() {
        paeSystem.showPAE();
    });
    metaButtonsContainer.appendChild(rewardsButton);
    
    // Create Diplomacy button
    const diplomacyButton = document.createElement('button');
    diplomacyButton.id = 'diplomacy-button';
    diplomacyButton.className = 'meta-game-button';
    diplomacyButton.innerHTML = '<img src="assets/diplomacy-icon.png" alt="Diplomacy"><span>Diplomacy</span>';
    diplomacyButton.addEventListener('click', function() {
        reputationSystem.showReputationSystem();
    });
    metaButtonsContainer.appendChild(diplomacyButton);
    
    // Create Return to Game button
    const returnButton = document.createElement('button');
    returnButton.id = 'return-to-game-button';
    returnButton.className = 'meta-game-button';
    returnButton.innerHTML = '<img src="assets/ship-icon.png" alt="Return to Ship"><span>Return to Ship</span>';
    returnButton.addEventListener('click', function() {
        hideMetaGameButtons();
        resumeGame();
    });
    metaButtonsContainer.appendChild(returnButton);
    
    // Add styles for meta-game buttons
    const style = document.createElement('style');
    style.textContent = `
        #meta-buttons-container {
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 10px;
            background: rgba(10, 14, 26, 0.8);
            border-top: 1px solid #2a3a6a;
            z-index: 10;
        }
        
        .meta-game-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: none;
            border: none;
            color: #b8c7e0;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 5px;
        }
        
        .meta-game-button:hover {
            color: #4da6ff;
            transform: scale(1.1);
        }
        
        .meta-game-button img {
            width: 30px;
            height: 30px;
            margin-bottom: 5px;
        }
        
        .meta-game-button span {
            font-size: 12px;
        }
        
        /* Additional icons for meta-game integration */
        .galaxy-icon, .rewards-icon, .diplomacy-icon, .ship-icon {
            width: 24px;
            height: 24px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
    
    // Create additional meta-game icons
    createMetaGameIcons();
}

/**
 * Create meta-game icons
 */
function createMetaGameIcons() {
    // Create galaxy icon
    const galaxyIcon = document.createElement('img');
    galaxyIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRkYTZmZiI+PHBhdGggZD0iTTEyIDJDNi40NyAyIDIgNi40NyAyIDEyczQuNDcgMTAgMTAgMTAgMTAtNC40NyAxMC0xMFMxNy41MyAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxjaXJjbGUgY3g9IjYuNSIgY3k9IjkuNSIgcj0iMS41Ii8+PGNpcmNsZSBjeD0iOS41IiBjeT0iNS41IiByPSIxLjUiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSIxNS41IiByPSIxLjUiLz48Y2lyY2xlIGN4PSIxNC41IiBjeT0iMTYuNSIgcj0iMS41Ii8+PGNpcmNsZSBjeD0iMTYuNSIgY3k9IjkuNSIgcj0iMS41Ii8+PGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjEuNSIvPjwvc3ZnPg==';
    galaxyIcon.id = 'galaxy-icon';
    galaxyIcon.alt = 'Galaxy Map';
    galaxyIcon.style.display = 'none';
    document.body.appendChild(galaxyIcon);
    
    // Create rewards icon
    const rewardsIcon = document.createElement('img');
    rewardsIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmY2M0ZCI+PHBhdGggZD0iTTIwIDZoLTIuMThjLjExLS4zMS4xOC0uNjUuMTgtMSAwLTEuNjYtMS4zNC0zLTMtM2gtNmMtMS42NiAwLTMgMS4zNC0zIDMgMCAuMzUuMDcuNjkuMTggMUg0Yy0xLjExIDAtMS45OS44OS0xLjk5IDJMMyAxOWMwIDEuMTEuODkgMiAyIDJoMTRjMS4xMSAwIDItLjg5IDItMlY4YzAtMS4xMS0uODktMi0yLTJ6bS01LTJjLjU1IDAgMSAuNDUgMSAxcy0uNDUgMS0xIDFoLTZjLS41NSAwLTEtLjQ1LTEtMXMuNDUtMSAxLTFoNnptLTEgMTJoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvc3ZnPg==';
    rewardsIcon.id = 'rewards-icon';
    rewardsIcon.alt = 'Rewards';
    rewardsIcon.style.display = 'none';
    document.body.appendChild(rewardsIcon);
    
    // Create diplomacy icon
    const diplomacyIcon = document.createElement('img');
    diplomacyIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRkZmY3NyI+PHBhdGggZD0iTTE2IDExYzEuNjYgMCAyLjk5LTEuMzQgMi45OS0zUzE3LjY2IDUgMTYgNWMtMS42NiAwLTMgMS4zNC0zIDNzMS4zNCAzIDMgM3ptLTggMGMxLjY2IDAgMi45OS0xLjM0IDIuOTktM1M5LjY2IDUgOCA1QzYuMzQgNSA1IDYuMzQgNSA4czEuMzQgMyAzIDN6bTAgMmMtMi4zMyAwLTcgMS4xNy03IDMuNVYxOWgxNHYtMi41YzAtMi4zMy00LjY3LTMuNS03LTMuNXptOCAwYy0uMjkgMC0uNjIuMDItLjk3LjA1IDEuMTYuODQgMS45NyAxLjk3IDEuOTcgMy40NVYxOWg2di0yLjVjMC0yLjMzLTQuNjctMy41LTctMy41eiIvPjwvc3ZnPg==';
    diplomacyIcon.id = 'diplomacy-icon';
    diplomacyIcon.alt = 'Diplomacy';
    diplomacyIcon.style.display = 'none';
    document.body.appendChild(diplomacyIcon);
    
    // Create ship icon
    const shipIcon = document.createElement('img');
    shipIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2I4YzdlMCI+PHBhdGggZD0iTTIwLjUgM2wtLjE2LjAzTDE1IDUuMSA5IDMgMy4zNiA0Ljk0Yy0uMjEuMDctLjM2LjI1LS4zNi40OFYyMC41YzAgLjI4LjIyLjUuNS41bC4xNi0uMDNMOSAxOC45bDYgMi4xIDUuNjQtMS45NGMuMjEtLjA3LjM2LS4yNS4zNi0uNDhWMy41YzAtLjI4LS4yMi0uNS0uNS0uNXpNMTAgMTUuNWwtNiAyLjA0di05LjU4bDYtMi4xMlYxNS41em04IDBsLTYgMi4wNHYtOS41OGw2LTIuMTJWMTUuNXoiLz48L3N2Zz4=';
    shipIcon.id = 'ship-icon';
    shipIcon.alt = 'Return to Ship';
    shipIcon.style.display = 'none';
    document.body.appendChild(shipIcon);
    
    // Update meta-game buttons with icons
    document.getElementById('galaxy-map-button').querySelector('img').src = galaxyIcon.src;
    document.getElementById('rewards-button').querySelector('img').src = rewardsIcon.src;
    document.getElementById('diplomacy-button').querySelector('img').src = diplomacyIcon.src;
    document.getElementById('return-to-game-button').querySelector('img').src = shipIcon.src;
}

/**
 * Show meta-game buttons
 */
function showMetaGameButtons() {
    document.getElementById('meta-buttons-container').style.display = 'flex';
}

/**
 * Hide meta-game buttons
 */
function hideMetaGameButtons() {
    document.getElementById('meta-buttons-container').style.display = 'none';
}

/**
 * Pause the game and show meta-game interface
 */
function pauseGameForMetaInterface() {
    if (game && game.gameRunning) {
        game.pauseGame();
    }
    showMetaGameButtons();
}

/**
 * Resume the game and hide meta-game interface
 */
function resumeGame() {
    if (game && game.gameRunning && game.isPaused) {
        game.resumeGame();
    }
}

/**
 * Set up event listeners for game events
 */
function setupGameEventListeners() {
    // Listen for game over event
    document.addEventListener('gameOver', function(e) {
        // Update PAE system with score
        if (window.paeSystem) {
            paeSystem.updateMissionProgress('score', e.detail.score);
            paeSystem.addScoreToLeaderboard(e.detail.score);
        }
    });
    
    // Listen for enemy destroyed event
    document.addEventListener('enemyDestroyed', function(e) {
        // Update PAE system
        if (window.paeSystem) {
            paeSystem.updateMissionProgress('enemies', 1);
        }
    });
    
    // Listen for powerup collected event
    document.addEventListener('powerupCollected', function(e) {
        // Update PAE system
        if (window.paeSystem) {
            paeSystem.updateMissionProgress('powerups', 1);
        }
    });
    
    // Listen for level complete event
    document.addEventListener('levelComplete', function(e) {
        // Show meta-game interface after level completion
        setTimeout(function() {
            pauseGameForMetaInterface();
        }, 2000);
    });
    
    // Listen for planet conquered event
    document.addEventListener('planetConquered', function(e) {
        // Update PAE system
        if (window.paeSystem) {
            paeSystem.updateMissionProgress('planets', 1);
        }
        
        // Update reputation system
        if (window.reputationSystem && e.detail.faction) {
            reputationSystem.processReputationEvent('conquest', e.detail.faction, 5);
        }
    });
    
    // Listen for mission completed event
    document.addEventListener('missionCompleted', function(e) {
        // Update PAE system
        if (window.paeSystem) {
            paeSystem.updateMissionProgress('missions', 1);
        }
        
        // Update reputation system if applicable
        if (window.reputationSystem && e.detail.faction) {
            reputationSystem.processReputationEvent('mission', e.detail.faction, 5);
        }
    });
    
    // Add meta-game button to pause menu
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
        const metaGameButton = document.createElement('button');
        metaGameButton.className = 'pause-button';
        metaGameButton.textContent = 'Galaxy Map';
        metaGameButton.addEventListener('click', function() {
            document.getElementById('pause-menu').style.display = 'none';
            pauseGameForMetaInterface();
        });
        
        // Insert before quit button
        const quitButton = document.getElementById('quit-button');
        if (quitButton) {
            pauseMenu.insertBefore(metaGameButton, quitButton);
        } else {
            pauseMenu.appendChild(metaGameButton);
        }
    }
    
    // Modify game over screen to include meta-game options
    const gameOverScreen = document.getElementById('game-over');
    if (gameOverScreen) {
        const metaGameButton = document.createElement('button');
        metaGameButton.id = 'meta-game-button';
        metaGameButton.className = 'meta-ui-button';
        metaGameButton.textContent = 'Galaxy Map';
        metaGameButton.addEventListener('click', function() {
            document.getElementById('game-over').style.display = 'none';
            pauseGameForMetaInterface();
        });
        
        // Insert before restart button
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            gameOverScreen.insertBefore(metaGameButton, restartButton);
        } else {
            gameOverScreen.appendChild(metaGameButton);
        }
    }
    
    // Modify level complete screen to include meta-game options
    const levelCompleteScreen = document.getElementById('level-complete');
    if (levelCompleteScreen) {
        const metaGameButton = document.createElement('button');
        metaGameButton.id = 'meta-game-button-level';
        metaGameButton.className = 'meta-ui-button';
        metaGameButton.textContent = 'Galaxy Map';
        metaGameButton.addEventListener('click', function() {
            document.getElementById('level-complete').style.display = 'none';
            pauseGameForMetaInterface();
        });
        
        // Insert before continue button
        const continueButton = document.getElementById('continue-button');
        if (continueButton) {
            levelCompleteScreen.insertBefore(metaGameButton, continueButton);
        } else {
            levelCompleteScreen.appendChild(metaGameButton);
        }
    }
    
    // Modify the Game object to dispatch custom events
    if (window.Game) {
        // Store original methods
        const originalGameOver = Game.prototype.gameOver;
        const originalLevelComplete = Game.prototype.levelComplete;
        
        // Override gameOver method
        Game.prototype.gameOver = function() {
            // Call original method
            originalGameOver.call(this);
            
            // Dispatch custom event
            const gameOverEvent = new CustomEvent('gameOver', {
                detail: {
                    score: this.ship.score
                }
            });
            document.dispatchEvent(gameOverEvent);
        };
        
        // Override levelComplete method
        Game.prototype.levelComplete = function() {
            // Call original method
            originalLevelComplete.call(this);
            
            // Dispatch custom event
            const levelCompleteEvent = new CustomEvent('levelComplete', {
                detail: {
                    level: this.level,
                    score: this.ship.score
                }
            });
            document.dispatchEvent(levelCompleteEvent);
        };
    }
    
    // Modify the Enemy object to dispatch custom events when destroyed
    if (window.Enemy) {
        // Store original method
        const originalDraw = Enemy.prototype.draw;
        
        // Override draw method
        Enemy.prototype.draw = function() {
            // Check if enemy was not colliding but is now
            const wasNotColliding = !this.isColliding;
            
            // Call original method
            const result = originalDraw.call(this);
            
            // If enemy is now colliding and wasn't before, it was just destroyed
            if (wasNotColliding && this.isColliding) {
                // Dispatch custom event
                const enemyDestroyedEvent = new CustomEvent('enemyDestroyed', {
                    detail: {
                        type: this.type,
                        score: this.score
                    }
                });
                document.dispatchEvent(enemyDestroyedEvent);
            }
            
            return result;
        };
    }
    
    // Modify the PowerUp object to dispatch custom events when collected
    if (window.PowerUp) {
        // Store original method
        const originalDraw = PowerUp.prototype.draw;
        
        // Override draw method
        PowerUp.prototype.draw = function() {
            // Check if powerup was not colliding but is now
            const wasNotColliding = !this.isColliding;
            
            // Call original method
            const result = originalDraw.call(this);
            
            // If powerup is now colliding and wasn't before, it was just collected
            if (wasNotColliding && this.isColliding) {
                // Dispatch custom event
                const powerupCollectedEvent = new CustomEvent('powerupCollected', {
                    detail: {
                        type: this.powerType
                    }
                });
                document.dispatchEvent(powerupCollectedEvent);
            }
            
            return result;
        };
    }
    
    // Add meta-game button to main menu
    document.getElementById('start-game').addEventListener('click', function() {
        // Create meta-game button that appears after game starts
        const metaButton = document.createElement('button');
        metaButton.id = 'meta-button';
        metaButton.className = 'game-ui';
        metaButton.innerHTML = '🌌';
        metaButton.style.position = 'absolute';
        metaButton.style.top = '50px';
        metaButton.style.right = '10px';
        metaButton.style.zIndex = '20';
        metaButton.style.fontSize = '24px';
        metaButton.style.background = 'rgba(20, 30, 60, 0.7)';
        metaButton.style.border = '1px solid #2a3a6a';
        metaButton.style.borderRadius = '50%';
        metaButton.style.width = '40px';
        metaButton.style.height = '40px';
        metaButton.style.display = 'flex';
        metaButton.style.justifyContent = 'center';
        metaButton.style.alignItems = 'center';
        metaButton.style.color = '#4da6ff';
        metaButton.style.cursor = 'pointer';
        
        metaButton.addEventListener('click', function() {
            pauseGameForMetaInterface();
        });
        
        document.body.appendChild(metaButton);
    });
}

// Add daily resource collection from conquered planets
function setupDailyResourceCollection() {
    // Check if a day has passed since last collection
    const lastCollection = localStorage.getItem('lastResourceCollection');
    const now = Date.now();
    
    if (!lastCollection || (now - lastCollection) > 86400000) { // 24 hours in milliseconds
        // Collect resources
        if (window.galaxyMap) {
            galaxyMap.collectPlanetResources();
        }
        
        // Reset daily missions
        if (window.paeSystem) {
            paeSystem.resetDailyMissions();
        }
        
        // Update last collection time
        localStorage.setItem('lastResourceCollection', now);
    }
}

// Call daily resource collection on page load
document.addEventListener('DOMContentLoaded', function() {
    setupDailyResourceCollection();
});

// Export integration functions
window.showMetaGameInterface = pauseGameForMetaInterface;
window.hideMetaGameInterface = resumeGame;
