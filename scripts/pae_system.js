/**
 * GalaxianEmpire - Play and Earn (PAE) Module
 * Handles token rewards, achievements, and daily missions
 */

class PAESystem {
    constructor() {
        // Player token balance
        this.tokens = 0;
        
        // Achievement tracking
        this.achievements = [];
        
        // Daily missions
        this.dailyMissions = [];
        
        // Leaderboard data
        this.leaderboard = [];
        
        // UI elements
        this.paeContainer = null;
        this.tokenDisplay = null;
        this.missionsPanel = null;
        this.achievementsPanel = null;
        this.leaderboardPanel = null;
        
        // Current view
        this.currentView = 'missions'; // missions, achievements, leaderboard, shop
    }
    
    /**
     * Initialize the PAE system
     */
    init() {
        // Create UI elements
        this.createUI();
        
        // Generate achievements
        this.generateAchievements();
        
        // Generate daily missions
        this.generateDailyMissions();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateTokenDisplay();
        this.updateMissionsPanel();
        
        return true;
    }
    
    /**
     * Create UI elements for the PAE system
     */
    createUI() {
        // Create container
        const container = document.createElement('div');
        container.id = 'pae-container';
        container.style.display = 'none'; // Hidden by default
        document.body.appendChild(container);
        this.paeContainer = container;
        
        // Create token display
        const tokenDisplay = document.createElement('div');
        tokenDisplay.id = 'token-display';
        tokenDisplay.className = 'pae-ui-panel';
        container.appendChild(tokenDisplay);
        this.tokenDisplay = tokenDisplay;
        
        // Create main content panel
        const contentPanel = document.createElement('div');
        contentPanel.id = 'pae-content';
        contentPanel.className = 'pae-ui-panel';
        container.appendChild(contentPanel);
        
        // Create missions panel
        const missionsPanel = document.createElement('div');
        missionsPanel.id = 'missions-panel';
        missionsPanel.className = 'pae-content-panel';
        contentPanel.appendChild(missionsPanel);
        this.missionsPanel = missionsPanel;
        
        // Create achievements panel
        const achievementsPanel = document.createElement('div');
        achievementsPanel.id = 'achievements-panel';
        achievementsPanel.className = 'pae-content-panel';
        achievementsPanel.style.display = 'none';
        contentPanel.appendChild(achievementsPanel);
        this.achievementsPanel = achievementsPanel;
        
        // Create leaderboard panel
        const leaderboardPanel = document.createElement('div');
        leaderboardPanel.id = 'leaderboard-panel';
        leaderboardPanel.className = 'pae-content-panel';
        leaderboardPanel.style.display = 'none';
        contentPanel.appendChild(leaderboardPanel);
        this.leaderboardPanel = leaderboardPanel;
        
        // Create shop panel
        const shopPanel = document.createElement('div');
        shopPanel.id = 'shop-panel';
        shopPanel.className = 'pae-content-panel';
        shopPanel.style.display = 'none';
        contentPanel.appendChild(shopPanel);
        this.shopPanel = shopPanel;
        
        // Create navigation buttons
        const navButtons = document.createElement('div');
        navButtons.id = 'pae-nav-buttons';
        navButtons.className = 'pae-ui-panel';
        
        const missionsButton = document.createElement('button');
        missionsButton.id = 'missions-button';
        missionsButton.className = 'pae-nav-button active';
        missionsButton.textContent = 'Daily Missions';
        missionsButton.addEventListener('click', () => this.switchView('missions'));
        navButtons.appendChild(missionsButton);
        
        const achievementsButton = document.createElement('button');
        achievementsButton.id = 'achievements-button';
        achievementsButton.className = 'pae-nav-button';
        achievementsButton.textContent = 'Achievements';
        achievementsButton.addEventListener('click', () => this.switchView('achievements'));
        navButtons.appendChild(achievementsButton);
        
        const leaderboardButton = document.createElement('button');
        leaderboardButton.id = 'leaderboard-button';
        leaderboardButton.className = 'pae-nav-button';
        leaderboardButton.textContent = 'Leaderboard';
        leaderboardButton.addEventListener('click', () => this.switchView('leaderboard'));
        navButtons.appendChild(leaderboardButton);
        
        const shopButton = document.createElement('button');
        shopButton.id = 'shop-button';
        shopButton.className = 'pae-nav-button';
        shopButton.textContent = 'Token Shop';
        shopButton.addEventListener('click', () => this.switchView('shop'));
        navButtons.appendChild(shopButton);
        
        container.appendChild(navButtons);
        
        // Create back button
        const backButton = document.createElement('button');
        backButton.id = 'back-from-pae';
        backButton.className = 'pae-ui-button';
        backButton.textContent = 'Return to Game';
        backButton.addEventListener('click', () => this.hidePAE());
        container.appendChild(backButton);
        
        // Add styles for PAE UI
        const style = document.createElement('style');
        style.textContent = `
            #pae-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 10, 30, 0.95);
                z-index: 50;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
            }
            
            .pae-ui-panel {
                width: 340px;
                background: rgba(20, 30, 60, 0.8);
                border: 1px solid #2a3a6a;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
                color: #b8c7e0;
            }
            
            #token-display {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
                font-weight: bold;
                color: #ffcc4d;
            }
            
            .token-icon {
                width: 24px;
                height: 24px;
                margin-right: 10px;
                background: #ffcc4d;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #1a2a4a;
                font-weight: bold;
            }
            
            #pae-content {
                height: 400px;
                overflow-y: auto;
                padding: 0;
            }
            
            .pae-content-panel {
                padding: 10px;
                height: 100%;
                overflow-y: auto;
            }
            
            #pae-nav-buttons {
                display: flex;
                justify-content: space-between;
                padding: 5px;
            }
            
            .pae-nav-button {
                background: #1a2a4a;
                color: #b8c7e0;
                border: 1px solid #2a3a6a;
                border-radius: 3px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
            }
            
            .pae-nav-button.active {
                background: #2a3a6a;
                color: #ffffff;
                border-color: #4da6ff;
            }
            
            .pae-ui-button {
                background: linear-gradient(135deg, #2a3a6a 0%, #4da6ff 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 10px rgba(77, 166, 255, 0.5);
                margin-top: 10px;
            }
            
            .pae-ui-button:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(77, 166, 255, 0.8);
            }
            
            .mission-item, .achievement-item, .leaderboard-item, .shop-item {
                background: rgba(30, 40, 70, 0.8);
                border: 1px solid #2a3a6a;
                border-radius: 3px;
                padding: 10px;
                margin-bottom: 10px;
            }
            
            .mission-item:hover, .achievement-item:hover, .shop-item:hover {
                background: rgba(40, 50, 80, 0.8);
                border-color: #4da6ff;
            }
            
            .mission-header, .achievement-header, .shop-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            
            .mission-title, .achievement-title, .shop-item-title {
                font-weight: bold;
                color: #4da6ff;
            }
            
            .mission-reward, .achievement-reward, .shop-item-price {
                color: #ffcc4d;
                font-weight: bold;
            }
            
            .mission-description, .achievement-description, .shop-item-description {
                margin-bottom: 10px;
                font-size: 12px;
            }
            
            .mission-progress, .achievement-progress {
                height: 10px;
                background: #1a2a4a;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .mission-progress-fill, .achievement-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4da6ff 0%, #4dff77 100%);
            }
            
            .mission-status, .achievement-status {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
            }
            
            .mission-claim, .shop-item-buy {
                background: linear-gradient(135deg, #2a6a3a 0%, #4dff77 100%);
                color: white;
                border: none;
                border-radius: 3px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .mission-claim:disabled, .shop-item-buy:disabled {
                background: #1a2a4a;
                color: #5a6a8a;
                cursor: not-allowed;
            }
            
            .leaderboard-item {
                display: flex;
                align-items: center;
            }
            
            .leaderboard-rank {
                width: 30px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
            }
            
            .leaderboard-player {
                flex-grow: 1;
                padding: 0 10px;
            }
            
            .leaderboard-score {
                font-weight: bold;
                color: #4da6ff;
            }
            
            .top-rank {
                color: #ffcc4d;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Generate achievements
     */
    generateAchievements() {
        this.achievements = [
            {
                id: 'score_1000',
                title: 'Rookie Pilot',
                description: 'Score 1,000 points in a single game',
                reward: 50,
                progress: 0,
                target: 1000,
                completed: false
            },
            {
                id: 'score_5000',
                title: 'Skilled Pilot',
                description: 'Score 5,000 points in a single game',
                reward: 100,
                progress: 0,
                target: 5000,
                completed: false
            },
            {
                id: 'score_10000',
                title: 'Ace Pilot',
                description: 'Score 10,000 points in a single game',
                reward: 200,
                progress: 0,
                target: 10000,
                completed: false
            },
            {
                id: 'enemies_100',
                title: 'Defender',
                description: 'Destroy 100 enemy ships',
                reward: 50,
                progress: 0,
                target: 100,
                completed: false
            },
            {
                id: 'enemies_500',
                title: 'Protector',
                description: 'Destroy 500 enemy ships',
                reward: 100,
                progress: 0,
                target: 500,
                completed: false
            },
            {
                id: 'enemies_1000',
                title: 'Guardian',
                description: 'Destroy 1,000 enemy ships',
                reward: 200,
                progress: 0,
                target: 1000,
                completed: false
            },
            {
                id: 'planets_1',
                title: 'Colonizer',
                description: 'Conquer your first planet',
                reward: 100,
                progress: 0,
                target: 1,
                completed: false
            },
            {
                id: 'planets_5',
                title: 'Governor',
                description: 'Conquer 5 planets',
                reward: 200,
                progress: 0,
                target: 5,
                completed: false
            },
            {
                id: 'planets_10',
                title: 'Emperor',
                description: 'Conquer 10 planets',
                reward: 500,
                progress: 0,
                target: 10,
                completed: false
            },
            {
                id: 'fleet_3',
                title: 'Squadron Leader',
                description: 'Build a fleet of 3 ships',
                reward: 150,
                progress: 0,
                target: 3,
                completed: false
            },
            {
                id: 'fleet_5',
                title: 'Fleet Commander',
                description: 'Build a fleet of 5 ships',
                reward: 300,
                progress: 0,
                target: 5,
                completed: false
            },
            {
                id: 'missions_10',
                title: 'Mission Specialist',
                description: 'Complete 10 missions',
                reward: 100,
                progress: 0,
                target: 10,
                completed: false
            },
            {
                id: 'reputation_75',
                title: 'Diplomat',
                description: 'Reach 75 reputation with any faction',
                reward: 200,
                progress: 0,
                target: 75,
                completed: false
            }
        ];
    }
    
    /**
     * Generate daily missions
     */
    generateDailyMissions() {
        // Clear existing missions
        this.dailyMissions = [];
        
        // Mission templates
        const missionTemplates = [
            {
                type: 'score',
                title: 'Score Points',
                description: 'Score {target} points in arcade mode',
                targetMin: 1000,
                targetMax: 5000,
                rewardMin: 10,
                rewardMax: 50
            },
            {
                type: 'enemies',
                title: 'Destroy Enemies',
                description: 'Destroy {target} enemy ships',
                targetMin: 20,
                targetMax: 100,
                rewardMin: 10,
                rewardMax: 50
            },
            {
                type: 'survival',
                title: 'Survive Waves',
                description: 'Survive {target} waves without losing a life',
                targetMin: 3,
                targetMax: 10,
                rewardMin: 15,
                rewardMax: 60
            },
            {
                type: 'powerups',
                title: 'Collect Powerups',
                description: 'Collect {target} powerups',
                targetMin: 3,
                targetMax: 15,
                rewardMin: 10,
                rewardMax: 40
            },
            {
                type: 'missions',
                title: 'Complete Missions',
                description: 'Complete {target} fleet missions',
                targetMin: 1,
                targetMax: 5,
                rewardMin: 20,
                rewardMax: 80
            }
        ];
        
        // Generate 3 random missions
        const missionCount = 3;
        const usedTypes = new Set();
        
        for (let i = 0; i < missionCount; i++) {
            // Select a random mission template that hasn't been used yet
            let templateIndex;
            do {
                templateIndex = Math.floor(Math.random() * missionTemplates.length);
            } while (usedTypes.has(missionTemplates[templateIndex].type) && usedTypes.size < missionTemplates.length);
            
            const template = missionTemplates[templateIndex];
            usedTypes.add(template.type);
            
            // Generate random target and reward values
            const target = Math.floor(Math.random() * (template.targetMax - template.targetMin + 1)) + template.targetMin;
            const reward = Math.floor(Math.random() * (template.rewardMax - template.rewardMin + 1)) + template.rewardMin;
            
            // Create mission
            const mission = {
                id: `daily_${template.type}_${Date.now()}_${i}`,
                type: template.type,
                title: template.title,
                description: template.description.replace('{target}', target),
                reward: reward,
                progress: 0,
                target: target,
                completed: false,
                claimed: false
            };
            
            this.dailyMissions.push(mission);
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // No additional event listeners needed here
        // Mission claim buttons are added dynamically when updating the missions panel
    }
    
    /**
     * Update token display
     */
    updateTokenDisplay() {
        this.tokenDisplay.innerHTML = `
            <div class="token-icon">T</div>
            <div class="token-value">${this.tokens} Tokens</div>
        `;
    }
    
    /**
     * Update missions panel
     */
    updateMissionsPanel() {
        this.missionsPanel.innerHTML = '<h3>Daily Missions</h3>';
        
        if (this.dailyMissions.length === 0) {
            this.missionsPanel.innerHTML += '<p>No missions available. Check back tomorrow!</p>';
            return;
        }
        
        const missionList = document.createElement('div');
        missionList.className = 'mission-list';
        
        for (const mission of this.dailyMissions) {
            const missionItem = document.createElement('div');
            missionItem.className = 'mission-item';
            
            const progressPercent = Math.min(100, Math.floor((mission.progress / mission.target) * 100));
            const isCompleted = mission.progress >= mission.target;
            
            missionItem.innerHTML = `
                <div class="mission-header">
                    <div class="mission-title">${mission.title}</div>
                    <div class="mission-reward">${mission.reward} Tokens</div>
                </div>
                <div class="mission-description">${mission.description}</div>
                <div class="mission-progress">
                    <div class="mission-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="mission-status">
                    <div class="mission-progress-text">${mission.progress}/${mission.target}</div>
                    <div class="mission-completion">${isCompleted ? 'Completed!' : 'In Progress'}</div>
                </div>
            `;
            
            // Add claim button if completed and not claimed
            if (isCompleted && !mission.claimed) {
                const claimButton = document.createElement('button');
                claimButton.className = 'mission-claim';
                claimButton.textContent = 'Claim Reward';
                claimButton.addEventListener('click', () => this.claimMissionReward(mission));
                missionItem.appendChild(claimButton);
            } else if (mission.claimed) {
                const claimedText = document.createElement('div');
                claimedText.className = 'mission-claimed';
                claimedText.textContent = 'Reward Claimed';
                missionItem.appendChild(claimedText);
            }
            
            missionList.appendChild(missionItem);
        }
        
        this.missionsPanel.appendChild(missionList);
    }
    
    /**
     * Update achievements panel
     */
    updateAchievementsPanel() {
        this.achievementsPanel.innerHTML = '<h3>Achievements</h3>';
        
        const achievementList = document.createElement('div');
        achievementList.className = 'achievement-list';
        
        // Sort achievements: completed last
        const sortedAchievements = [...this.achievements].sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return 0;
        });
        
        for (const achievement of sortedAchievements) {
            const achievementItem = document.createElement('div');
            achievementItem.className = 'achievement-item';
            
            const progressPercent = Math.min(100, Math.floor((achievement.progress / achievement.target) * 100));
            
            achievementItem.innerHTML = `
                <div class="achievement-header">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-reward">${achievement.reward} Tokens</div>
                </div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-progress">
                    <div class="achievement-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="achievement-status">
                    <div class="achievement-progress-text">${achievement.progress}/${achievement.target}</div>
                    <div class="achievement-completion">${achievement.completed ? 'Completed!' : 'In Progress'}</div>
                </div>
            `;
            
            achievementList.appendChild(achievementItem);
        }
        
        this.achievementsPanel.appendChild(achievementList);
    }
    
    /**
     * Update leaderboard panel
     */
    updateLeaderboardPanel() {
        this.leaderboardPanel.innerHTML = '<h3>Weekly Leaderboard</h3>';
        
        // Generate mock leaderboard data if empty
        if (this.leaderboard.length === 0) {
            this.generateMockLeaderboard();
        }
        
        const leaderboardList = document.createElement('div');
        leaderboardList.className = 'leaderboard-list';
        
        for (let i = 0; i < this.leaderboard.length; i++) {
            const player = this.leaderboard[i];
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            
            // Highlight top 3 ranks
            const rankClass = i < 3 ? 'top-rank' : '';
            
            leaderboardItem.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${i + 1}</div>
                <div class="leaderboard-player">${player.name}</div>
                <div class="leaderboard-score">${player.score}</div>
            `;
            
            leaderboardList.appendChild(leaderboardItem);
        }
        
        this.leaderboardPanel.appendChild(leaderboardList);
        
        // Add prize pool information
        const prizeInfo = document.createElement('div');
        prizeInfo.className = 'prize-info';
        prizeInfo.innerHTML = `
            <h4>Prize Pool</h4>
            <p>1st Place: 1000 Tokens</p>
            <p>2nd Place: 500 Tokens</p>
            <p>3rd Place: 250 Tokens</p>
            <p>4th-10th Place: 100 Tokens</p>
            <p class="prize-time">Rewards distributed in 3 days</p>
        `;
        
        this.leaderboardPanel.appendChild(prizeInfo);
    }
    
    /**
     * Update shop panel
     */
    updateShopPanel() {
        this.shopPanel.innerHTML = '<h3>Token Shop</h3>';
        
        const shopItems = [
            {
                id: 'ship_skin_1',
                title: 'Nebula Glider Skin',
                description: 'A sleek blue and purple skin for your ship',
                price: 500,
                image: '🚀'
            },
            {
                id: 'ship_skin_2',
                title: 'Inferno Racer Skin',
                description: 'A fiery red and orange skin for your ship',
                price: 500,
                image: '🚀'
            },
            {
                id: 'special_ability',
                title: 'Time Warp Ability',
                description: 'Slow down time for 5 seconds during gameplay',
                price: 1000,
                image: '⏱️'
            },
            {
                id: 'resource_booster',
                title: 'Resource Booster',
                description: 'Increase resource generation by 50% for 24 hours',
                price: 300,
                image: '📈'
            },
            {
                id: 'extra_life',
                title: 'Extra Life Pack',
                description: 'Start each game with an additional life',
                price: 750,
                image: '❤️'
            }
        ];
        
        const shopList = document.createElement('div');
        shopList.className = 'shop-list';
        
        for (const item of shopItems) {
            const shopItem = document.createElement('div');
            shopItem.className = 'shop-item';
            
            shopItem.innerHTML = `
                <div class="shop-item-header">
                    <div class="shop-item-title">${item.title}</div>
                    <div class="shop-item-price">${item.price} Tokens</div>
                </div>
                <div class="shop-item-content">
                    <div class="shop-item-image">${item.image}</div>
                    <div class="shop-item-description">${item.description}</div>
                </div>
            `;
            
            // Add buy button
            const buyButton = document.createElement('button');
            buyButton.className = 'shop-item-buy';
            buyButton.textContent = 'Purchase';
            buyButton.disabled = this.tokens < item.price;
            buyButton.addEventListener('click', () => this.purchaseItem(item));
            shopItem.appendChild(buyButton);
            
            shopList.appendChild(shopItem);
        }
        
        this.shopPanel.appendChild(shopList);
    }
    
    /**
     * Switch between different views
     */
    switchView(view) {
        this.currentView = view;
        
        // Hide all panels
        this.missionsPanel.style.display = 'none';
        this.achievementsPanel.style.display = 'none';
        this.leaderboardPanel.style.display = 'none';
        this.shopPanel.style.display = 'none';
        
        // Show selected panel
        switch (view) {
            case 'missions':
                this.missionsPanel.style.display = 'block';
                this.updateMissionsPanel();
                break;
            case 'achievements':
                this.achievementsPanel.style.display = 'block';
                this.updateAchievementsPanel();
                break;
            case 'leaderboard':
                this.leaderboardPanel.style.display = 'block';
                this.updateLeaderboardPanel();
                break;
            case 'shop':
                this.shopPanel.style.display = 'block';
                this.updateShopPanel();
                break;
        }
        
        // Update active button
        document.querySelectorAll('.pae-nav-button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${view}-button`).classList.add('active');
    }
    
    /**
     * Show the PAE interface
     */
    showPAE() {
        document.getElementById('pae-container').style.display = 'flex';
        this.switchView(this.currentView);
    }
    
    /**
     * Hide the PAE interface
     */
    hidePAE() {
        document.getElementById('pae-container').style.display = 'none';
    }
    
    /**
     * Update mission progress
     */
    updateMissionProgress(type, amount) {
        // Update daily missions
        for (const mission of this.dailyMissions) {
            if (mission.type === type && !mission.completed) {
                mission.progress = Math.min(mission.target, mission.progress + amount);
                if (mission.progress >= mission.target) {
                    mission.completed = true;
                    this.showNotification(`Mission Completed: ${mission.title}`);
                }
            }
        }
        
        // Update achievements
        for (const achievement of this.achievements) {
            if (achievement.id.startsWith(type) && !achievement.completed) {
                achievement.progress = Math.min(achievement.target, achievement.progress + amount);
                if (achievement.progress >= achievement.target) {
                    achievement.completed = true;
                    this.tokens += achievement.reward;
                    this.showNotification(`Achievement Unlocked: ${achievement.title}`);
                }
            }
        }
        
        // Update UI if visible
        if (document.getElementById('pae-container').style.display !== 'none') {
            this.updateTokenDisplay();
            if (this.currentView === 'missions') {
                this.updateMissionsPanel();
            } else if (this.currentView === 'achievements') {
                this.updateAchievementsPanel();
            }
        }
    }
    
    /**
     * Claim mission reward
     */
    claimMissionReward(mission) {
        if (mission.completed && !mission.claimed) {
            mission.claimed = true;
            this.tokens += mission.reward;
            this.showNotification(`Claimed ${mission.reward} Tokens from mission!`);
            
            // Update UI
            this.updateTokenDisplay();
            this.updateMissionsPanel();
        }
    }
    
    /**
     * Purchase item from shop
     */
    purchaseItem(item) {
        if (this.tokens >= item.price) {
            this.tokens -= item.price;
            this.showNotification(`Purchased ${item.title}!`);
            
            // Apply item effect (would be implemented in the main game)
            
            // Update UI
            this.updateTokenDisplay();
            this.updateShopPanel();
        } else {
            this.showNotification('Not enough tokens!', true);
        }
    }
    
    /**
     * Generate mock leaderboard data
     */
    generateMockLeaderboard() {
        const names = [
            'StarLord', 'CosmicQueen', 'GalaxyRider', 'NebulaNinja', 
            'AstroAce', 'VoidVoyager', 'PlanetPunisher', 'SolarSurfer',
            'MeteorMaster', 'OrbitOutlaw', 'CelestialSage', 'NovaKnight',
            'Player', 'CosmicCrusader', 'StarStriker'
        ];
        
        this.leaderboard = [];
        
        // Add player at a random position in top 10
        const playerPosition = Math.floor(Math.random() * 5) + 3; // Position 3-7
        
        for (let i = 0; i < 15; i++) {
            let name;
            let score;
            
            if (i === playerPosition) {
                name = 'You';
                score = 15000 - (i * 1000) + Math.floor(Math.random() * 500);
            } else {
                name = names[i];
                score = 20000 - (i * 1000) + Math.floor(Math.random() * 500);
            }
            
            this.leaderboard.push({
                name: name,
                score: score
            });
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, isError = false) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('pae-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'pae-notification';
            document.body.appendChild(notification);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #pae-notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(20, 30, 60, 0.9);
                    border: 1px solid #2a3a6a;
                    border-radius: 5px;
                    padding: 10px 20px;
                    color: #ffffff;
                    font-weight: bold;
                    z-index: 100;
                    transition: all 0.3s ease;
                    opacity: 0;
                    pointer-events: none;
                }
                
                #pae-notification.show {
                    opacity: 1;
                }
                
                #pae-notification.error {
                    background: rgba(60, 20, 20, 0.9);
                    border-color: #6a2a2a;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set notification content and show
        notification.textContent = message;
        notification.className = isError ? 'error show' : 'show';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.className = '';
        }, 3000);
    }
    
    /**
     * Add score to leaderboard
     */
    addScoreToLeaderboard(score) {
        // In a real implementation, this would send the score to a server
        // For now, we'll just update the mock leaderboard
        const playerEntry = this.leaderboard.find(entry => entry.name === 'You');
        if (playerEntry) {
            if (score > playerEntry.score) {
                playerEntry.score = score;
                this.leaderboard.sort((a, b) => b.score - a.score);
                this.showNotification('New high score recorded!');
            }
        }
    }
    
    /**
     * Reset daily missions
     * Should be called once per day
     */
    resetDailyMissions() {
        this.generateDailyMissions();
        this.showNotification('New daily missions available!');
        
        // Update UI if visible
        if (document.getElementById('pae-container').style.display !== 'none' && this.currentView === 'missions') {
            this.updateMissionsPanel();
        }
    }
}

// Export the PAESystem class
window.PAESystem = PAESystem;
