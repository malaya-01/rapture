# Equipment, Loot & Rank Systems

Canonical bridge between **monster threat ranks**, **gear grades**, **dungeon floors**, and **Awakened capability**. Every drop, craft, and clearance reward must align with this table.

---

## Unified rank ladder (F → Catastrophe)

| Rank | Monster threat | Gear grade | Typical wielder | Dungeon floor band |
|------|----------------|------------|-----------------|-------------------|
| **F** | Civilians at risk | Scrap / Improvised | Untrained survivor | Surface, Floor 1–2 |
| **E** | Small groups | Salvaged | Trained civilian, new Awakened | Floors 1–5 |
| **D** | Requires Awakened | Standard Rune-forged | Guild Copper–Iron | Floors 3–10 |
| **C** | Major threat | Refined | Guild Silver | Floors 8–18 |
| **B** | Settlement threat | Elite | Guild Gold, settlement captains | Floors 15–25 |
| **A** | City threat | Masterwork | Guild Platinum, city champions | Floors 22–35 |
| **S** | Regional threat | Legendary prototype | Guild Mythril, regional heroes | Floors 30–45 |
| **SS** | National threat | Mythic | Guild Adamant, national assets | Legacy cores |
| **Catastrophe** | Existential | World-bound | Unique only | Catastrophe dungeons |

**Rule:** Gear **one rank above** monster is a fair fight with skill. Two ranks above = dominant. One rank below = lethal without tactics.

---

## Equipment categories

| Category | Examples | Notes |
|----------|----------|-------|
| Weapons | Swords, spears, bows, staves, gauntlets | Affinity channels optional |
| Armor | Light / medium / heavy / robe | Rune plating adds rank |
| Accessories | Rings, amulets, belts, cloaks | Often skill modifiers |
| Tools | Rune kits, mapping crystals, lockpicks | Explorer staples |
| Consumables | Potions, antidotes, mana cells, sigils | Single-use; craftable |
| Materials | Hides, cores, dust, shards, ingots | Crafting + trade |
| Skill Tomes | Bound technique manuals | Teach named skills |
| Relics | Unique story items | See `11-artifacts-relics-treasures.md` |

---

## Material tiers (crafting)

| Material ID | Name | Source rank | Use |
|-------------|------|-------------|-----|
| `rusted-scrap` | Rusted Scrap | F | Patch armor, knives |
| `ember-hide` | Ember Hide | E | Ashwolf packs |
| `ironthorn-plate` | Ironthorn Plate | D | Ironhide Boar |
| `storm-crystal` | Storm Crystal | C | Thunder Stag, mana cells |
| `void-silk` | Void Silk | B | Whisper Shade, stealth gear |
| `dragon-scale` | Dragon Scale Fragment | S | High-end armor (illegal trade in some nations) |
| `memory-glass` | Memory Glass | A | Forgotten Palace |
| `bronze-heart-fragment` | Bronze Heart Fragment | S | Eternal Machine |

---

## Loot drop rules

1. **Field drops:** 1–3 material items per kill; core only on elite variants or first kill of species in region.  
2. **Dungeon chests:** Rank = floor band ±1; boss chest = floor rank +1 (cap S in Major dungeons).  
3. **Sovereign kill:** Guaranteed unique relic OR mythic material — never random trash.  
4. **No infinite farming exploits:** Dungeon respawn limits; living dungeons adapt (Crimson Hive).  
5. **Sanctuary economy:** Higher ranks require Deep Delvers Guild clearance logs.

---

## Explorer Guild license ranks (human)

| License | Requirement | Clearance |
|---------|-------------|-----------|
| Copper | Awakening + survival course | F–E zones |
| Iron | 10 documented kills | E–D |
| Silver | Party clear of Minor dungeon | D–C |
| Gold | Solo or lead clear Floor 15+ Major | C–B |
| Platinum | Regional commendation | B–A |
| Mythril | Legacy dungeon partial clear | A–S |
| Adamant | Council nomination only | S+ |
| Sanctuary Class | Founder council vote | Diplomatic + combat |

Nora Winters holds **Adamant** by Vol 7. Cassian never pursues license rank — influence exceeds paper.

---

## Image asset convention

```
assets/images/equipment/{id}.png
assets/images/monsters/{id}.png
assets/images/dungeons/{id}/floor-{nn}.png
assets/images/characters/{id}.png
```

MD entries include `imagePath` + `imagePrompt`. Leave `imagePath` file empty until generated.

---

## Cross-references

- Monsters & drops: `05-monster-encyclopedia.md` + `seed/monsters.json`  
- Dungeon loot tables: `06-dungeon-bible.md` + `seed/dungeons.json`  
- Named gear: `11-artifacts-relics-treasures.md` + `seed/artifacts.json` + `seed/equipment.json`  
- Skills & spells: `10-magic-and-mana-system.md` + `seed/skills.json`
