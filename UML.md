# 📌 Project Survival Universe — UML Diyagramları (Toplu MD Versiyonu)

Bu dosya PSU’nun tüm temel sistemlerinin UML diyagramlarını içerir:

- Inventory System UML
- Crafting System UML
- Enemy AI (Behavior Tree) UML
- Vehicle System UML
- Base Building System UML
- Player Progression System UML (Bonus)
- Manager Architecture UML (Bonus)

---

# 1) 📦 Inventory System UML

```
+------------------+
| InventoryManager |
+------------------+
| - slots[]        |
| - maxWeight      |
| - equippedItems  |
+------------------+
| +AddItem()       |
| +RemoveItem()    |
| +MoveItem()      |
| +CalculateWeight()|
+------------------+
          |
          v
+------------------+
|    ItemObject    |
+------------------+
| - id             |
| - name           |
| - sizeX, sizeY   |
| - weight         |
| - durability     |
| - itemType       |
+------------------+
```

---

# 2) 🛠️ Crafting System UML

```
+---------------------+
|   CraftingManager   |
+---------------------+
| - activeRecipe      |
| - craftingQueue     |
+---------------------+
| +StartCraft()       |
| +CheckMaterials()    |
| +FinishCraft()      |
+---------------------+
          |
          v
+---------------------+
|     RecipeData      |
+---------------------+
| - id                |
| - inputs[]          |
| - outputs[]         |
| - time              |
| - stationType       |
| - skillRequired     |
+---------------------+
          |
          v
+---------------------+
|    CraftStation     |
+---------------------+
| - stationTier       |
| - bonusMultiplier   |
| - durability        |
+---------------------+
```

---

# 3) 🧟 Enemy AI System UML (Behavior Tree Model)

```
+------------------+
|    AIManager     |
+------------------+
| - enemyList[]    |
| - tickRate       |
+------------------+
| +UpdateAI()      |
+------------------+
          |
          v
+------------------+
|  BehaviorTree    |
+------------------+
| - rootNode       |
| +Tick()          |
+------------------+
          |
          v
+--------------------------+
|     BehaviorNode         |
+--------------------------+
| - children[]             |
| +Execute()               |
+--------------------------+

Example Nodes:
 - CheckForPlayer
 - HearSound
 - Investigate
 - Chase
 - Attack
 - Search
 - Retreat
```

---

# 4) 🚗 Vehicle System UML

```
+----------------------+
|   VehicleManager     |
+----------------------+
| - vehicles[]         |
| +RegisterVehicle()   |
| +CalculateFuel()     |
| +ApplyDamage()       |
+----------------------+
          |
          v
+----------------------+
|      Vehicle         |
+----------------------+
| - fuel               |
| - durability         |
| - cargoWeight        |
| - noiseLevel         |
| - parts[]            |
| +Drive()             |
| +Refuel()            |
+----------------------+
          |
          v
+----------------------+
|   VehiclePart        |
+----------------------+
| - type               |
| - condition          |
| - modifiers          |
+----------------------+
```

---

# 5) 🏠 Base Building System UML

```
+----------------------+
|     BaseManager      |
+----------------------+
| - structures[]       |
| - powerGrid          |
| - waterSystem        |
| - defenseLevel       |
+----------------------+
| +BuildStructure()    |
| +Upgrade()           |
| +CalculateDefense()  |
| +Repair()            |
+----------------------+
          |
          v
+----------------------+
|   BaseStructure      |
+----------------------+
| - id                 |
| - type               |
| - durability         |
| - energyCost         |
| - upgradeTier        |
| +TakeDamage()        |
+----------------------+
```

---

# 6) ⭐ Player Progression System UML (Bonus)

```
+-------------------------+
|   ProgressionManager    |
+-------------------------+
| - level                 |
| - xp                    |
| - skillPoints           |
| - mastery[]             |
+-------------------------+
| +AddXP()                |
| +LevelUp()              |
| +AssignSkillPoint()     |
+-------------------------+
          |
          v
+-------------------------+
|     SkillTreeNode       |
+-------------------------+
| - id                    |
| - category              |
| - cost                  |
| - effect                |
| - requires[]            |
+-------------------------+
```

---

# 7) 🧩 Manager Architecture UML (Bonus)

```
+-------------------+
|   GameManager     |
+-------------------+
| +Init()           |
| +Tick()           |
+-------------------+
   |    |    |    |
   v    v    v    v
----------- Managers -----------
PlayerManager
EnemyManager
WorldManager
TimeManager
InventoryManager
CraftingManager
VehicleManager
BaseManager
SaveLoadManager
NetworkManager
--------------------------------
```

---

# 📌 Bu MD dosyası GDD’ye direkt entegre edilebilir.
