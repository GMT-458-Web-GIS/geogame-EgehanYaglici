## Below parts belong final version of the game 

#### Final Game Link: https://gmt-458-web-gis.github.io/geogame-EgehanYaglici/
#### Game Play Video Link (example): https://www.youtube.com/watch?v=N-K88tPyVBY

---

### Read Me First! 😊
The **final version** of the game has removed the **'Energy'** mechanic and introduced the **'Dice Roll'** system, which adds a layer of randomness and strategy. The dice roll mechanic includes **25 different effects**, impacting attack, defense, range, and health. 

The **Current Status** section was also added to track unit health, attack power, and range, providing players with crucial information during gameplay. 

**Note:** 
- Not included the final version’s screenshots here since the game is available to play live via a link. Instead, we retained the initial design's demo images below to compare the final implementation with its conceptual design. 
- The differences highlight the design changes made during development.

---

## Additional Details for Final Version  

### Describe **three event handlers** you implemented in your repo part

1. **Unit Selection Event** (player.js):  
   - **Event Trigger**: A `click` event is attached to unit markers on the map. When the user clicks on a unit marker, it becomes the active unit for route planning or mobilization.  
   - **Code Example**:  
     ```javascript
     unitMarker.on('click', () => {
       selectSquad(unitMarker, squad, index);
       alert(`You have selected ${squad.type.charAt(0).toUpperCase() + squad.type.slice(1)} Squad ${squad.id}.`);
     });
     ```
   - **Purpose**: This interaction ensures a seamless way to select units, enhancing the user experience during route planning and unit mobilization.

2. **Start Battle Event** (combat.js):  
   - **Event Trigger**: The "Start Battle" button (`onclick`) initializes the battle system, automatically rolling dice and advancing the game through multiple rounds until one side is victorious.  
   - **Code Example**:  
     ```javascript
     function startBattle() {
       if (isBattleOngoing) return;

       isBattleOngoing = true;
       updateBattleLog("Battle started!");
       executeRound();
     }
     ```
   - **Purpose**: This serves as the starting point for the combat phase, ensuring the game progresses automatically through dice rolls and attack rounds.

3. **Tutorial Navigation Event** (tutorial.js):  
   - **Event Trigger**: A `click` event on the "Next" button moves the tutorial to the next step, updating the highlights and tutorial text dynamically.  
   - **Code Example**:  
     ```javascript
     document.getElementById("tutorial-next").addEventListener("click", () => {
       currentStep++;
       showTutorialStep();
     });
     ```
   - **Purpose**: Provides a user-friendly guide to the game, allowing players to learn mechanics step-by-step interactively.

---

### Describe how you benefited from **closures** in your project part

Closures were utilized to encapsulate functionality and maintain state in dynamic contexts. For instance, closures allowed the dice rolling mechanism to remain modular, with private access to dice effects.  

- **Example**: The `rollDice()` function uses closures to encapsulate the effects for each dice value.  
   ```javascript
   function rollDice() {
     const effects = {
       1: ["Penalty", "Range Reduction", "Minor Penalty", "Major Penalty"],
       2: ["Shield Block", "Health Boost", "Shield Wall", "Minor Health Boost"],
       // Additional dice effects...
     };
     return Math.floor(Math.random() * 6) + 1;
   }

### Describe what you have learned from AI (ChatGPT, Gemini, etc.), and state the URL of that interaction part

- **Usage of AI**:  
  I extensively used ChatGPT to debug and refine features like:  
  1. **Handling Leaflet.js routing machine** for infantry/cavalry path planning.  
  2. **Structuring the combat system** for dynamic dice effects and attack mechanics.  
  3. **Building the interactive tutorial system** for guiding users through game mechanics.  

- **Key Takeaways**:  
  - AI tools streamlined the debugging process and provided valuable insights into modular coding practices.  
  - I learned to structure my JavaScript code in a more reusable, modular way, especially for asynchronous workflows like dice animations and tutorial steps.

- **Interaction URL**:  
   [ChatGPT Interaction for GeoGame Development](https://chatgpt.com/share/6755520f-0010-8010-ad74-ef2231e59dc1)  

### Describe how you interacted with the **DOM** part

Interacting with the DOM was a critical part of building the game's user interface and ensuring real-time player feedback. Below are detailed examples of how the DOM was manipulated in various parts of the game:

1. **Battle Log Updates**:  
   - The battle log dynamically tracks and displays important events during gameplay, such as unit attacks, dice rolls, and health changes. Every action in the game is appended as a new line in the log, ensuring players have a clear record of the game's progression.  
   - **Code Example**:  
     ```javascript
     function updateBattleLog(message) {
       const log = document.getElementById("battle-log");
       const logEntry = document.createElement("p");
       logEntry.textContent = message;
       log.appendChild(logEntry);
       log.scrollTop = log.scrollHeight; // Auto-scroll to the latest entry
     }
     ```
   - **Purpose**: This keeps players engaged by providing detailed, real-time updates of all interactions during the battle.

2. **Dice Roll Effects**:  
   - The dice roll system adds randomness to the game, and its results (both dice values and their corresponding effects) are dynamically displayed in the DOM. After each roll, the attack and defense effects are updated in their respective sections, helping players understand how the dice influence their strategy.  
   - **Code Example**:  
     ```javascript
     document.getElementById("attack-dice").textContent = `🎲 ${attackDiceValue}`;
     document.getElementById("defense-dice").textContent = `🎲 ${defenseDiceValue}`;
     document.getElementById("attack-effect").textContent = `Attack Effect: ${attackEffect.description}`;
     document.getElementById("defense-effect").textContent = `Defense Effect: ${defenseEffect.description}`;
     ```
   - **Purpose**: By directly updating the dice values and their effects, the DOM interaction ensures players are always aware of the current battle conditions and how they are impacted.

3. **Tutorial Highlights**:  
   - The tutorial system provides an interactive guide for new players by dynamically highlighting elements on the screen. This is achieved by calculating the bounding box of a specific element (e.g., the "Map Area" or "Purchase Units" section) and positioning a visual highlight around it. This ensures the highlighted element is clear and visually distinct.  
   - **Code Example**:  
     ```javascript
     function positionHighlight(selector) {
       const element = document.querySelector(selector);
       const highlight = document.querySelector(".tutorial-highlight");

       if (element) {
         const rect = element.getBoundingClientRect();
         highlight.style.width = `${rect.width}px`;
         highlight.style.height = `${rect.height}px`;
         highlight.style.top = `${rect.top + window.scrollY}px`;
         highlight.style.left = `${rect.left + window.scrollX}px`;
         highlight.style.display = "block";
       }
     }
     ```
   - **Purpose**: The tutorial system helps new players easily understand the game's mechanics by visually guiding them through key components and interactions.

4. **Unit Status Updates**:  
   - During the battle, the "Current Status" table dynamically updates to show the health, attack power, and range of both player and defense units. As units take damage or are destroyed, their stats in the table reflect these changes in real time.  
   - **Code Example**:  
     ```javascript
     function updateCurrentStatus(playerUnits, defenseUnits) {
       const playerTableBody = document.querySelector("#player-status-table tbody");
       const defenseTableBody = document.querySelector("#defense-status-table tbody");

       playerTableBody.innerHTML = "";
       defenseTableBody.innerHTML = "";

       playerUnits.forEach(unit => {
         const row = document.createElement("tr");
         row.innerHTML = `
           <td>${unit.type}</td>
           <td>${Math.round(unit.stats.attack)}</td>
           <td>${Math.round(unit.stats.currentHealth)}</td>
           <td>${Math.round(unit.stats.range)}</td>
         `;
         playerTableBody.appendChild(row);
       });

       defenseUnits.forEach(unit => {
         const row = document.createElement("tr");
         row.innerHTML = `
           <td>${unit.type}</td>
           <td>${Math.round(unit.attack)}</td>
           <td>${Math.round(unit.health)}</td>
           <td>${Math.round(unit.range)}</td>
         `;
         defenseTableBody.appendChild(row);
       });
     }
     ```
   - **Purpose**: This allows players to make strategic decisions based on real-time updates of unit stats, enhancing both the interactivity and depth of gameplay.

5. **Dynamic Map Markers**:  
   - When units are purchased or moved, their corresponding markers on the map are dynamically added, updated, or removed. Each marker includes tooltips and click event handlers, providing players with clear and interactive control over their units.  
   - **Purpose**: This ensures that the map reflects the player's actions in real time, making gameplay visually intuitive.

In summary, DOM interactions were used extensively to provide real-time feedback, enhance the player experience, and ensure a smooth and interactive interface for all aspects of the game.



### Layout Components

| **Component**       | **Description**                                                                                                                                   |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Map Section**     | Central area where both player units and defense units are positioned on a geographic map. Players interact here to set routes and mobilize units. |
| **Control Panel**   | A side panel with several controls:                                                                                                               |
|                     | - **Purchase Units**: Options to buy infantry, cavalry, tanks, and airplanes using GIS Coins (1000 GIS Coin).                                     |
|                     | - **Set Routes**: Allows players to plan movement routes for selected units.                                                                      |
|                     | - **Mobilize Units**: Deploys units along defined routes.                                                                                         |
|                     | - **Start Battle**: Begins combat between player and defense units.                                                                               |
|                     | - **GIS Coin Display**: Displays the player’s remaining GIS Coin balance.                                                                         |
| **Dice Mechanics**  | Players roll dice to determine attack, defense, and range effects.                                                                                |
| **Battle Status and Log** | Shows current battle information, including:                                                                                                      |
|                     | - **Round Number**: Tracks the ongoing round of battle.                                                                                           |
|                     | - **Actions and Events**: Displays events such as attacks and health changes.                                                                     |
|                     | - **Unit Status Updates**: Keeps players informed on the health and condition of each unit during the battle.                                     |
| **Current Status**  | Displays unit stats (Attack, Health, Range) in a table format, allowing players to monitor their troops’ effectiveness.                            |

---

### Dice Roll Effects

The dice roll mechanic determines random effects for both attack and defense phases. Below are the possible outcomes for each dice value:

| **Dice Value** | **Effect Type**           | **Description**                                       |
|----------------|---------------------------|-------------------------------------------------------|
| **1**          | Penalty                  | Attack reduced by 20%.                                |
|                | Range Reduction          | Range reduced by 10%.                                 |
|                | Minor Penalty            | Attack reduced by 10%.                                |
|                | Major Penalty            | Attack reduced by 30%.                                |
| **2**          | Shield Block            | Defense increased by 25%.                             |
|                | Health Boost             | Health increased by 10%.                              |
|                | Shield Wall             | Defense increased by 15%.                             |
|                | Minor Health Boost       | Health increased by 5%.                               |
| **3**          | Buff                     | Attack increased by 15%.                              |
|                | Critical Strike          | Next attack deals double damage.                      |
|                | Minor Buff               | Attack increased by 10%.                              |
|                | Major Buff               | Attack increased by 25%.                              |
| **4**          | Healing                  | Health restored by 20%.                               |
|                | Fortification            | Defense health increased by 20%.                      |
|                | Minor Healing            | Health restored by 10%.                               |
|                | Major Fortification      | Defense health increased by 30%.                      |
| **5**          | Critical Strike          | Next attack deals double damage.                      |
|                | Area Damage              | Nearby units take 15 damage.                          |
|                | Splash Damage            | Nearby units take 20 damage.                          |
|                | Focused Damage           | Single unit takes 25 damage.                          |
| **6**          | Special Event            | All units receive a special bonus.                   |
|                | Random Boost             | All units' attack increased by 50%.                   |
|                | Random Healing           | All units' health restored by 30%.                    |
|                | Power Surge              | All units' attack increased by 75%.                   |
|                | Range Boost              | All units' range increased by 20%.                    |

---

### Key Features in Final Version

1. **Dynamic Dice Roll System:**
   - 25 unique effects randomly alter the battle dynamics, such as increasing attack, reducing health, or boosting range.
   
2. **Enhanced Unit Visualization:**
   - Range indicators (red for out of range, green for in range) provide clarity during planning and battles.

3. **Improved Battle Status Logs:**
   - Tracks every action during battles, showing dice rolls, effects, and unit updates.

4. **Current Status Table:**
   - Allows players to monitor unit stats (Attack, Health, Range) during gameplay.

---

### Why No Screenshots?

- The game is available online and can be played directly. A link is provided for an up-to-date experience.
- Retaining the **demo images from the design phase** ensures the progression from concept to reality can be appreciated.

DESIGN And DEMO GAME PART FROM FIRST PART
---
## Design of the Geo-Game 

---
### Read me first :)
**Actually, I had already designed the geogame part in my head before I designed it here, and I had already written more than half of it before the first commit. The purpose of doing this here was to test how much I could actually translate what I thought into code, because my experience in scripting in JS was not as advanced as in python. Since I was able to achieve most of what I wanted, you can see the design below. If I didn't succeed you would probably see an easier puzzle game, but I guess we'll never learn :D**

### Requirements and Layout

#### Game Objective
The game is a geo-based strategy game where players purchase and mobilize units on a map, move them for a cost and that means energy in the game, to achieve a high score by strategically defeating defense units positioned on the map. 

---

#### Layout Components

| **Component**       | **Description**                                                                                                                                   |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Map Section**     | Central area where both player units and defense units are positioned on a geographic map. Players interact here to set routes and mobilize units. |
| **Control Panel**   | A side panel with several controls:                                                                                                               |
|                     | - **Purchase Units**: Options to buy infantry, cavalry, tanks, and airplanes using GIS Coins.(1000 GIS Coin)                                      |
|                     | - **Set Routes**: Allows players to plan movement routes for selected units.                                                                      |
|                     | - **Mobilize Units**: Deploys units along defined routes.                                                                                         |
|                     | - **Start Battle**: Begins combat between player and defense units.                                                                               |
|                     | - **GIS Coin Display**: Displays the player’s remaining GIS Coin balance.                                                                         |
| **Battle Status and Log** | Shows current battle information, including:                                                                                                      |
|                     | - **Round Number**: Tracks the ongoing round of battle.                                                                                           |
|                     | - **Actions and Events**: Displays events such as attacks and health changes.                                                                     |
|                     | - **Unit Status Updates**: Keeps players informed on the health and condition of each unit during the battle.                                     |

---

#### Frontend Requirements

| **Requirement**            | **Details**                                                                                                                                               |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Interactive Map**        | Built with **Leaflet** for real-time interaction, allowing players to set routes, view unit positions, and track movements.                               |
| **Unit Purchase and Deployment** | Players can buy different types of units (infantry, cavalry, tanks, airplanes) with unique characteristics. Units are deployed on the map with type icons. |
| **Battle Mechanics**       | Manages combat between player and defense units based on position, range, and unit stats. Logs actions like attacks and updates unit health status.      |

---

### JavaScript Libraries

| **Library**                    | **Purpose**                                                                                                                |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| **Leaflet**                    | Renders the interactive map, displaying player and defense units on a geographic base.                                     |
| **Leaflet Routing Machine**    | Enables path planning for units (infantry, cavalry) that follow map routes.                                                |
| **OpenStreetMap Tiles**        | Provides the map background, displaying geographic details for orientation within the game.                                |

---

### Icon and Unit Representations

| **Unit Type**   | **Icon**                                                                |
|-----------------|-------------------------------------------------------------------------|
| **Infantry**    | <img src="images/soldier.svg" width="30" alt="Infantry">               |
| **Cavalry**     | <img src="images/cavalary.svg" width="30" alt="Cavalry">               |
| **Tank**        | <img src="images/tank.svg" width="30" alt="Tank">                      |
| **Fighter Jet** | <img src="images/fighter_jet.svg" width="30" alt="Fighter Jet">        |
| **Cannonball**  | <img src="images/cannonball.svg" width="30" alt="Cannonball">          |
| **Machine Gun** | <img src="images/machine_gun.svg" width="30" alt="Machine Gun">        |



### Demo Images In Real Game

- **Gameplay Demo Image 1**: _Look for the opening page, there are not much css for looking because the JS part is really hard to handle first goal is make it right._

  <img src="images/demo1.png" width="700" alt="Gameplay Demo Image 1">

- **Gameplay Demo Image 2**: _Purchase units and set the route._
  
  <img src="images/demo2.png" width="700" alt="Gameplay Demo Image 2">

- **Gameplay Demo Image 3**: _Units move along the route that cost energy._
  
  <img src="images/demo3.png" width="700" alt="Gameplay Demo Image 3">

- **Gameplay Demo Image 4**: _Preparing for engagement._
  
  <img src="images/demo4.png" width="700" alt="Gameplay Demo Image 4">

- **Gameplay Demo Image 5**: _Battle log._
  
  <img src="images/demo5.png" width="700" alt="Gameplay Demo Image 5">

- **Gameplay Demo Image 6**: _Not an attack animation just range's if there are red lines that means the range of unit not enough, if it's green the line moves every round for user can see who's he/she attack at the moment._
  
  <img src="images/demo6.png" width="700" alt="Gameplay Demo Image 6">





