/**
 * GalaxianEmpire - Telegram Mini-App Integration
 * Handles Telegram platform integration and user data persistence
 */

// Initialize Telegram WebApp
let tg = window.Telegram.WebApp;

// Initialize the Telegram WebApp
document.addEventListener('DOMContentLoaded', function() {
    // Expand the WebApp to full height
    tg.expand();
    
    // Set the main button text and color
    tg.MainButton.setText('PLAY NOW');
    tg.MainButton.setParams({
        text_color: '#FFFFFF',
        color: '#2a3a6a'
    });
    
    // Show the main button
    tg.MainButton.show();
    
    // Add event listener for main button click
    tg.MainButton.onClick(function() {
        // Hide the main button
        tg.MainButton.hide();
        
        // Start the game
        startGame();
    });
    
    // Set theme class based on Telegram theme
    document.body.classList.add(tg.colorScheme === 'dark' ? 'dark-theme' : 'light-theme');
    
    // Load user data from Telegram CloudStorage if available
    loadUserData();
    
    // Add back button event listener
    tg.BackButton.onClick(function() {
        // If in meta-game interface, return to game
        if (document.getElementById('meta-buttons-container').style.display !== 'none') {
            hideMetaGameInterface();
            tg.BackButton.hide();
            return;
        }
        
        // If in game, show confirmation dialog
        if (game && game.gameRunning) {
            showExitConfirmation();
            return;
        }
        
        // Otherwise, close the WebApp
        tg.close();
    });
});

/**
 * Start the game
 */
function startGame() {
    // Hide the main menu
    document.getElementById('main-menu').style.display = 'none';
    
    // Show the game canvas
    document.getElementById('game-canvas').style.display = 'block';
    
    // Initialize the game
    if (window.Game) {
        window.game = new Game();
        game.init();
    }
    
    // Show back button
    tg.BackButton.show();
}

/**
 * Show exit confirmation dialog
 */
function showExitConfirmation() {
    // Pause the game
    if (game && game.gameRunning) {
        game.pauseGame();
    }
    
    // Show confirmation dialog
    tg.showConfirm('Exit game? Your progress will be saved.', function(confirmed) {
        if (confirmed) {
            // Save user data
            saveUserData();
            
            // Close the WebApp
            tg.close();
        } else {
            // Resume the game
            if (game && game.gameRunning && game.isPaused) {
                game.resumeGame();
            }
        }
    });
}

/**
 * Save user data to Telegram CloudStorage
 */
function saveUserData() {
    // Create user data object
    const userData = {
        // Game progress
        score: game ? game.ship.score : 0,
        level: game ? game.level : 1,
        
        // Galaxy map data
        conqueredPlanets: window.galaxyMap ? galaxyMap.conqueredPlanets.map(p => p.id) : [],
        playerFleet: window.galaxyMap ? galaxyMap.playerFleet : [],
        resources: window.galaxyMap ? galaxyMap.resources : {},
        
        // PAE system data
        tokens: window.paeSystem ? paeSystem.tokens : 0,
        achievements: window.paeSystem ? paeSystem.achievements : [],
        dailyMissions: window.paeSystem ? paeSystem.dailyMissions : [],
        
        // Reputation system data
        factions: window.reputationSystem ? reputationSystem.factions : {},
        diplomaticStatus: window.reputationSystem ? reputationSystem.diplomaticStatus : {},
        activeAgreements: window.reputationSystem ? reputationSystem.activeAgreements : [],
        
        // Timestamp
        lastSaved: Date.now()
    };
    
    // Convert to string
    const userDataString = JSON.stringify(userData);
    
    // Save to localStorage as fallback
    localStorage.setItem('galaxianEmpireUserData', userDataString);
    
    // Save to Telegram CloudStorage if available
    if (tg.CloudStorage) {
        tg.CloudStorage.setItem('userData', userDataString, function(error, stored) {
            if (error) {
                console.error('CloudStorage error:', error);
            }
        });
    }
}

/**
 * Load user data from Telegram CloudStorage
 */
function loadUserData() {
    // Try to load from Telegram CloudStorage
    if (tg.CloudStorage) {
        tg.CloudStorage.getItem('userData', function(error, value) {
            if (error) {
                console.error('CloudStorage error:', error);
                // Fall back to localStorage
                loadFromLocalStorage();
            } else if (value) {
                // Parse user data
                try {
                    const userData = JSON.parse(value);
                    applyUserData(userData);
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    // Fall back to localStorage
                    loadFromLocalStorage();
                }
            } else {
                // No data in CloudStorage, fall back to localStorage
                loadFromLocalStorage();
            }
        });
    } else {
        // CloudStorage not available, fall back to localStorage
        loadFromLocalStorage();
    }
}

/**
 * Load user data from localStorage
 */
function loadFromLocalStorage() {
    const userDataString = localStorage.getItem('galaxianEmpireUserData');
    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            applyUserData(userData);
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
        }
    }
}

/**
 * Apply loaded user data to game systems
 */
function applyUserData(userData) {
    // Apply galaxy map data
    if (window.galaxyMap && userData.resources) {
        // Restore resources
        galaxyMap.resources = userData.resources;
        
        // Restore conquered planets
        if (userData.conqueredPlanets && userData.conqueredPlanets.length > 0) {
            for (const planetId of userData.conqueredPlanets) {
                // Find planet in sectors
                for (const sector of galaxyMap.sectors) {
                    const planet = sector.planets.find(p => p.id === planetId);
                    if (planet) {
                        planet.conquered = true;
                        planet.controllingFaction = "Earth Federation";
                        galaxyMap.conqueredPlanets.push(planet);
                    }
                }
            }
        }
        
        // Restore player fleet
        if (userData.playerFleet) {
            galaxyMap.playerFleet = userData.playerFleet;
        }
    }
    
    // Apply PAE system data
    if (window.paeSystem) {
        if (userData.tokens) {
            paeSystem.tokens = userData.tokens;
        }
        
        if (userData.achievements) {
            paeSystem.achievements = userData.achievements;
        }
        
        if (userData.dailyMissions) {
            paeSystem.dailyMissions = userData.dailyMissions;
        }
    }
    
    // Apply reputation system data
    if (window.reputationSystem) {
        if (userData.factions) {
            reputationSystem.factions = userData.factions;
        }
        
        if (userData.diplomaticStatus) {
            reputationSystem.diplomaticStatus = userData.diplomaticStatus;
        }
        
        if (userData.activeAgreements) {
            reputationSystem.activeAgreements = userData.activeAgreements;
        }
    }
    
    // Update UI if needed
    updateUIWithUserData();
}

/**
 * Update UI with loaded user data
 */
function updateUIWithUserData() {
    // Update galaxy map UI
    if (window.galaxyMap) {
        galaxyMap.updateResourceDisplay();
    }
    
    // Update PAE system UI
    if (window.paeSystem) {
        paeSystem.updateTokenDisplay();
    }
    
    // Update reputation system UI
    if (window.reputationSystem) {
        reputationSystem.updateFactionList();
    }
    
    // Add continue game button if user has played before
    addContinueGameButton();
}

/**
 * Add continue game button if user has played before
 */
function addContinueGameButton() {
    const mainMenu = document.getElementById('main-menu');
    const startButton = document.getElementById('start-game');
    
    if (mainMenu && startButton) {
        // Check if user has played before
        const hasPlayedBefore = localStorage.getItem('galaxianEmpireUserData') !== null;
        
        if (hasPlayedBefore && !document.getElementById('continue-game')) {
            // Create continue game button
            const continueButton = document.createElement('button');
            continueButton.id = 'continue-game';
            continueButton.className = 'menu-button';
            continueButton.textContent = 'CONTINUE GAME';
            
            // Add click event
            continueButton.addEventListener('click', function() {
                startGame();
            });
            
            // Insert before start button
            mainMenu.insertBefore(continueButton, startButton);
            
            // Update start button text
            startButton.textContent = 'NEW GAME';
        }
    }
}

/**
 * Share game with friends
 */
function shareGame() {
    if (tg.showScanQrPopup) {
        tg.showScanQrPopup({
            text: 'Scan to play GalaxianEmpire!'
        });
    } else {
        // Fallback for older Telegram versions
        tg.openLink('https://t.me/share/url?url=' + encodeURIComponent('https://t.me/galaxianempire_bot'));
    }
}

/**
 * Show haptic feedback
 */
function hapticFeedback(type) {
    if (tg.HapticFeedback) {
        switch (type) {
            case 'light':
                tg.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                tg.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                tg.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                tg.HapticFeedback.notificationOccurred('error');
                break;
        }
    }
}

/**
 * Add Telegram-specific UI elements
 */
function addTelegramUI() {
    // Add share button to main menu
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        const shareButton = document.createElement('button');
        shareButton.id = 'share-game';
        shareButton.className = 'menu-button share-button';
        shareButton.innerHTML = '<span>SHARE WITH FRIENDS</span>';
        
        // Add click event
        shareButton.addEventListener('click', function() {
            shareGame();
        });
        
        // Add to main menu
        mainMenu.appendChild(shareButton);
    }
    
    // Add Telegram theme styles
    const style = document.createElement('style');
    style.textContent = `
        /* Telegram theme integration */
        body.dark-theme {
            --bg-color: #1f2836;
            --text-color: #ffffff;
            --button-color: #2a3a6a;
            --button-text-color: #ffffff;
            --accent-color: #4da6ff;
        }
        
        body.light-theme {
            --bg-color: #f0f2f5;
            --text-color: #000000;
            --button-color: #4da6ff;
            --button-text-color: #ffffff;
            --accent-color: #2a3a6a;
        }
        
        /* Telegram-specific UI elements */
        .share-button {
            background: linear-gradient(135deg, #2a3a6a 0%, #4da6ff 100%);
            margin-top: 20px;
        }
        
        /* Responsive design for different device sizes */
        @media (max-width: 360px) {
            .menu-button {
                width: 90%;
                font-size: 14px;
            }
            
            #game-title {
                font-size: 24px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add auto-save functionality
    setInterval(function() {
        if (game && game.gameRunning) {
            saveUserData();
        }
    }, 60000); // Auto-save every minute
}

// Call addTelegramUI on page load
document.addEventListener('DOMContentLoaded', function() {
    addTelegramUI();
});

// Add event listeners for Telegram-specific events
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // App is going to background, save data
        saveUserData();
        
        // Pause game if running
        if (game && game.gameRunning && !game.isPaused) {
            game.pauseGame();
        }
    }
});

// Override game events to add haptic feedback
if (window.Game) {
    // Store original methods
    const originalEnemyHit = Game.prototype.enemyHit;
    const originalPowerupCollected = Game.prototype.powerupCollected;
    const originalGameOver = Game.prototype.gameOver;
    const originalLevelComplete = Game.prototype.levelComplete;
    
    // Override enemyHit method
    Game.prototype.enemyHit = function(enemy, bullet) {
        // Call original method
        const result = originalEnemyHit.call(this, enemy, bullet);
        
        // Add haptic feedback
        hapticFeedback('light');
        
        return result;
    };
    
    // Override powerupCollected method
    Game.prototype.powerupCollected = function(powerup) {
        // Call original method
        const result = originalPowerupCollected.call(this, powerup);
        
        // Add haptic feedback
        hapticFeedback('medium');
        
        return result;
    };
    
    // Override gameOver method
    Game.prototype.gameOver = function() {
        // Call original method
        const result = originalGameOver.call(this);
        
        // Add haptic feedback
        hapticFeedback('error');
        
        // Save user data
        saveUserData();
        
        return result;
    };
    
    // Override levelComplete method
    Game.prototype.levelComplete = function() {
        // Call original method
        const result = originalLevelComplete.call(this);
        
        // Add haptic feedback
        hapticFeedback('success');
        
        // Save user data
        saveUserData();
        
        return result;
    };
}

// Export Telegram integration functions
window.shareGame = shareGame;
window.saveUserData = saveUserData;
window.loadUserData = loadUserData;
