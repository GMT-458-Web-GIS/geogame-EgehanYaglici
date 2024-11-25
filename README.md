## Below parts belong final version of the game 

#### Final Game Link: https://gmt-458-web-gis.github.io/geogame-EgehanYaglici/

---

### Read Me First! 😊
The **final version** of the game has removed the **'Energy'** mechanic and introduced the **'Dice Roll'** system, which adds a layer of randomness and strategy. The dice roll mechanic includes **25 different effects**, impacting attack, defense, range, and health. 

The **Current Status** section was also added to track unit health, attack power, and range, providing players with crucial information during gameplay. 

**Note:** 
- Not included the final version’s screenshots here since the game is available to play live via a link. Instead, we retained the initial design's demo images below to compare the final implementation with its conceptual design. 
- The differences highlight the design changes made during development.

---

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





