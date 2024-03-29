import type { SpellInfo } from "../types";

export const SPELLS: SpellInfo[] = [
  {
    name: "Dominion",
    range: "Near",
    class: "Priest",
    tier: 5,
    duration: { type: "Round", amt: 10 },
    desc: "Mighty beings come to your aid. The beings must have a combined total of 16 levels or less. Chaotic PCs summon demons/devils, and lawful or neutral PCs summon angels. The beings act of free will to aid you on your turn. After 10 rounds, they return to their realms. You cannot cast this spell again until you complete penance.",
  },
  {
    name: "Charm Person",
    range: "Near",
    class: "Wizard",
    tier: 1,
    desc: "You magically beguile one humanoid of LV 2 or less within near range, who regards you as a friend for the duration.The spell ends if you or your allies do anything harmful to the target.The target knows it was magically charmed after the spell ends.Roll 1d8 to determine amount of days effective",
    duration: { type: "Day", roll: { numDice: 1, diceType: "d8" } },
  },
  {
    name: "Fabricate",
    range: "Near",
    class: "Wizard",
    tier: 3,
    duration: { type: "Round", amt: 10 },
    desc: "This spell can't target creatures. You turn a tree-sized collection of raw materials into a finished work. For example, you convert a pile of bricks or rocks into a bridge. The finished work converts back to raw materials when the spell ends.",
  },
  {
    name: "Fireball",
    range: "Far",
    class: "Wizard",
    tier: 3,
    duration: { type: "Instant", amt: 0 },
    desc: "You hurl a small flame that erupts into a fiery blast. All creatures in a near-sized cube around where the flame lands take 4d6 damage.",
  },
  {
    name: "Command",
    range: "Far",
    class: "Priest",
    tier: 3,
    duration: { type: "Focus", amt: 0 },
    desc: "You issue a verbal command to one creature in range who can understand you. The command must be one word, such as “kneel.” The target obeys the command for as long as you focus. If your command is ever directly harmful to the creature, it may make a Charisma check vs. your last spellcasting check. On a success, the spell ends.",
  },
  {
    name: "Commune",
    range: "Self",
    class: "Priest",
    tier: 4,
    duration: { type: "Instant", amt: 0 },
    desc: 'You seek your god\'s counsel. Ask the GM up to three yes or no questions. The GM truthfully answers "yes" or "no" to each. If you cast this spell more than once in 24 hours, treat a failed spellcasting check for it as a critical failure, instead.',
  },
  {
    name: "Confusion",
    range: "Near",
    class: "Wizard",
    tier: 4,
    duration: { type: "Focus", amt: 0 },
    desc: "You mesmerize one creature you can see in range. The target can't take actions, and it moves in a random direction on its turn. If the target is LV 9+, it may make a WIS check vs. your last spellcasting check at the start of its turn to end the spell.",
  },
  {
    name: "Control Water",
    range: "Far",
    class: "Wizard",
    tier: 4,
    duration: { type: "Focus", amt: 0 },
    desc: "You move and shape water. You can cause a section of water up to 100 feet in width and depth to change shape, defy gravity, or flow in a different direction.",
  },
  {
    name: "Create Undead",
    range: "Close",
    class: "Wizard",
    tier: 5,
    duration: { type: "Day", subType: "InGame", amt: 1 },
    desc: "You conjure a vengeful undead creature to do your bidding. When you cast this spell, you choose to summon either a wight or wraith. It appears next to you and is under your control. The undead creature acts on your turn. After 1 day, it melts away into smoke.",
  },
  {
    name: "Disintegrate",
    range: "Far",
    class: "Wizard",
    tier: 5,
    duration: { type: "Instant", amt: 0 },
    desc: "A green ray shoots from your finger and turns a creature or object into ash. A target creature of LV 5 or less instantly dies. If it is LV 6+, it takes 3d8 damage, instead. A non-magical object up to the size of a large tree is destroyed.",
  },
  {
    name: "Dimension Door",
    range: "Self",
    class: "Wizard",
    tier: 4,
    duration: { type: "Instant", amt: 0 },
    desc: "You teleport yourself and up to one other willing creature to any point you can see.",
  },
  {
    name: "Divination",
    range: "Self",
    class: "Wizard",
    tier: 4,
    duration: { type: "Instant", amt: 0 },
    desc: 'You throw the divining bones or peer into the blackness between the stars, seeking a portent. You can ask the GM one yes or no question. The GM truthfully answers "yes" or "no." If you cast this spell more than once in 24 hours, treat a failed spellcasting check for it as a critical failure, instead.',
  },
  {
    name: "Divine Vengeance",
    range: "Self",
    class: "Priest",
    tier: 5,
    duration: { type: "Round", amt: 10 },
    desc: "You become the divine avatar of your god's wrath, wreathed in holy flames or a black aura of smoldering corruption. For the spell's duration, you can fly a near distance, your weapons are magical, and you have a +4 bonus to your weapon attacks and damage.",
  },
  {
    name: "Fly",
    range: "Self",
    class: "Wizard",
    tier: 3,
    duration: { type: "Round", amt: 5 },
    desc: "Your feet lift from the ground, and you take to the air like a hummingbird. You can fly near for the spell's duration and are able to hover in place.",
  },
  {
    name: "Gaseous Form",
    range: "Self",
    tier: 3,
    class: "Wizard",
    duration: { type: "Round", amt: 10 },
    desc: "You and your gear turn into a cloud of smoke for the spell's duration. You can fly and pass through any gap that smoke could. You can sense the terrain and any movement around you out to a near distance. You can't cast spells while in this form.",
  },
  {
    name: "Heal",
    range: "Close",
    tier: 5,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    desc: "One creature you touch is healed to full hit points. You cannot cast this spell again until you complete a rest.",
  },
  {
    name: "Arcane Eye",
    range: "Near",
    class: "Wizard",
    tier: 4,
    duration: { type: "Focus", amt: 0 },
    desc: "You conjure an invisible, grape- sized eye within range. You can see through the eye. It can see in the dark out to near range, fly near on your turn, and squeeze through openings as narrow as a keyhole.",
  },
  {
    name: "Cloudkill",
    range: "Far",
    class: "Wizard",
    tier: 4,
    duration: { type: "Round", amt: 5 },
    desc: "A putrid cloud of yellow poison fills a near-sized cube within range. It spreads around corners. Creatures inside the cloud are blinded and take 2d6 damage at the beginning of their turns. A creature of LV 9 or less that ends its turn fully inside the cloud dies.",
  },
  {
    name: "Feather Fall",
    range: "Self",
    class: "Wizard",
    tier: 1,
    desc: "You may make an attempt to cast this spell when you fall.Your rate of descent slows so that you land safely on your feet.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Animate Dead",
    range: "Close",
    class: "Wizard",
    tier: 3,
    desc: "You touch one humanoid’s remains, and it rises as a zombie or skeleton under your control. The remains must have at least three limbs and its head intact. The undead creature acts on your turn. After 1 day, the creature collapses into grave dust.",
    duration: { type: "Day", amt: 1 },
  },
  {
    name: "Acid Arrow",
    range: "Far",
    class: "Wizard",
    tier: 2,
    desc: "You conjure a corrosive bolt that hits one foe, dealing 1d6 damage a round. The bolt remains in the target for as long as you focus.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Antimagic Shell",
    range: "Self",
    class: "Wizard",
    tier: 5,
    desc: "An invisible, near-sized cube of null-magic appears centered on you. Within the cube, no spells can be cast. Magic items and spells have no effect in the zone, and no magic can enter. The cube moves with you. Spells such as dispel magic have no effect on it. Another antimagic shell does not affect this one.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Dispel Magic",
    range: "Near",
    class: "Wizard",
    tier: 3,
    duration: { type: "Instant", amt: 0 },
    desc: "End one spell that affects one target you can see in range.",
  },
  {
    name: "Silence",
    range: "Far",
    class: "Wizard",
    tier: 2,
    desc: "You magically mute sound in a near cube within the spell’s range. Creatures inside the area are deafened, and any sounds they create cannot be heard.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Cleansing Weapon",
    range: "Close",
    class: "Priest",
    tier: 2,
    desc: "One weapon you touch is wreathed in purifying flames. It deals an additional 1d4 damage (1d6 vs. undead) for the duration.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Floating Disk",
    range: "Near",
    class: "Wizard",
    tier: 1,
    desc: "You create a floating, circular disk of force with a concave center. It can carry up to 20 gear slots. It hovers at waist level and automatically stays within near of you. It can’t cross over drop- offs or pits taller than a human.",
    duration: { type: "Round", amt: 10 },
  },
  {
    name: "Misty Step",
    range: "Self",
    class: "Wizard",
    tier: 2,
    desc: "In a puff of smoke, you teleport a near distance to an area you can see.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Augury",
    range: "Self",
    class: "Priest",
    tier: 2,
    desc: "You interpret the meaning of supernatural portents and omens. Ask the GM one question about a specific course of action. The GM says whether the action will lead to “weal” or “woe.”",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Mage Armor",
    range: "Self",
    class: "Wizard",
    tier: 1,
    desc: "An invisible layer of magical force protects your vitals. Your armor class becomes 14 (18 on a critical spellcasting check) for the spell’s duration.",
    duration: { type: "Round", amt: 10 },
  },
  {
    name: "Holy Weapon",
    range: "Close",
    class: "Priest",
    tier: 1,
    desc: "One weapon you touch is imbued with a sacred blessing.The weapon becomes magical and has +1 to attack and damage rolls for the duration.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Hold Person",
    range: "Near",
    class: "Wizard",
    tier: 2,
    desc: "You magically paralyze one humanoid creature of LV 4 or less you can see within range.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Mirror Image",
    range: "Self",
    class: "Wizard",
    tier: 2,
    desc: "You create a number of illusory duplicates of yourSelf equal to half your level rounded down (minimum 1). The duplicates surround you and mimic you.Each time a creature attacks you, the attack misses and causes one of the duplicates to evaporate.If all of the illusions have disappeared, the spell ends.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Bless",
    range: "Close",
    class: "Priest",
    tier: 2,
    desc: "One creature you touch gains a luck token.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Burning Hands",
    range: "Close",
    class: "Wizard",
    tier: 1,
    desc: "You spread your fingers with thumbs touching, unleashing a circle of flame that fills a close area around where you stand.Creatures within the area of effect take 1d6 damage.Unattended flammable objects ignite.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Blind/Deafen",
    range: "Near",
    class: "Priest",
    tier: 2,
    desc: "You utter a divine censure, blinding or deafening one creature you can see in range. The creature has disadvantage on tasks requiring the lost sense.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Web",
    range: "Far",
    class: "Wizard",
    tier: 2,
    desc: "You create a near-sized cube of sticky, dense spider web within the spell’s range. A creature stuck in the web can’t move and must succeed on a Strength check opposed by your spellcasting check to free itself.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Light",
    range: "Close",
    class: "PriestWizard",
    tier: 1,
    desc: "One object you touch glows with bright, heatless light, illuminating out to a near distance for 1 hour of real time.",
    duration: { type: "Hour", subType: "RealTime", amt: 1 },
  },
  {
    name: "Cure Wounds",
    range: "Close",
    class: "Priest",
    tier: 1,
    desc: "Your touch restores ebbing life.Roll a number of d6s equal to 1 + half your level (rounded down).One target you touch regains that many hit points.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Invisibility",
    range: "Close",
    class: "Wizard",
    tier: 2,
    desc: "A creature you touch becomes invisible for the spell’s duration.The spell ends if the target attacks or casts a spell.",
    duration: { type: "Round", amt: 10 },
  },
  {
    name: "Detect Magic",
    range: "Near",
    class: "Wizard",
    tier: 1,
    desc: "You can sense the presence of magic within near range for the spell's duration. If you focus for two rounds, you discern its general properties. Full barriers block this spell.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Knock",
    range: "Near",
    class: "Wizard",
    tier: 2,
    desc: "A door, window, gate, chest, or portal you can see within range instantly opens, defeating all mundane locks and barriers.This spell creates a loud knock audible to all within earshot.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Magic Missile",
    range: "Far",
    class: "Wizard",
    tier: 1,
    desc: "You have advantage on your check to cast this spell.A glowing bolt of force streaks from your open hand, dealing 1d4 damage to one target.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Detect Thoughts",
    range: "Near",
    class: "Wizard",
    tier: 2,
    desc: "You peer into the mind of one creature you can see within the spell’s range.Each round, you learn the target’s immediate thoughts.On its turn, the target makes a Wisdom check opposed by your last spellcasting check. If the target succeeds, it notices your presence in its mind and the spell ends.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Smite",
    range: "Near",
    class: "Priest",
    tier: 2,
    desc: "You call down punishing flames on a creature you can see within range. It takes 1d6 damage.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Protection From Evil",
    range: "Close",
    class: "PriestWizard",
    tier: 1,
    desc: "For the spell’s duration, chaotic beings have disadvantage on attack rolls and hostile spellcasting checks against the target. These beings also can’t possess, compel, or beguile it.When cast on an already-possessed target, the possessing entity makes a CHA check vs. the last spellcasting check. On a failure, the entity is expelled.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Levitate",
    range: "Self",
    class: "Wizard",
    tier: 2,
    desc: "You can float a near distance vertically per round on your turn.You can also push against solid objects to move horizontally.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Alarm",
    range: "Close",
    class: "Wizard",
    tier: 1,
    desc: "You touch one object, such as a door threshold, setting a magical alarm on it.If any creature you do not designate while casting the spell touches or crosses past the object, a magical bell sounds in your head.If any creature you do not designate while casting the spell touches or crosses past the object, a magical bell sounds in your head.",
    duration: { type: "Day", amt: 1 },
  },
  {
    name: "Shield of Faith",
    range: "Self",
    class: "Priest",
    tier: 1,
    desc: "A protective force wrought of your holy conviction surrounds you. You gain a +2 bonus to your armor class for the duration.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Turn Undead",
    range: "Near",
    class: "Priest",
    tier: 1,
    desc: "You rebuke undead creatures, forcing them to flee. You must present a holy symbol to cast this spell.Undead creatures within near of you must make a CHA check opposed by your spellcasting check. If a creature fails by 10+ points and is equal to or less than your level, it is destroyed. Otherwise, on a fail, it flees from you for 5 rounds.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Sleep",
    range: "Near",
    class: "Wizard",
    tier: 1,
    desc: "This spell fills a near-sized cube extending from you. Choose a number of living creatures in the area up to your level. Those creatures fall into a deep sleep if they are LV 2 or less. Injury or vigorous shaking wakes them.",
    duration: { type: "Instant", amt: 0 },
  },
  {
    name: "Flame Strike",
    range: "Far",
    tier: 4,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    desc: "You call down a holy pillar of fire, immolating one creature you can see within range. The target takes 2d6 damage.",
  },
  {
    name: "Fixed Object",
    range: "Close",
    class: "Wizard",
    tier: 2,
    desc: "An object you touch that weighs no more than 5 pounds becomes fixed in its current location. It can support up to 5,000 pounds of weight for the duration of the spell.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Alter Self",
    range: "Self",
    class: "Wizard",
    tier: 2,
    desc: "You magically change your physical form, gaining one feature that modifies your existing anatomy.For example, you can grow functional gills on your neck or bear claws on your fingers. This spell can’t grow wings or limbs.",
    duration: { type: "Round", amt: 5 },
  },
  {
    name: "Hold Portal",
    range: "Near",
    class: "Wizard",
    tier: 1,
    desc: "You magically hold a portal closed for the duration. A creature must make a successful STR check vs. your spellcasting check to open the portal.The knock spell ends this spell.",
    duration: { type: "Round", amt: 10 },
  },
  {
    name: "Zone of Truth",
    range: "Near",
    class: "Priest",
    tier: 2,
    desc: "You compel a creature you can see to speak truth. It can’t utter a deliberate lie while within range.",
    duration: { type: "Focus", amt: 0 },
  },
  {
    name: "Hold Monster",
    tier: 5,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Near",
    desc: "You paralyze one creature you can see within range. If the target is LV 9+, it may make a STR check vs. your last spellcasting check at the start of its turn to end the spell.",
  },
  {
    name: "Illusion",
    tier: 3,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Far",
    desc: "You create a convincing visible and audible illusion that fills up to a near-sized cube in range. The illusion cannot cause harm, but creatures who believe the illusion is real react to it as though it were. A creature who inspects the illusion from afar must pass a Wisdom check vs. your last spellcasting check to perceive the false nature of the illusion. Touching the illusion also reveals its false nature.",
  },
  {
    name: "Judgement",
    tier: 5,
    class: "Priest",
    duration: { type: "Round", amt: 5 },
    range: "Close",
    desc: "You instantly banish a creature you touch, sending it and all possessions it carries to face the judgment of your god. You can banish an intelligent creature of LV 10 or less. When the creature returns in 5 rounds, it has been healed to full hit points if its deeds pleased your god. It has been reduced to 1 hit point if its deeds angered your god. If your god can't judge its actions, it is unchanged.",
  },
  {
    name: "Lay To Rest",
    tier: 3,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    range: "Close",
    desc: "You instantly send an undead creature you touch to its final afterlife, destroying it utterly. You can target an undead creature of LV 9 or less.",
  },
  {
    name: "Lighting Bolt",
    tier: 3,
    class: "Wizard",
    duration: { type: "Instant", amt: 0 },
    range: "Far",
    desc: "You shoot a blue-white ray of lightning from your hands, hitting all creatures in a straight line out to a far distance. Creatures struck by the lightning take 3d6 damage.",
  },
  {
    name: "Magic Circle",
    tier: 3,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Near",
    desc: "You conjure a circle of runes out to near-sized cube centered on yourself and name a type of creature (for example, demons). For the spell’s duration, creatures of the chosen type cannot attack or cast a hostile spell on anyone inside the circle. The chosen creatures also can’t possess, compel, or beguile anyone inside the circle.",
  },
  {
    name: "Mass Cure",
    tier: 3,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    range: "Near",
    desc: "All allies within near range of you regain 2d6 hit points.",
  },
  {
    name: "Passwall",
    tier: 4,
    class: "Wizard",
    duration: { type: "Round", amt: 5 },
    range: "Close",
    desc: "A tunnel of your height opens in a barrier you touch and lasts for the duration. The passage can be up to near distance in length and must be in a straight line.",
  },
  {
    name: "Pillar Of Salt",
    tier: 4,
    class: "Priest",
    duration: { type: "Focus", amt: 0 },
    range: "Near",
    desc: "A creature you target turns into a statue made of hardened salt. You can target a creature you can see of LV 5 or less. If you successfully focus on this spell for 3 rounds in a row, the transformation becomes permanent.",
  },
  {
    name: "Plane Shift",
    tier: 5,
    class: "PriestWizard",
    duration: { type: "Instant", amt: 0 },
    range: "Close",
    desc: "You fold space and time, transporting yourself and all willing creatures within close range to a location on another plane of your choice. Unless you have been to your intended location before, you appear in a random place on the destination plane.",
  },
  {
    name: "Polymorph",
    tier: 4,
    class: "Wizard",
    duration: { type: "Round", amt: 10 },
    range: "Close",
    desc: "You transform a creature you touch into another natural creature you choose of equal or smaller size. Any gear the target carries melds into its new form. The target gains the creature's physical statistics, but it retains its non-physical statistics. If the target goes to 0 hit points, it reverts to its true form at half its prior hit points. You can target any willing creature with this spell, or an unwilling creature whose level is less than or equal to half your level rounded down (minimum 1).",
  },
  {
    name: "Power Word Kill",
    tier: 5,
    class: "Wizard",
    duration: { type: "Instant", amt: 0 },
    range: "Near",
    desc: "You utter the Word of Doom. One creature you target of LV 9 or less dies if it hears you. Treat a failed spellcasting check for this spell as a critical failure, and roll the mishap with disadvantage.",
  },
  {
    name: "Prismatic Orb",
    tier: 5,
    class: "Wizard",
    duration: { type: "Instant", amt: 0 },
    range: "Far",
    desc: "You send a strobing orb of energy streaking toward a target within range. Choose an energy type from fire, cold, or electricity. The orb deals 3d8 damage and delivers a concussive blast of the chosen energy type. If the energy type is anathema to the target's existence (for example, cold energy against a fire elemental), the orb deals double damage to it, instead.",
  },
  {
    name: "Prophecy",
    tier: 5,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    range: "Self",
    desc: "You commune directly with your god for guidance. Ask the GM one question. The GM answers the question truthfully using the knowledge your god possesses. Deities are mighty, but not omniscient. You cannot cast this spell again until you complete penance.",
  },
  {
    name: "Protection From Energy",
    tier: 3,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Close",
    desc: "One creature you touch becomes impervious to the wild fury of the elements. Choose fire, cold, or electricity. For the spell's duration, the target is immune to harm from energy of the chosen type.",
  },
  {
    name: "Rebuke Unholy",
    tier: 3,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    range: "Near",
    desc: "You rebuke creatures who oppose your alignment, forcing them to flee. You must present a holy symbol to cast this spell. If you are lawful or neutral, this spell affects demons, devils, and outsiders. If you are chaotic, this spell affects angels and natural creatures of the wild. Affected creatures within near of you must make a CHA check vs. your spellcasting check. If a creature fails by 10+ points and is equal to or less than your level, it is destroyed. Otherwise, on a fail, it flees from you for 5 rounds.",
  },
  {
    name: "Regenerate",
    tier: 4,
    class: "Priest",
    duration: { type: "Focus", amt: 0 },
    range: "Close",
    desc: "A creature you touch regains 1d4 hit points on your turn for the duration. This spell also regrows lost body parts.",
  },
  {
    name: "Resilient Sphere",
    tier: 4,
    class: "Wizard",
    duration: { type: "Round", amt: 5 },
    range: "Close",
    desc: "You conjure a weightless, glassy sphere around you that extends out to close range. For the spell's duration, nothing can pass through or crush the sphere. You can roll the sphere a near distance on your turn.",
  },
  {
    name: "Restoration",
    tier: 3,
    class: "Priest",
    duration: { type: "Instant", amt: 0 },
    range: "Close",
    desc: "With the touch of your hands, you expunge curses and illnesses. One curse, illness, or affliction of your choice affecting the target creature ends.",
  },
  {
    name: "Scrying",
    tier: 5,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Self",
    desc: "You look into a crystal ball or reflecting pool, calling up images of a distant place. For the spell's duration, you can see and hear a creature or location you choose that is on the same plane. This spell is DC 18 to cast if you try to scry on a creature or location that is unfamiliar to you. Each round, creatures you view may make a Wisdom check vs. your last spellcasting check. On a success, they become aware of your magical observation.",
  },
  {
    name: "Sending",
    tier: 3,
    class: "Wizard",
    duration: { type: "Instant", amt: 0 },
    range: "Far",
    desc: "Range Unlimited. You send a brief, mental message to any creature with whom you are familiar who is on the same plane.",
  },
  {
    name: "Shapechange",
    tier: 5,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Self",
    desc: "You transform yourself and any gear you carry into another natural creature you've seen of level 10 or less. You assume the creature's physical statistics, but you retain your non-physical statistics (such as INT, WIS, and CHA). If you go to 0 HP while under the effects of this spell, you revert to your true form at 1 HP.",
  },
  {
    name: "Speak With Dead",
    tier: 3,
    class: "Wizard",
    duration: { type: "Instant", amt: 0 },
    range: "Close",
    desc: 'A dead body you touch answers your questions in a distant, wheezing voice. You can ask the dead body up to three yes or no questions (one at a time). The GM truthfully answers "yes" or "no" to each. If you cast this spell more than once in 24 hours, treat a failed spellcasting check for it as a critical failure, instead.',
  },
  {
    name: "Stoneskin",
    tier: 4,
    class: "Wizard",
    duration: { type: "Round", amt: 10 },
    range: "Self",
    desc: "Your skin becomes like granite. For the spell's duration, your armor class becomes 17 (20 on a critical spellcasting check).",
  },
  {
    name: "Summon Extraplanar",
    tier: 5,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Near",
    desc: "You reach into the outer planes, summoning forth a creature. You summon an elemental or outsider of LV 7 or less. The creature is under your control and acts on your turn. If you lose focus on this spell, you lose control of the creature and it becomes hostile toward you and your allies. You must pass a spellcasting check on your turn to return the creature to the outer planes.",
  },
  {
    name: "Telekinesis",
    tier: 4,
    class: "Wizard",
    duration: { type: "Focus", amt: 0 },
    range: "Far",
    desc: "You lift a creature or object with your mind. Choose a target that weights 1,000 pounds or less. You can move it a near distance in any direction and hold it in place.",
  },
  {
    name: "Teleport",
    tier: 5,
    class: "Wizard",
    duration: { type: "Instant", amt: 0 },
    range: "Close",
    desc: "You and any willing creatures you choose within close range teleport to a location you specify on your same plane. You can travel to a known teleportation sigil or to a location you've been before. Otherwise, you have a 50% chance of arriving off-target.",
  },
  {
    name: "Wall Of Force",
    tier: 4,
    class: "Wizard",
    duration: { type: "Round", amt: 5 },
    range: "Near",
    desc: "You lift your hands, conjuring a transparent wall of force. The thin wall must be contiguous and can cover a near-sized area in width and length. You choose its shape. Nothing on the same plane can physically pass through the wall.",
  },
  {
    name: "Wish",
    tier: 5,
    class: "Wizard",
    duration: { type: "Instant", amt: 5 },
    range: "Self",
    desc: "This mighty spell alters reality. Make a single wish, stating it as exactly as possible. Your wish occurs, as interpreted by the GM. Treat a failed spellcasting check for this spell as a critical failure, and roll the mishap with disadvantage.",
  },
  {
    name: "Wrath",
    tier: 4,
    class: "Priest",
    duration: { type: "Round", amt: 10 },
    range: "Self",
    desc: "Your weapons become magical +2 and deal an additional d8 damage for the spell's duration.",
  },
];

const SPELL_COMPENDIUM: { [name: string]: SpellInfo } = {};
for (const s of SPELLS) {
  SPELL_COMPENDIUM[s.name.toLowerCase()] = s;
}
export default SPELL_COMPENDIUM;
