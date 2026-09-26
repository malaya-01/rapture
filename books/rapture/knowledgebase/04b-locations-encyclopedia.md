# Locations Encyclopedia

**Purpose:** Canonical place IDs for chapter frontmatter, `seed/locations.json`, codex tooltips, and continuity locks.

**Rule:** When a chapter introduces or anchors a named place, add or update an entry here **and** in `seed/locations.json` before or immediately after publishing the chapter. Do **not** strip `locations:` from chapter YAML to “simplify” — frontmatter is the geographic record.

**Machine-readable mirror:** `seed/locations.json`  
**Volume beat sheets:** `volumes/VOLUME_XX_*.md` (prose **Location** field + **Location ID** column)

---

## Region map (early saga)

| Region | Scope |
|--------|--------|
| **Fractured City** | Ashford metro — urban collapse, day 0–30 |
| **Fractured City Outskirts** | Hale home, shelters, ruin belt margins |
| **Central Wilds** | Migration corridor north/west of Ashford |
| **Eastern Wilds** | East of interchange — Nora, Marcus mobile routes |
| **Eastern Reaches** | Long-arc eastward (Sanctuary Valley later) |

---

## Volume 1 — location registry

| ID | Display name | Region | First appearance | Notes |
|----|--------------|--------|------------------|-------|
| `ashford` | Ashford | Fractured City | ch-0001 | Ground zero; Cassian's city |
| `ashford-harbor` | Ashford Harbor | Fractured City | ch-0001 | First sky fracture on broadcast |
| `cassian-apartment` | Cassian's Apartment | Fractured City | ch-0001 | Studio above closed nail salon |
| `logistics-office` | Logistics Office | Fractured City | ch-0001 | Cassian's pre-Rapture workplace |
| `hale-family-home` | Hale Family Home | Fractured City Outskirts | ch-0002 | Rowan's house; lawn, dinner table |
| `ashford-outskirts` | Ashford Outskirts | Fractured City Outskirts | ch-0002 | Suburban ring; Hale orbit |
| `adrian-selene-apartment` | Adrian and Selene's Apartment | Fractured City | ch-0003 | Above the bakery |
| `ashford-university-district` | University District | Fractured City | ch-0005 | Marcus evacuation route |
| `central-wilds` | Central Wilds | Central Wilds | ch-0006 | Migration corridor; Nora's field |
| `outskirts-shelter` | Outskirts Shelter | Fractured City Outskirts | ch-0009 | Hale Hold; Rowan/Elena cluster |
| `ashford-highway-interchange` | Ashford Highway Interchange | Fractured City Outskirts | ch-0017 | **Canon milestone** — paths cross, no reunion |
| `ruin-belt` | Ruin Belt | Fractured City Outskirts | ch-0013 | Collapsed margins east/south of city |
| `ashford-margins` | Ashford Margins | Fractured City Outskirts | ch-0013 | Adrian search routes |
| `field-shelter` | Field Shelter | Fractured City Outskirts | ch-0014 | Marcus temporary lab corner |
| `refugee-camp-south` | Refugee Camp Gymnasium | Fractured City Outskirts | ch-0016 | School gym intake; Selene's table |
| `abandoned-highway` | Abandoned Highway | Central Wilds | ch-0021 | Wrong geometry; Highway Camp site glimpsed |
| `ruin-belt-east` | Ruin Belt East | Fractured City Outskirts | ch-0020 | Adrian's eastward road |
| `ashford-margins-west` | Ashford Margins West | Fractured City Outskirts | ch-0020 | Marcus family bearing |
| `refugee-trail-east` | Refugee Trail East | Eastern Wilds | ch-0020 | Selene's rumor road |
| `ashford-elevated-district` | Ashford Elevated District | Fractured City | ch-0023 | Cassian scouts defensible high ground |
| `mobile-shelter` | Mobile Shelter | Eastern Wilds | ch-0024 | Vale family on the move |
| `eastern-wilds` | Eastern Wilds | Eastern Wilds | ch-0024 | East of Ashford; mutable roads |
| `eastern-refugee-trail` | Eastern Refugee Trail | Eastern Wilds | ch-0026 | Selene's trail; networks dead |
| `open-road` | Open Road | Eastern Wilds | ch-0027 | Cassian leaves the city |
| `wild-zone-edge` | Wild Zone Edge | Central Wilds | ch-0028 | Boundary where wild rules dominate |
| `impossible-ruins` | Impossible Ruins | Central Wilds | ch-0028 | Pre-human architecture; Limbo foreshadow |
| `first-dungeon-horizon` | The First Dungeon (Horizon) | Eastern Wilds | ch-0030 | Colossal rising structure — not entered in Vol 1 |

**Saga landmarks (later volumes, already in seed):** `highway-camp` (ch-0069), `sanctuary-valley`, `sanctuary`, `limbo`, etc.

---

## Chapter → location ID reference (Volume 1)

| Ch | Title | Location IDs |
|----|-------|----------------|
| 1 | The Last Ordinary Morning | `cassian-apartment`, `ashford`, `ashford-harbor` |
| 2 | The Sound Above | `hale-family-home`, `ashford-outskirts` |
| 3 | Falling Fire | `adrian-selene-apartment`, `ashford` |
| 4 | When The World Ended | `ashford` |
| 5 | Day Zero | `ashford-university-district`, `ashford` |
| 6 | The Photographer | `central-wilds` |
| 7 | The First Night | `cassian-apartment`, `ashford` |
| 8 | The Things In The Dark | `ashford` |
| 9 | No Rescue Is Coming | `outskirts-shelter`, `ashford-outskirts` |
| 10 | The Last Broadcast | `ashford`, `ashford-outskirts`, `central-wilds` |
| 11 | Empty Shelves | `ashford` |
| 12 | The Hale Hold | `outskirts-shelter` |
| 13 | Broken Chain | `ruin-belt`, `ashford-margins` |
| 14 | Field Notes | `field-shelter`, `ashford` |
| 15 | Northbound | `central-wilds` |
| 16 | Waiting Room | `refugee-camp-south` |
| 17 | Under The Same Sky | `ashford-highway-interchange` |
| 18 | The Healer's Hands | `outskirts-shelter` |
| 19 | Names On A Wall | `outskirts-shelter` |
| 20 | Separate Roads | `ruin-belt-east`, `ashford-margins-west`, `refugee-trail-east` |
| 21 | Ruined Highways | `central-wilds`, `abandoned-highway` |
| 22 | Still Searching | `ruin-belt`, `ashford-margins` |
| 23 | High Ground | `ashford`, `ashford-elevated-district` |
| 24 | Questions Without Answers | `mobile-shelter`, `eastern-wilds` |
| 25 | Watch Rotation | `outskirts-shelter` |
| 26 | Last Signal | `eastern-refugee-trail` |
| 27 | Passing Shadows | `ashford-outskirts`, `open-road` |
| 28 | Impossible Ruins | `wild-zone-edge`, `impossible-ruins` |
| 29 | The Tremor | `eastern-wilds`, `outskirts-shelter`, `ruin-belt` |
| 30 | Beyond The Ruins | `open-road`, `outskirts-shelter`, `wild-zone-edge`, `ruin-belt`, `eastern-wilds`, `eastern-refugee-trail`, `first-dungeon-horizon` |

---

## Workflow when writing a new chapter

1. Read the volume beat sheet **Location** field.
2. Use existing IDs from this table when possible.
3. If the beat requires a **new** named place: add a row here, add JSON to `seed/locations.json`, run `npm run seed:sync`.
4. Set `locations: [id, ...]` in chapter YAML — never omit for published chapters.
5. Update `seed/chapter-progress.json` if locking geographic facts.
