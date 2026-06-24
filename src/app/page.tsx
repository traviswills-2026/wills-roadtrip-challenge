"use client";

import { useState } from "react";

const FAMILY = [
  { name: "Dad", color: "#3B82F6" },
  { name: "Mom", color: "#EC4899" },
  { name: "Bekah", color: "#F97316" },
  { name: "Micah", color: "#22C55E" },
  { name: "Leah", color: "#EAB308" },
  { name: "Moriah", color: "#A855F7" },
];
const DRIVER_WEIGHTS: Record<string, number> = {
  Dad: 40,
  Mom: 15,
  Bekah: 15,
  Micah: 15,
  Leah: 7.5,
  Moriah: 7.5,
};
const SEATING_LAYOUTS = {
  Dad: [
    {
      id: "D1",
      seats: [
        ["Dad", "Moriah", "Mom"],
        ["Bekah", "Leah", "Micah"],
      ],
    },
    {
      id: "D2",
      seats: [
        ["Dad", "Mom", "Leah"],
        ["Bekah", "Moriah", "Micah"],
      ],
    },
    {
      id: "D3",
      seats: [
        ["Dad", "Mom", "Moriah"],
        ["Bekah", "Leah", "Micah"],
      ],
    },
  ],

  Mom: [
    {
      id: "M1",
      seats: [
        ["Mom", "Moriah", "Dad"],
        ["Micah", "Leah", "Bekah"],
      ],
    },
    {
      id: "M2",
      seats: [
        ["Mom", "Moriah", "Micah"],
        ["Dad", "Leah", "Bekah"],
      ],
    },
    {
      id: "M3",
      seats: [
        ["Mom", "Moriah", "Bekah"],
        ["Dad", "Leah", "Micah"],
      ],
    },
  ],

  Micah: [
    {
      id: "MI1",
      seats: [
        ["Micah", "Moriah", "Mom"],
        ["Bekah", "Leah", "Dad"],
      ],
    },
    {
      id: "MI2",
      seats: [
        ["Micah", "Moriah", "Dad"],
        ["Mom", "Leah", "Bekah"],
      ],
    },
  ],

  Bekah: [
    {
      id: "B1",
      seats: [
        ["Bekah", "Moriah", "Mom"],
        ["Dad", "Leah", "Micah"],
      ],
    },
    {
      id: "B2",
      seats: [
        ["Bekah", "Moriah", "Dad"],
        ["Mom", "Leah", "Micah"],
      ],
    },
  ],

  Leah: [
    {
      id: "L1",
      seats: [
        ["Leah", "Mom", "Dad"],
        ["Micah", "Moriah", "Bekah"],
      ],
    },
  ],

  Moriah: [
    {
      id: "MO1",
      seats: [
        ["Moriah", "Mom", "Dad"],
        ["Micah", "Leah", "Bekah"],
      ],
    },
  ],
};
export default function Home() {
  const [screen, setScreen] = useState("welcome");

  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");

  const [selectedTravelers, setSelectedTravelers] = useState(
    FAMILY.map((person) => person.name)
  );

  const [extraTravelers, setExtraTravelers] = useState<
  { name: string; color: string }[]
>([]);
  const [newTraveler, setNewTraveler] = useState("");
  const [newTravelerColor, setNewTravelerColor] =
  useState("#EF4444");
  const [photoPreview, setPhotoPreview] = useState("");
  const [currentDriver, setCurrentDriver] = useState("");
const [previousDriver, setPreviousDriver] = useState("");
const [seatLayoutId, setSeatLayoutId] = useState("");
const [seatStatus, setSeatStatus] = useState("");
const [seatAssignments, setSeatAssignments] = useState<string[][]>([]);
const [isAssigningSeats, setIsAssigningSeats] = useState(false);
const [isPickingDriver, setIsPickingDriver] = useState(false);
const [displayDriver, setDisplayDriver] = useState("");
const [winnerFlash, setWinnerFlash] = useState(false);
const [driverStatus, setDriverStatus] = useState("🎲 Ready to Pick");
const [scores, setScores] = useState<Record<string, number>>({});

  function toggleTraveler(name: string) {
    if (selectedTravelers.includes(name)) {
      setSelectedTravelers(
        selectedTravelers.filter((traveler) => traveler !== name)
      );
    } else {
      setSelectedTravelers([...selectedTravelers, name]);
    }
  }

  function addTraveler() {
  const traveler = newTraveler.trim();

  if (!traveler) return;

  if (
    extraTravelers.some(
      (t) => t.name === traveler
    ) ||
    FAMILY.some(
      (person) => person.name === traveler
    )
  ) {
    setNewTraveler("");
    return;
  }

  setExtraTravelers([
    ...extraTravelers,
    {
      name: traveler,
      color: newTravelerColor,
    },
  ]);

  setNewTraveler("");
}

  function removeExtraTraveler(name: string) {
  setExtraTravelers(
    extraTravelers.filter(
      (traveler) => traveler.name !== name
    )
  );
}
  function handlePhotoUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  setPhotoPreview(imageUrl);
}
function pickNextDriver() {
  if (isPickingDriver) return;
setSeatAssignments([]);
setSeatLayoutId("");
setSeatStatus("");
  const allDrivers = [
    ...selectedTravelers,
    ...extraTravelers.map((t) => t.name),
  ];

  if (allDrivers.length === 0) {
    alert("Add at least one traveler.");
    return;
  }

  setIsPickingDriver(true);
  setDriverStatus("🎲 Choosing Driver...");
const firstDriver =
  allDrivers[
    Math.floor(Math.random() * allDrivers.length)
  ];

setDisplayDriver(firstDriver);
const spinSpeeds = [
  75,
  75,
  75,
  75,
  100,
  125,
  150,
  200,
  300,
  450,
];

let totalDelay = 0;

spinSpeeds.forEach((delay, index) => {
  totalDelay += delay;

  setTimeout(() => {
    if (index >= spinSpeeds.length - 3) {
      setDriverStatus("🎯 Locking In...");
    }

    const randomDriver =
      allDrivers[
        Math.floor(Math.random() * allDrivers.length)
      ];

    setDisplayDriver(randomDriver);
  }, totalDelay);
});
   
setTimeout(() => {

    const eligibleDrivers = allDrivers.filter(
      (driver) => driver !== previousDriver
    );

    let totalWeight = 0;

    const weightedDrivers = eligibleDrivers.map(
      (driver) => {
        const weight =
          DRIVER_WEIGHTS[driver] ?? 5;

        totalWeight += weight;

        return {
          driver,
          weight,
        };
      }
    );

    let random =
      Math.random() * totalWeight;

    let winner = eligibleDrivers[0];

    for (const entry of weightedDrivers) {
      random -= entry.weight;

      if (random <= 0) {
        winner = entry.driver;
        break;
      }
    }

    setCurrentDriver(winner);
    setDisplayDriver(winner);
    setPreviousDriver(winner);

    setWinnerFlash(true);

    setTimeout(() => {
    setWinnerFlash(false);
  }, 600);

setDriverStatus("🎉 Drives Next!");

setTimeout(() => {
  assignSeats(winner);
}, 1000);
  }, totalDelay + 250);
}
function getTravelerColor(name: string) {
  const familyTraveler = FAMILY.find(
    (person) => person.name === name
  );

  if (familyTraveler) {
    return familyTraveler.color;
  }

  const extraTraveler = extraTravelers.find(
    (person) => person.name === name
  );

  return extraTraveler?.color || "#FFFFFF";
}
function assignSeats(driver: string) {
  const layouts =
    SEATING_LAYOUTS[
      driver as keyof typeof SEATING_LAYOUTS
    ];

  if (!layouts) return;

  setIsAssigningSeats(true);
  setSeatStatus("🪑 Assigning Seats...");

  let totalDelay = 0;

  const spinLayouts = [
    ...layouts,
    ...layouts,
    ...layouts,
  ];

  spinLayouts.forEach((layout, index) => {
    totalDelay +=
      index < spinLayouts.length - 3
        ? 100
        : 250;

   setTimeout(() => {
  setSeatLayoutId(layout.id);
  setSeatAssignments(layout.seats);
}, totalDelay);
  });

  setTimeout(() => {
    const winner =
      layouts[
        Math.floor(
          Math.random() * layouts.length
        )
      ];

    setSeatLayoutId(winner.id);
    setSeatAssignments(winner.seats);
    setSeatStatus("🎉 Seats Assigned!");

setTimeout(() => {
  setIsAssigningSeats(false);
  setIsPickingDriver(false);
}, 1000);
  }, totalDelay + 300);
}
function awardPoints(
  traveler: string,
  points: number
) {
  setScores((prev) => ({
    ...prev,
    [traveler]:
      (prev[traveler] || 0) + points,
  }));
}
  // WELCOME SCREEN

  if (screen === "welcome") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#4f4f4f",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(42px, 9vw, 64px)",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "3px",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            ROADTRIP
            <br />
            CHALLENGE
          </h1>

          <p
            style={{
              fontSize: "clamp(20px, 5vw, 32px)",
              fontWeight: 600,
              marginBottom: "30px",
            }}
          >
            Every Trip Tells A Story
          </p>

          <p
            style={{
              fontSize: "clamp(16px, 3vw, 22px)",
              lineHeight: 1.6,
              marginBottom: "40px",
            }}
          >
            Turn ordinary road trips into family memories you'll
            actually remember.
          </p>

          <div
            style={{
              marginBottom: "40px",
              fontSize: "20px",
              lineHeight: 2,
            }}
          >
            📸 Capture Moments
            <br />
            🏆 Earn Points
            <br />
            🚚 Build Traditions
          </div>
<button
  onClick={() => setScreen("setup")}
  style={{
    width: "100%",
    maxWidth: "420px",
    padding: "22px",
    fontSize: "26px",
    fontWeight: 800,
    borderRadius: "18px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#16A34A",
    color: "white",
    boxShadow: "0 8px 20px rgba(22,163,74,0.35)",
    marginBottom: "20px",
    letterSpacing: "1px",
  }}
>
  START A NEW TRIP
</button>

<button
  style={{
    width: "100%",
    maxWidth: "420px",
    padding: "18px",
    fontSize: "22px",
    fontWeight: 700,
    borderRadius: "18px",
    border: "2px solid white",
    cursor: "pointer",
    background: "transparent",
    color: "white",
    letterSpacing: "1px",
  }}
>
  VIEW PREVIOUS ADVENTURES
</button>

        </div>
      </main>
    );
  }


// DASHBOARD SCREEN

if (screen === "dashboard") {
  const travelerCount =
    selectedTravelers.length + extraTravelers.length;
const allTravelers = [
  ...selectedTravelers,
  ...extraTravelers.map((t) => t.name),
];
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundImage: photoPreview
          ? `linear-gradient(
              rgba(0,0,0,0.65),
              rgba(0,0,0,0.65)
            ),
            url(${photoPreview})`
          : undefined,
        backgroundColor: "#4f4f4f",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "50px",
            opacity: 0.9,
          }}
        >
          <button
            onClick={() =>
              alert("Menu coming soon!")
            }
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>

          <div
            style={{
              fontWeight: 700,
              letterSpacing: "2px",
              fontSize: "14px",
            }}
          >
            ROADTRIP CHALLENGE
          </div>
        </div>

        {/* Hero */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(38px, 8vw, 56px)",
              fontWeight: 900,
              marginBottom: "10px",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {tripName || "My Adventure"}
          </h1>

          <p
            style={{
              fontSize: "clamp(18px, 4vw, 24px)",
              marginBottom: "20px",
              opacity: 0.95,
            }}
          >
            Every Trip Tells A Story
          </p>

          <div
            style={{
              fontSize: "18px",
              opacity: 0.9,
            }}
          >
            🚚 {travelerCount} Travelers • 📸 0 Moments
          </div>
        </div>

        {/* Moments Card */}

        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <h2>📸 Roadtrip Moments</h2>

          <p>
            Capture the memories that make this trip
            unforgettable.
          </p>

          <button
            style={{
              marginTop: "10px",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            CAPTURE MOMENT
          </button>
        </div>

        {/* Driver Button */}

        <button
  onClick={pickNextDriver}
  disabled={
  isPickingDriver || isAssigningSeats
}
  style={{
  width: "100%",
  padding: "20px",
  fontSize: "24px",
  marginBottom: "20px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  background: "#16A34A",
  color: "white",
  boxShadow: "0 8px 20px rgba(22,163,74,0.35)",
}}
        >
          {isAssigningSeats
  ? "🪑 ASSIGNING SEATS..."
  : isPickingDriver
  ? "🎲 PICKING DRIVER..."
  : "🎲 PICK NEXT DRIVER"}
        </button>



        {/* Leaderboard Card */}

        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <h2>🚗 Next Driver</h2>

{displayDriver ? (
  <>
    <div
      style={{
  fontSize: "clamp(36px,8vw,56px)",
  fontWeight: 800,
  marginTop: "12px",
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: getTravelerColor(displayDriver),
  transform: winnerFlash
    ? "scale(1.5)"
    : "scale(1)",
  transition: "all 0.3s ease",
  display: "inline-block",
transformOrigin: "center center",
}}
    >
      {displayDriver}
    </div>

    <p
  style={{
    marginTop: "12px",
    opacity: 0.9,
    fontWeight: 600,
    letterSpacing: "1px",
  }}
>
  {driverStatus}
</p>
  </>
) : (
  <p>🎲 Ready to Pick</p>
)}
        </div>

        {/* Seating Card */}

        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <h2>🪑 Family Seating</h2>

          {seatLayoutId && (
            <>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                {seatLayoutId}
              </div>

              <p>{seatStatus}</p>
            </>
          )}

{seatAssignments.length > 0 && (
  <>
    <div
      style={{
        marginTop: "20px",
        textAlign: "center",
        opacity: 0.9,
        marginBottom: "12px",
        fontWeight: 700,
        letterSpacing: "1px",
      }}
    >
      🚘 FRONT ROW
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginBottom: "24px",
      }}
    >
      {seatAssignments[0]?.map((person) => (
        <div
          key={person}
          style={{
            background: "rgba(255,255,255,0.18)",
            borderRadius: "16px",
            padding: "18px",
            textAlign: "center",
            fontWeight: 800,
            color: getTravelerColor(person),
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {person}
        </div>
      ))}
    </div>

    <div
      style={{
        textAlign: "center",
        opacity: 0.9,
        marginBottom: "12px",
        fontWeight: 700,
        letterSpacing: "1px",
      }}
    >
      🧳 BACK ROW
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
      }}
    >
      {seatAssignments[1]?.map((person) => (
        <div
          key={person}
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "16px",
            padding: "18px",
            textAlign: "center",
            fontWeight: 800,
            color: getTravelerColor(person),
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {person}
        </div>
      ))}
    </div>
  </>
)}

        </div>

{/* Leaderboard Card */}

<div
  style={{
    background: "rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    backdropFilter: "blur(4px)",
  }}
>
  <h2>🏆 Trip Leaderboard</h2>

  {allTravelers
  .map((name) => ({
    name,
    score: scores[name] || 0,
  }))
  .sort((a, b) => b.score - a.score)
  .map(({ name, score }, index) => (
      <div
        key={name}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 0",
          borderBottom:
            index <
            allTravelers.length - 1
              ? "1px solid rgba(255,255,255,0.15)"
              : "none",
        }}
      >
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <span
    style={{
      color: getTravelerColor(name),
      fontWeight: 700,
    }}
  >
    {index === 0
      ? "🥇 "
      : index === 1
      ? "🥈 "
      : index === 2
      ? "🥉 "
      : ""}
    {name}
  </span>

  <button
    onClick={() => awardPoints(name, 5)}
    style={{
      border: "none",
      borderRadius: "8px",
      padding: "2px 8px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "12px",
      background: getTravelerColor(name),
      color: "white",
    }}
  >
    +5
  </button>
</div>

        <span>{score}</span>
      </div>
    ))}
</div>

<button
  onClick={() => setScreen("setup")}
  style={{
    marginTop: "30px",
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  Back to Setup
</button>

      </div>
    </main>
  );
}

  // SETUP SCREEN

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#4f4f4f",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "rgba(0,0,0,0.35)",
          borderRadius: "24px",
          padding: "24px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(36px, 8vw, 56px)",
            fontWeight: 900,
            lineHeight: 0.9,
            marginBottom: "10px",
          }}
        >
          ROADTRIP
          <br />
          CHALLENGE
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "clamp(18px, 4vw, 28px)",
            marginBottom: "30px",
          }}
        >
          Every Trip Tells A Story
        </p>
<h2>Trip Cover Photo</h2>

<label
  style={{
    display: "block",
    cursor: "pointer",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      height: "220px",
      borderRadius: "16px",
      border: "3px dashed #999",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#333",
    }}
  >
    {photoPreview ? (
      <img
        src={photoPreview}
        alt="Trip Cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    ) : (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px" }}>📸</div>
        <div>Tap to add a cover photo</div>
      </div>
    )}
  </div>

  <input
    type="file"
    accept="image/*"
    onChange={handlePhotoUpload}
    style={{ display: "none" }}
  />
</label>
        <h2>Trip Name</h2>

        <input
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          placeholder="Outer Banks 2026"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        />

        <h2>Destination</h2>

        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Frisco, NC"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
          }}
        />

        <h2 style={{ marginTop: "30px" }}>Travelers</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {FAMILY.map((person) => {
            const selected = selectedTravelers.includes(person.name);

            return (
              <button
                key={person.name}
                onClick={() => toggleTraveler(person.name)}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: selected ? "white" : "#444",
                  background: selected
                    ? person.color
                    : "#d1d5db",
                }}
              >
                {selected
                  ? `${person.name.toUpperCase()} ✓`
                  : person.name.toUpperCase()}
              </button>
            );
          })}
        </div>

        <h2 style={{ marginTop: "30px" }}>
          Additional Travelers
        </h2>
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  }}
>
  {[
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#6366F1", // indigo
  "#84CC16", // lime
  "#F59E0B", // amber
  "#DC2626", // red
  "#64748B", // slate
  "#92400E", // brown
  "#F43F5E", // rose
  "#10B981", // emerald
].map((color) => (
    <button
      key={color}
      onClick={() =>
        setNewTravelerColor(color)
      }
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border:
          newTravelerColor === color
            ? "3px solid white"
            : "1px solid #555",
        background: color,
        cursor: "pointer",
      }}
    />
  ))}
</div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={newTraveler}
            onChange={(e) => setNewTraveler(e.target.value)}
            placeholder="Grandma"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
            }}
          />

          <button onClick={addTraveler}>
            Add
          </button>
        </div>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {extraTravelers.map((traveler) => (
  <button
    key={traveler.name}
    onClick={() =>
      removeExtraTraveler(traveler.name)
    }
    style={{
      background: traveler.color,
      color: "white",
      border: "none",
      padding: "10px 14px",
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    {traveler.name.toUpperCase()} ✕
  </button>
))}
        </div>

        <button
          onClick={() => setScreen("dashboard")}
          style={{
            marginTop: "40px",
            width: "100%",
            padding: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            borderRadius: "16px",
            border: "none",
            cursor: "pointer",
            background: "#16A34A",
            color: "white",
          }}
        >
          🚚 START ADVENTURE
        </button>
      </div>
    </main>
  );
}