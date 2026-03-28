"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";
import clsx from "clsx";

const FILTERS = ["ALL", "LIGHT", "FIGURE", "PLACE", "TIME", "MEMORY", "TENSION", "QUIET", "MYTH"] as const;
type Filter = (typeof FILTERS)[number];

interface Board {
  id: string;
  name: string;
  verse: string;
  invitation: string;
  chips: string[];
  category: Exclude<Filter, "ALL">;
}

const BOARDS: Board[] = [
  // ── LIGHT ──────────────────────────────────────────────────────────────────
  { id: "last-light",      category: "LIGHT",   name: "Last Light",           verse: "the moment before it disappears",             invitation: "Draw something you can only see when the light is almost gone — a silhouette, a color that has no name, a shadow longer than its owner.",       chips: ["DUSK", "FLEETING", "WARMTH"] },
  { id: "first-light",     category: "LIGHT",   name: "First Light",          verse: "the world before anyone has touched it",      invitation: "Just past blue — the light before it becomes day. An empty street, a face turned to the window, a garden still holding the night.",            chips: ["DAWN", "SOFT", "STILL"] },
  { id: "overcast",        category: "LIGHT",   name: "Overcast",             verse: "when the sky becomes a diffuser",             invitation: "No harsh shadows. Everything slightly flattened. Draw what reveals itself when the drama of sunlight is removed.",                              chips: ["FLAT LIGHT", "GREY", "EVEN"] },
  { id: "candlelight",     category: "LIGHT",   name: "By Candlelight",       verse: "warmth against all that dark",                invitation: "A single flame holds back an entire room of shadow. Draw what it touches — and what it doesn't.",                                              chips: ["INTIMATE", "WARM", "SHADOW"] },
  { id: "neon-wet",        category: "LIGHT",   name: "Neon, Wet",            verse: "the city doubled in the pavement",            invitation: "Rain on asphalt. Lights from signs, windows, headlights — all of it reflected and distorted. Draw the city's ghost beneath the city.",        chips: ["NEON", "RAIN", "REFLECTIVE"] },
  { id: "dappled",         category: "LIGHT",   name: "Dappled",              verse: "light interrupted by living things",          invitation: "Sunlight through leaves, through blinds, through lace. Moving and still at once. Draw the pattern light makes when something is in the way.", chips: ["FILTERED", "ORGANIC", "PATTERN"] },
  { id: "contre-jour",     category: "LIGHT",   name: "Against the Light",    verse: "shooting into the sun",                       invitation: "The subject becomes a silhouette, a halo, an outline. Draw what happens when you look at the light source instead of away from it.",          chips: ["BACKLIT", "SILHOUETTE", "GLARE"] },
  { id: "underwater-light",category: "LIGHT",   name: "Below the Surface",    verse: "light bending through water",                 invitation: "Caustic patterns on a pool floor. A face seen from below. Draw the world as it looks when water gets between it and the eye.",                chips: ["CAUSTIC", "BLUE", "DISTORTED"] },

  // ── FIGURE ─────────────────────────────────────────────────────────────────
  { id: "the-watcher",     category: "FIGURE",  name: "The Watcher",          verse: "someone always watching, rarely seen",        invitation: "A figure at a window. Someone standing back from the crowd. Draw the person observing rather than participating.",                            chips: ["OBSERVER", "DISTANT", "AWARE"] },
  { id: "carrying-heavy",  category: "FIGURE",  name: "Carrying Something Heavy", verse: "the weight shows in the body",            invitation: "Not just physical weight — the posture of someone carrying more than what's visible. Draw the body under strain.",                         chips: ["WEIGHTED", "LABORING", "STOIC"] },
  { id: "crowd-removed",   category: "FIGURE",  name: "Crowd, One Removed",   verse: "present but separate",                        invitation: "A crowd in motion — and one figure still, or looking the wrong way, or simply not part of it. Draw the gap between a person and the mass.", chips: ["SOLITUDE", "CROWD", "APART"] },
  { id: "dancer-rest",     category: "FIGURE",  name: "Dancer at Rest",       verse: "the body remembers its training",             invitation: "Not dancing — but the posture gives it away. Draw a trained body in an ordinary moment.",                                                  chips: ["GRACEFUL", "STILL", "POISED"] },
  { id: "strangers-back",  category: "FIGURE",  name: "A Stranger's Back",    verse: "everything you can't know",                   invitation: "A figure from behind — walking away, looking at something, waiting. Draw the mystery of a person whose face you cannot see.",               chips: ["ANONYMOUS", "DEPARTING", "UNKNOWN"] },
  { id: "two-doorway",     category: "FIGURE",  name: "Two in a Doorway",     verse: "the threshold as a stage",                    invitation: "Two people — arriving or leaving, greeting or parting. Draw the charged space of a threshold shared.",                                       chips: ["ENCOUNTER", "THRESHOLD", "CHARGED"] },
  { id: "old-hands",       category: "FIGURE",  name: "The Hands",            verse: "a lifetime written in skin and bone",         invitation: "Hands that have worked, held, built, lost. Draw what age and use leave behind.",                                                             chips: ["AGED", "WEATHERED", "CLOSE"] },
  { id: "child-running",   category: "FIGURE",  name: "Child Running",        verse: "movement as pure intent",                     invitation: "No hesitation, no self-consciousness — just direction and speed. Draw the body before it learns to hold back.",                              chips: ["MOTION", "FREE", "JOYFUL"] },

  // ── PLACE ──────────────────────────────────────────────────────────────────
  { id: "underground",     category: "PLACE",   name: "Underground",          verse: "where roots and wires tangle in the dark",    invitation: "Below the surface — caves, tunnels, subways, root systems. Draw a world that exists without asking for light.",                              chips: ["DEPTH", "SHADOW", "HIDDEN"] },
  { id: "overgrown",       category: "PLACE",   name: "Overgrown",            verse: "nature reclaiming what was never really ours",invitation: "Vines through a window. Moss on machinery. Draw the slow, patient work of wildness taking back its space.",                                chips: ["DECAY", "GROWTH", "TIME"] },
  { id: "threshold",       category: "PLACE",   name: "The Threshold",        verse: "between here and somewhere else",             invitation: "A doorway, a gate, an arch. Not inside, not outside. Draw the edge between two states of being.",                                          chips: ["LIMINAL", "PASSAGE", "BETWEEN"] },
  { id: "rooftop",         category: "PLACE",   name: "From the Rooftop",     verse: "above the street, below the sky",             invitation: "The city from above — water towers, antennas, laundry, pigeons. Draw the layer of the city that faces up.",                                chips: ["ELEVATED", "URBAN", "OPEN"] },
  { id: "room-lived-in",   category: "PLACE",   name: "A Room Lived In",      verse: "space shaped by the person inside it",        invitation: "Books stacked wrong. A blanket left on the couch. Draw the traces of a life in the objects it has moved.",                                  chips: ["DOMESTIC", "INTIMATE", "LAYERED"] },
  { id: "abandoned",       category: "PLACE",   name: "Abandoned",            verse: "time moving through an empty place",          invitation: "A station no one uses. A house no one returns to. Draw what happens to a space when people leave and don't come back.",                     chips: ["RUIN", "EMPTY", "FADED"] },
  { id: "market-close",    category: "PLACE",   name: "The Market at Close",  verse: "the end of the exchange",                     invitation: "Stalls folding down, leftover goods, the smell of things. Draw the aftermath of human commerce — messy and real.",                          chips: ["CROWDED", "EARTHY", "WINDING DOWN"] },
  { id: "sacred-ground",   category: "PLACE",   name: "Sacred Ground",        verse: "a place that asks something of you",          invitation: "A shrine, a ruin, a forest clearing. Draw a space that feels like it remembers being used for something larger than daily life.",            chips: ["ANCIENT", "REVERENT", "STILL"] },

  // ── TIME ───────────────────────────────────────────────────────────────────
  { id: "4am",             category: "TIME",    name: "4 AM",                 verse: "the city breathing, almost no one watching",  invitation: "A light still on. An empty road. A figure walking somewhere unknown. Draw the intimacy of being awake when the world is not.",             chips: ["NIGHT", "SOLITUDE", "BLUE"] },
  { id: "last-summer",     category: "TIME",    name: "Last Day of Summer",   verse: "already mourning what isn't gone yet",        invitation: "The light already slightly different. The awareness of an ending. Draw the feeling of a season in its final hour.",                        chips: ["MELANCHOLIC", "GOLDEN", "ENDING"] },
  { id: "after-storm",     category: "TIME",    name: "After the Storm",      verse: "the world washed and rearranged",             invitation: "Everything dripping, slightly moved, smelling of rain. Draw the quiet that comes after the weather has finished.",                          chips: ["WET", "RELIEF", "AFTERMATH"] },
  { id: "before-starts",   category: "TIME",    name: "Before It Starts",     verse: "the breath before the first note",            invitation: "An empty stage. A starting line. A plate of food before anyone touches it. Draw the electric charge of anticipation.",                     chips: ["TENSION", "WAITING", "CHARGED"] },
  { id: "end-season",      category: "TIME",    name: "End of Season",        verse: "closing time that won't reopen soon",         invitation: "Chairs on tables, covered pools, shuttered stalls. Draw the strange sadness of things put away.",                                         chips: ["CLOSING", "SEASONAL", "STILL"] },
  { id: "hour-after",      category: "TIME",    name: "The Hour After",       verse: "when the event is over and the feeling lingers", invitation: "After the party, the argument, the ceremony. Draw the room — or the person — in the time when something significant has just ended.", chips: ["RESIDUE", "QUIET", "SHIFTED"] },
  { id: "between-seasons", category: "TIME",    name: "Between Seasons",      verse: "neither one thing nor the other",             invitation: "Late autumn that looks like early spring. Warm days inside cold months. Draw the season that refuses to commit.",                           chips: ["TRANSITIONAL", "UNCERTAIN", "SOFT"] },

  // ── MEMORY ─────────────────────────────────────────────────────────────────
  { id: "things-left",     category: "MEMORY",  name: "Things Left Behind",   verse: "objects that remember more than people do",   invitation: "A coat on a hook. An unmade bed. A cup still warm. Draw the absence of someone through what they touched.",                                chips: ["STILL LIFE", "MEMORY", "QUIET"] },
  { id: "inherited",       category: "MEMORY",  name: "Inherited",            verse: "shapes that crossed generations to reach you", invitation: "Old hands. A faded pattern. A gesture you recognise without knowing where you learned it. Draw what was passed down without words.",     chips: ["ANCESTRY", "WORN", "TENDER"] },
  { id: "photographs",     category: "MEMORY",  name: "Photographs",          verse: "the past frozen in a rectangle",              invitation: "Old photos — grainy, faded, badly composed. Draw someone looking at a photograph, or draw the scene captured long ago.",                   chips: ["FADED", "NOSTALGIC", "FRAMED"] },
  { id: "almost-forgotten",category: "MEMORY",  name: "Almost Forgotten",     verse: "on the edge of disappearing",                 invitation: "A memory you can only half-see — blurred at the edges, missing pieces. Draw what it feels like to remember imperfectly.",                  chips: ["BLURRED", "FRAGILE", "FADING"] },
  { id: "same-place",      category: "MEMORY",  name: "The Same Place Twice", verse: "returning to a place that hasn't waited",     invitation: "A childhood street revisited. A restaurant that changed. Draw the gap between a remembered place and the real one.",                       chips: ["RETURN", "CHANGED", "LAYERED"] },
  { id: "what-remains",    category: "MEMORY",  name: "What Remains",         verse: "after the loss, the inventory",               invitation: "The things a person left behind. Not haunted — just present. Draw the ordinary objects that outlast their owners.",                        chips: ["ABSENCE", "TENDER", "PLAIN"] },

  // ── TENSION ────────────────────────────────────────────────────────────────
  { id: "waiting-room",    category: "TENSION", name: "The Waiting Room",     verse: "suspended between here and what comes next",  invitation: "Chairs in a row. A number being called. Draw the held-breath quality of waiting for something you cannot hurry.",                          chips: ["SUSPENDED", "ANXIOUS", "STILL"] },
  { id: "just-before",     category: "TENSION", name: "Just Before",          verse: "the last moment of not knowing",              invitation: "Before the diagnosis, the decision, the fall. Draw the moment when everything is still possible — and that's the terrifying part.",        chips: ["PRECIPICE", "TENSE", "CHARGED"] },
  { id: "pursuit",         category: "TENSION", name: "Pursuit",              verse: "hunter and hunted inside the same body",      invitation: "Someone running — toward or away from something. Or the feeling of being followed. Draw motion charged with fear or desire.",               chips: ["MOTION", "URGENT", "FEAR"] },
  { id: "argument-after",  category: "TENSION", name: "Argument Aftermath",   verse: "the air still rearranged from raised voices", invitation: "Two figures no longer speaking. A room that witnessed something. Draw the silence that comes after conflict.",                              chips: ["FRACTURED", "COLD", "SILENCE"] },
  { id: "precipice",       category: "TENSION", name: "The Precipice",        verse: "standing at the edge of a decision",          invitation: "A cliff, a diving board, a door. The moment before a choice that cannot be undone. Draw the view from the edge.",                         chips: ["EDGE", "VERTIGINOUS", "STILL"] },
  { id: "tipping-point",   category: "TENSION", name: "Tipping Point",        verse: "the pivot between states",                    invitation: "Something in the act of changing. Ice becoming water. A tower mid-fall. Draw the moment of transformation.",                               chips: ["TRANSITION", "UNSTABLE", "MOMENT"] },

  // ── QUIET ──────────────────────────────────────────────────────────────────
  { id: "empty-table",     category: "QUIET",   name: "Empty Table",          verse: "presence through absence",                    invitation: "A table set for people who haven't arrived — or who have already gone. Draw the suggestion of a gathering without the gathering.",          chips: ["ABSENT", "DOMESTIC", "RESONANT"] },
  { id: "sunday-morning",  category: "QUIET",   name: "Sunday Morning",       verse: "the week's one soft edge",                    invitation: "Late light through curtains. Coffee getting cold. No urgency anywhere. Draw the texture of time when nothing is required.",                chips: ["SLOW", "WARM", "UNHURRIED"] },
  { id: "reading-alone",   category: "QUIET",   name: "Reading Alone",        verse: "the most private form of company",            invitation: "Someone absorbed in a book — elsewhere without moving. Draw the quality of deep concentration, the body present while the mind is not.",  chips: ["ABSORBED", "INTERIOR", "STILL"] },
  { id: "fog",             category: "QUIET",   name: "Fog",                  verse: "the world editing itself",                    invitation: "Reduced visibility. Shapes half-there. Sounds closer than they should be. Draw what happens when the world removes its own detail.",       chips: ["OBSCURED", "SOFT", "CLOSE"] },
  { id: "garden-winter",   category: "QUIET",   name: "The Garden in Winter", verse: "dormancy is not death",                       invitation: "Bare branches, frost on soil, seed heads still standing. Draw a living thing in its resting state.",                                       chips: ["DORMANT", "BARE", "PATIENT"] },
  { id: "still-life",      category: "QUIET",   name: "A Still Life with Light", verse: "ordinary objects made strange by attention", invitation: "Whatever is on the table. Fruit, glass, cloth, shadow. Draw the specific quality of light on a specific surface at a specific moment.",chips: ["STILL LIFE", "PRECISE", "OBSERVED"] },

  // ── MYTH ───────────────────────────────────────────────────────────────────
  { id: "forest-spirits",  category: "MYTH",    name: "Forest Spirits",       verse: "something watching between the trees",        invitation: "Old forests have old presences. Draw what might live in a place that hasn't changed in centuries — seen from the corner of the eye.",       chips: ["FOLKLORIC", "EARTHY", "MYSTICAL"] },
  { id: "the-sea",         category: "MYTH",    name: "The Sea",              verse: "older than everything watching it",           invitation: "Not the pleasant sea — the deep one, the dangerous one. Draw the sea as an entity rather than a backdrop.",                               chips: ["PRIMAL", "VAST", "ANCIENT"] },
  { id: "dream-geography", category: "MYTH",    name: "Dream Geography",      verse: "places that follow their own rules",          invitation: "A staircase to nowhere. A room inside a room. A landscape that doesn't obey physics. Draw a place from a dream.",                         chips: ["SURREAL", "IMPOSSIBLE", "INTERIOR"] },
  { id: "omen",            category: "MYTH",    name: "Omen",                 verse: "the universe speaking in signs",              invitation: "A flock of birds moving strangely. An object that appears twice. Draw the feeling of meaning arriving unexpectedly.",                      chips: ["PORTENT", "CHARGED", "STRANGE"] },
  { id: "the-crossing",    category: "MYTH",    name: "The Crossing",         verse: "between one world and the next",              invitation: "Myths are full of crossings — rivers, bridges, thresholds between living and dead. Draw an act of passage.",                               chips: ["MYTHIC", "CROSSING", "TRANSITION"] },
  { id: "old-magic",       category: "MYTH",    name: "Old Magic",            verse: "before it was called superstition",           invitation: "Herbs drying in a window. Symbols drawn in dust. Draw a practice passed down so long it no longer has a reason.",                         chips: ["ANCIENT", "RITUAL", "EARTHY"] },
  { id: "ritual",          category: "MYTH",    name: "Ritual",               verse: "the act that makes ordinary time sacred",     invitation: "Repetition as meaning. A gesture performed the same way every time. Draw ceremony — domestic, religious, or invented.",                   chips: ["CEREMONY", "REPETITION", "SACRED"] },
];

export default function ReferencesPage() {
  const { activeBoardId, setActiveBoardId, setSelectedStyleChips } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");

  const visible = activeFilter === "ALL" ? BOARDS : BOARDS.filter((b) => b.category === activeFilter);

  const handleSelect = (board: Board) => {
    if (activeBoardId === board.id) {
      setActiveBoardId(null);
      setSelectedStyleChips([]);
    } else {
      setActiveBoardId(board.id);
      setSelectedStyleChips(board.chips);
    }
  };

  return (
    <div className="flex flex-col h-full bg-canvas">

      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-1">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink-muted">
          Draw from
        </p>
        <p className="font-display italic text-[13px] text-ink/35 mt-0.5">
          moods worth sitting with
        </p>
      </div>

      {/* Filter tabs */}
      <div
        className="flex-shrink-0 flex gap-0 px-5 mt-3 border-b border-ink/[0.07] overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => {
          const isActive = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={clsx(
                "relative mr-5 pb-2.5 pt-0.5 whitespace-nowrap shrink-0",
                "font-body text-[10px] tracking-[0.15em] uppercase",
                "transition-colors duration-100",
                isActive ? "text-ink" : "text-ink/30 hover:text-ink/50"
              )}
            >
              {f}
              {isActive && (
                <motion.div
                  layoutId="ref-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ink"
                  transition={{ duration: 0.18, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-3">
        {visible.map((board) => {
          const isActive = board.id === activeBoardId;
          return (
            <button
              key={board.id}
              type="button"
              onClick={() => handleSelect(board)}
              className={clsx(
                "w-full bg-paper border border-ink/[0.08] rounded-2xl p-4 text-left",
                "transition-all duration-150 active:scale-[0.985]",
                isActive ? "shadow-card-lg ring-1 ring-ink/20" : "shadow-card"
              )}
            >
              {/* Category label */}
              <p className="font-body text-[8px] tracking-[0.2em] uppercase text-ink/25 mb-1">
                {board.category}
              </p>

              {/* Name + verse */}
              <p className="font-display text-[17px] text-ink leading-tight">
                {board.name}
              </p>
              <p className="font-body text-[11px] text-ink/40 italic leading-snug mt-0.5">
                {board.verse}
              </p>

              {/* Invitation — only visible when active */}
              {isActive && (
                <p className="font-body text-[12px] text-ink/65 leading-relaxed mt-3 mb-1">
                  {board.invitation}
                </p>
              )}

              {/* Chips */}
              <div className="flex flex-wrap gap-1 mt-3">
                {board.chips.map((chip) => (
                  <span
                    key={chip}
                    className={clsx(
                      "rounded-full border px-2.5 py-0.5",
                      "font-body text-[9px] tracking-[0.12em] uppercase",
                      isActive ? "border-ink/20 text-ink/60" : "border-ink/10 text-ink/35"
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
