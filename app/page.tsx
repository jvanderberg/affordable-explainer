"use client";

import { useEffect, useRef, useState } from "react";

type StoryStep = { kicker: string; title: string; body: string };

function useScrollSteps(count: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-32% 0px -46% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    refs.current.slice(0, count).forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [count]);

  return { active, refs };
}

function StoryText({ steps, active, refs }: { steps: StoryStep[]; active: number; refs: React.MutableRefObject<(HTMLElement | null)[]> }) {
  return (
    <div className="story-copy">
      {steps.map((step, index) => (
        <section
          className={`story-step ${active === index ? "is-active" : ""}`}
          data-step={index}
          ref={(node) => { refs.current[index] = node; }}
          key={step.title}
        >
          <span>{step.kicker}</span>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
        </section>
      ))}
    </div>
  );
}

const cohortSteps: StoryStep[] = [
  { kicker: "Start with new housing", title: "New housing starts out expensive.", body: "Between land, labor and financing, a newly finished apartment almost always rents near the top of the market." },
  { kicker: "Then let time work", title: "Decades later, those apartments serve the middle market.", body: "Most of the ordinary housing around town today started life as new construction in the 1950s, 60s and 70s." },
  { kicker: "Then Oak Park stopped building", title: "Building slowed for four straight decades.", body: "Starting in the 1980s, Oak Park added housing at roughly half its earlier pace. The units that never got built would be reaching middle age, and middle-market prices, right about now." },
  { kicker: "The result arrives today", title: "We’re missing decades of older housing.", body: "Measured against the earlier pace of building, that’s about 3,300 missing units of what would now be affordable housing." },
];

const cohortData = [
  { era: "1940s", units: 1280 }, { era: "1950s", units: 1547 }, { era: "1960s", units: 2118 },
  { era: "1970s", units: 1736 }, { era: "1980s", units: 722 }, { era: "1990s", units: 549 },
  { era: "2000s", units: 1122 }, { era: "2010s", units: 975 },
];

function CohortGraphic({ active }: { active: number }) {
  const max = 2118;
  const earlierAverage = 1670;
  const laterAverage = 842;
  return (
    <div className={`cohort-graphic scene-${active}`} aria-live="polite">
      <div className="scene-heading">
        <span>OAK PARK HOUSING BY DECADE BUILT</span>
        <strong>{active < 2 ? "Housing ages into affordability" : active === 2 ? "Construction fell" : "Four decades below the old pace"}</strong>
      </div>
      <div className="cohort-bars" role="img" aria-label="Chart of Oak Park housing by decade built, comparing an average of 1,670 units per decade from the 1940s through the 1970s with 842 units per decade from the 1980s through the 2010s.">
        {cohortData.map((item, index) => (
          <div className={`cohort ${index >= 4 ? "missing" : ""}`} key={item.era}>
            <div className="unit-label">{item.units.toLocaleString()}</div>
            <div className="cohort-tower" style={{ "--tower": `${(item.units / max) * 100}%`, "--delay": `${index * 55}ms` } as React.CSSProperties}>
              {Array.from({ length: 12 }).map((_, i) => <i key={i} />)}
            </div>
            <span>{item.era}</span>
          </div>
        ))}
        <div className="average-line earlier-average" style={{ "--level": `${(earlierAverage / max) * 100}%` } as React.CSSProperties}><span>1940s–70s average · 1,670 per decade</span></div>
        <div className="average-band" style={{ "--high": `${(earlierAverage / max) * 100}%`, "--low": `${(laterAverage / max) * 100}%` } as React.CSSProperties} aria-hidden="true">
          <div className="band-callout"><strong>3,313</strong><span>units short of the earlier pace</span></div>
          <em>1980s–2010s average · 842</em>
        </div>
      </div>
      <div className="gap-callout"><b>1980–2019</b><strong>3,368</strong><span>units built</span><span>vs 6,681 in the prior four decades</span></div>
      <p className="scene-note">ACS 2024 five-year estimate · year built of current stock</p>
    </div>
  );
}

function CohortStory() {
  const { active, refs } = useScrollSteps(cohortSteps.length);
  return (
    <section className="scroll-story cohort-story">
      <div className="story-stage"><CohortGraphic active={active} /><div className="chapter-count">0{active + 1} / 04</div></div>
      <StoryText steps={cohortSteps} active={active} refs={refs} />
    </section>
  );
}

const chainSteps: StoryStep[] = [
  { kicker: "Before construction", title: "Every apartment is occupied.", body: "Three households live in three existing buildings. Nobody can move without competing for an available apartment." },
  { kicker: "One new apartment opens", title: "Household A moves into the new building.", body: "A doesn’t displace anyone, and the apartment A leaves behind is now empty." },
  { kicker: "That vacancy is useful", title: "Household B moves into A’s former apartment.", body: "B gets a newer place, and B’s old apartment becomes the available one." },
  { kicker: "One more move", title: "Household C moves. An older apartment opens.", body: "The new building never had to be cheap itself. By setting off three moves, it eased competition farther down the market." },
];

function VacancyGraphic({ active }: { active: number }) {
  const buildings = [
    { era: "NEW", sub: "JUST BUILT" },
    { era: "2000s", sub: "A LIVES HERE" },
    { era: "1980s", sub: "B LIVES HERE" },
    { era: "1960s", sub: "C LIVES HERE" },
  ];
  const vacancyAt = active === 0 ? -1 : active;
  return (
    <div className={`cascade-graphic cascade-${active}`} aria-live="polite">
      <div className="cascade-header">
        <span>ONE NEW APARTMENT · THREE MOVES</span>
        <strong>{active === 0 ? "No vacancy" : active === 3 ? "An older apartment is now open" : "The vacancy moves one building over"}</strong>
      </div>
      <div className="cascade-board" role="img" aria-label={`Step ${active + 1}: ${chainSteps[active].title}`}>
        <div className="cascade-path" aria-hidden="true">
          <i className={active >= 1 ? "on" : ""}>←</i>
          <i className={active >= 2 ? "on" : ""}>←</i>
          <i className={active >= 3 ? "on" : ""}>←</i>
        </div>
        <div className="cascade-buildings">
          {buildings.map((building, index) => (
            <div className={`cascade-building building-${index}`} key={building.era}>
              <div className="building-face">
                {Array.from({ length: 6 }).map((_, window) => <i key={window} />)}
                <div className={`apartment-slot ${vacancyAt === index ? "vacant" : ""}`}>{vacancyAt === index ? "VACANT" : ""}</div>
              </div>
              <strong>{building.era}</strong>
              <span>{active === 0 ? building.sub : index === 0 ? "A MOVED HERE" : index === 1 ? (active >= 2 ? "B MOVED HERE" : "A MOVED OUT") : index === 2 ? (active >= 3 ? "C MOVED HERE" : active >= 2 ? "B MOVED OUT" : "B LIVES HERE") : active >= 3 ? "C MOVED OUT" : "C LIVES HERE"}</span>
            </div>
          ))}
        </div>
        <div className="resident resident-a"><b>A</b><span>HOUSEHOLD A</span></div>
        <div className="resident resident-b"><b>B</b><span>HOUSEHOLD B</span></div>
        <div className="resident resident-c"><b>C</b><span>HOUSEHOLD C</span></div>
      </div>
      <div className="cascade-result">
        <div><span>NEW APARTMENTS BUILT</span><strong>{active === 0 ? "0" : "1"}</strong></div>
        <div><span>HOUSEHOLDS THAT MOVED</span><strong>{active}</strong></div>
        <div className={active === 3 ? "complete" : ""}><span>OLDER APARTMENTS OPENED</span><strong>{active === 3 ? "1" : "0"}</strong></div>
      </div>
      {active === 3 && <p className="cascade-footnote">In Mast’s study, 100 new market-rate units reduced demand by roughly 70 units in below-median-income neighborhoods within about five years.</p>}
    </div>
  );
}

function ChainStory() {
  const { active, refs } = useScrollSteps(chainSteps.length);
  return (
    <section className="scroll-story chain-story">
      <div className="story-stage"><VacancyGraphic active={active} /><div className="chapter-count">0{active + 1} / 04</div></div>
      <StoryText steps={chainSteps} active={active} refs={refs} />
    </section>
  );
}

const proofSteps: StoryStep[] = [
  { kicker: "Since 2012", title: "Oak Park built 1,751 multifamily units.", body: "Nearly all of them opened at market rate." },
  { kicker: "Directly restricted", title: "Only 50 of those new units were deed-restricted affordable.", body: "Those units matter, but they’re a small slice of everything that went up." },
  { kicker: "Meanwhile", title: "IHDA counted 1,350 more affordable units.", body: "The count rose from 3,991 in 2013 to 5,341 in 2023. Fifty restricted units can’t account for a change that size." },
];

function ProofGraphic({ active }: { active: number }) {
  const values = ["1,751", "50", "+1,350"];
  const labels = ["NEW MULTIFAMILY", "DEED-RESTRICTED", "AFFORDABLE COUNT"];
  return (
    <div className={`proof-graphic proof-${active}`}>
      <span className="proof-overline">OAK PARK · THE LOCAL RECORD</span>
      <div className="proof-number" key={active}>{values[active]}</div>
      <div className="proof-label">{labels[active]}</div>
      <div className="proof-track">{values.map((value, i) => <div className={i <= active ? "on" : ""} key={value}><i /><span>{value}</span></div>)}</div>
      <p>{active === 2 ? "The affordable-unit count rose by 1,350 while Oak Park added 50 deed-restricted units." : "Scroll to follow the numbers."}</p>
      <div className="source-links"><a href="https://www.ihda.org/about-ihda/ahpaa" target="_blank" rel="noreferrer">IHDA affordability lists ↗</a><a href="https://www.oak-park.us/files/assets/public/v/1/development-customer-services/planning-division/documents/strategic-vision-for-housing_final_3.26.24_reduced.pdf" target="_blank" rel="noreferrer">Village housing strategy ↗</a></div>
    </div>
  );
}

function ProofStory() {
  const { active, refs } = useScrollSteps(proofSteps.length);
  return (
    <section className="scroll-story proof-story">
      <div className="story-stage"><ProofGraphic active={active} /><div className="chapter-count">0{active + 1} / 03</div></div>
      <StoryText steps={proofSteps} active={active} refs={refs} />
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <header className="masthead"><a href="#top" className="brand">OAK PARK, EXPLAINED</a><span>HOUSING · JULY 2026</span></header>
      <section className="hero" id="top">
        <div className="hero-sky" aria-hidden="true"><div className="sun" /><div className="hero-buildings">{Array.from({ length: 10 }).map((_, i) => <div className={`hero-building b${i}`} key={i}>{Array.from({ length: 6 }).map((__, j) => <i key={j} />)}</div>)}</div></div>
        <div className="hero-copy"><p className="eyebrow">How affordability is made</p><h1>Today’s “luxury” housing is tomorrow’s affordable housing.</h1><p className="dek">Oak Park’s own history shows how housing becomes affordable and how decades of anti-development sentiment have broken the cycle.</p><p className="byline">By Josh VanderBerg <span>•</span> Data from the U.S. Census Bureau, IHDA and the Village of Oak Park</p><a className="scroll-cue" href="#pipeline">SCROLL TO BEGIN <b>↓</b></a></div>
      </section>

      <section className="opening" id="pipeline"><div className="intro-card"><p>Almost all of Oak Park’s affordable housing started out as ordinary market-rate housing, built by private developers, for a profit, decades ago.</p><p>As newer buildings went up and drew the higher rents, older ones slid down the market and became a major source of lower-cost housing.</p></div></section>

      <CohortStory />

      <section className="bridge"><div><span>THE LONG GAME</span><h2>The expensive building of today becomes the ordinary building of tomorrow.</h2></div></section>

      <section className="filtering-intro"><span>AFFORDABILITY NOW</span><h2>But we don’t have to wait for buildings to age into affordability.</h2><p>New construction opens up existing housing right away.</p></section>

      <ChainStory />

      <section className="research-band"><div className="research-stat">5–7%</div><div><span>NEARBY RENT EFFECT</span><h2>Rents fell near new buildings.</h2><p>Across 11 cities, rents within roughly 800 feet of new market-rate apartments fell 5–7% relative to comparable buildings a little farther away.</p><div className="source-links"><a href="https://direct.mit.edu/rest/article/105/2/359/100977" target="_blank" rel="noreferrer">Asquith, Mast & Reed ↗</a><a href="https://www.sciencedirect.com/science/article/abs/pii/S0094119021000656" target="_blank" rel="noreferrer">Mast household-moves study ↗</a></div></div></section>

      <section className="local-record-intro"><span>THE LOCAL RECORD</span><h2>This works<br />here, too.</h2><p>Oak Park’s own numbers show the same pattern.</p></section>

      <ProofStory />

      <section className="policy">
        <div className="policy-intro"><span>TWO COMPLEMENTARY TOOLS</span><h2>Build more housing.<br />Subsidize housing for people who still can’t afford it.</h2></div>
        <div className="policy-cards"><article><b>TARGETED SUBSIDY</b><h3>Protect people now.</h3><p>Essential for households the private market can’t serve. It is also expensive: recent city-supported projects in Chicago cost roughly $679,000 to $747,000 per unit, which limits how many we can build.</p><strong>Deep impact · limited volume</strong></article><div className="policy-plus" aria-hidden="true"><span>+</span></div><article><b>MARKET-RATE SUPPLY</b><h3>Make room at scale.</h3><p>Creates choices now, sets off chains of moves, and becomes the older, cheaper housing that future Oak Park residents will rely on.</p><strong>Broad impact · scalable</strong></article></div>
      </section>

      <section className="iho"><div><span>INCLUSIONARY HOUSING</span><h2>A requirement can’t create an affordable unit in a building that never gets built.</h2></div><div><p>Inclusionary rules can produce reduced-rent units. But if the requirement makes new construction infeasible, it shuts off the very supply those units come from.</p><p>San Francisco’s 2026 feasibility analysis found nearly every tested housing type infeasible even at a 0% requirement. The city then moved to cut its on-site requirement from 15% to 5% while seeking broader affordable-housing funding.</p><div className="source-links"><a href="https://media.api.sf.gov/documents/Triennial_Economic_Feasibilty_Report_2026.final.pdf" target="_blank" rel="noreferrer">SF Controller report ↗</a><a href="https://www.sfchronicle.com/realestate/article/affordable-housing-requirements-22194354.php" target="_blank" rel="noreferrer">Chronicle reporting ↗</a></div></div></section>

      <section className="finale"><div><span>THE LESSON</span><h2>Start the engine again.</h2><p>New market-rate construction protects existing affordable housing and generates new affordable housing as it ages. It’s the engine that creates a diverse and affordable housing stock. We’ve shut down that engine for too long. It’s time to start it up again.</p></div></section>

      <footer><p><strong>Method:</strong> ACS 2024 five-year table B25034; Village of Oak Park Strategic Vision for Housing; IHDA AHPAA affordability lists. Year-built data describe current stock and do not count units lost to demolition.</p><div><a href="https://api.censusreporter.org/1.0/data/show/latest?geo_ids=16000US1754885&table_ids=B25034" target="_blank" rel="noreferrer">ACS data</a><a href="#top">Back to top ↑</a></div></footer>
    </main>
  );
}
