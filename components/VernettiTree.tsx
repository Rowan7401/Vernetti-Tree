"use client"

import { useState, useEffect, useRef } from "react"
import "../app/styles/vernetti-tree.css"

// Individual Person Card Component
const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onClick,
  showExpand = false,
  onExpand,
  expanded = false,
}) => (
  <div className="person-card-compact">
    <div className="person-avatar-small" onClick={() => onClick && onClick(person)}>
      {person.imageSrc ? (
        <img src={person.imageSrc || "/placeholder.svg"} alt={person.name} className="avatar-image-small" />
      ) : (
        <div className="avatar-placeholder-small">
          {person.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      )}
      <div className="focus-indicator">🔍</div>
    </div>
    <p className="person-name-compact">{person.name.split(" ")[0]}</p>
    {showExpand && (
      <div className="expand-btn-small" onClick={onExpand} style={{ marginTop: "1rem" }}>
        {expanded ? "−" : "+"}
      </div>
    )}
  </div>
)

// Couple Component (for married pairs)
const CoupleCard: React.FC<CoupleCardProps> = ({
  partner1,
  partner2,
  marriageDate,
  marriagePlace,
  onClick,
  showExpand = false,
  onExpand,
  expanded = false,
}) => (
  <div className="couple-container-compact">
    <div className="couple-cards-small">
      <PersonCard
        person={partner1}
        onClick={() =>
          onClick &&
          onClick({ partner1, partner2, marriageDate, marriagePlace, type: "couple" })
        }
      />
      <div className="marriage-connector">♥</div>
      <PersonCard
        person={partner2}
        onClick={() =>
          onClick &&
          onClick({ partner1, partner2, marriageDate, marriagePlace, type: "couple" })
        }
      />
    </div>
    {showExpand && (
      <div className="expand-btn-small" onClick={onExpand}>
        {expanded ? "−" : "+"}
      </div>
    )}
  </div>
)

// Individual Family Component
const FamilyUnit = ({ parents, children, forceVisible = false, onPersonClick, onChildExpand, parentActiveChild }) => {
  const [expanded, setExpanded] = useState(forceVisible)
  const [activeChild, setActiveChild] = useState(null)

  const handleExpand = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)

    if (newExpanded) {
      if (onChildExpand) {
        onChildExpand(parents[0].name)
      }
    } else {
      setActiveChild(null)
      if (onChildExpand) {
        onChildExpand(null)
      }
    }
  }

  const handleChildExpand = (childName) => {
    setActiveChild(childName)
  }

  const isHidden = !forceVisible && parentActiveChild !== null && parentActiveChild !== parents[0].name

  if (isHidden) {
    return null
  }

  return (
    <li className={`family-unit ${forceVisible ? "root-family" : ""} ${expanded ? "expanded" : ""}`}>
      <div className="parents-container">
        {parents.length === 1 ? (
          <PersonCard
            person={parents[0]}
            onClick={onPersonClick}
            showExpand={children && children.length > 0}
            onExpand={handleExpand}
            expanded={expanded}
          />

        ) : parents.length === 2 ? (
          <CoupleCard
            partner1={parents[0]}
            partner2={parents[1]}
            marriageDate={parents[0].marriageDate || parents[1].marriageDate}
            marriagePlace={parents[0].marriagePlace || parents[1].marriagePlace}
            onClick={onPersonClick}
            showExpand={children && children.length > 0}
            onExpand={handleExpand}
            expanded={expanded}
          />
        ) : parents.length === 4 ? (
          <div className="quad-parents">

            <CoupleCard
              partner1={parents[0]}
              partner2={parents[1]}
              marriageDate={parents[0].marriageDate || parents[1].marriageDate}
              marriagePlace={parents[0].marriagePlace || parents[1].marriagePlace}
              onClick={onPersonClick}
              showExpand={false}
            />
            {children && children.length > 0 && (
              <div className="quad-expand-btn" onClick={handleExpand}>
                {expanded ? "−" : "+"}
              </div>
            )}
            <CoupleCard
              partner1={parents[2]}
              partner2={parents[3]}
              marriageDate={parents[2].marriageDate || parents[3].marriageDate}
              marriagePlace={parents[2].marriagePlace || parents[3].marriagePlace}
              onClick={onPersonClick}
              showExpand={false}
            />
          </div>
        ) : null}
      </div>

      {expanded && children && children.length > 0 && (
        <ul className="children-container">
          {children.map((child, index) => {
            const childKey = child.parents[0].name

            return (
              <FamilyUnit
                key={childKey}
                parents={child.parents}
                children={child.children}
                forceVisible={false}
                onPersonClick={onPersonClick}
                onChildExpand={handleChildExpand}
                parentActiveChild={activeChild}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}

type Person = {
  name: string
  birth?: string
  death?: string
  married?: string
  imageSrc?: string
  marriageDate?: string
  marriagePlace?: string
  type?: string
  partner1?: Person
  partner2?: Person
}

type PersonCardProps = {
  person: Person
  onClick?: (person: Person) => void
  showExpand?: boolean
  onExpand?: () => void
  expanded?: boolean
}

type CoupleCardProps = {
  partner1: Person
  partner2: Person
  marriageDate?: string
  marriagePlace?: string
  onClick?: (couple: {
    partner1: Person
    partner2: Person
    marriageDate?: string
    marriagePlace?: string
    type: "couple"
  }) => void
  showExpand?: boolean
  onExpand?: () => void
  expanded?: boolean
}

type FocusModalProps = {
  focusedPerson:
  | Person
  | (Person & { type: "couple"; partner1: Person; partner2: Person; marriageDate?: string; marriagePlace?: string })
  | null
  onClose: () => void
}

const FocusModal = ({ focusedPerson, onClose }: FocusModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusedPerson && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [focusedPerson])

  if (!focusedPerson) return null

  if (focusedPerson.type === "couple") {
    return (
      <div className="focus-overlay" onClick={onClose} ref={modalRef}>
        <div className="focus-modal couple-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <div className="couple-focus-cards">
            <div className="focus-person">
              <div className="focus-avatar">
                {focusedPerson.partner1 && focusedPerson.partner1.imageSrc ? (
                  <img
                    src={focusedPerson.partner1.imageSrc || "/placeholder.svg"}
                    alt={focusedPerson.partner1.name}
                    className="focus-image"
                  />
                ) : focusedPerson.partner1 ? (
                  <div className="focus-placeholder">{focusedPerson.partner1.name.split(" ").map((n) => n[0])}</div>
                ) : null}
              </div>
              <h2 className="focus-name">{focusedPerson.partner1 ? focusedPerson.partner1.name : ""}</h2>
              {focusedPerson.partner1 && focusedPerson.partner1.birth && (
                <p className="focus-detail">Born: {focusedPerson.partner1.birth}</p>
              )}
              {focusedPerson.partner1 && focusedPerson.partner1.death && focusedPerson.partner1.death !== "Living" && (
                <p className="focus-detail">Died: {focusedPerson.partner1.death}</p>
              )}
            </div>
            <div className="marriage-focus-info">
              <div className="heart-large">♥</div>
              <div className="marriage-focus-details">
                {focusedPerson.marriageDate && <p>Married: {focusedPerson.marriageDate}</p>}
                {focusedPerson.marriagePlace && <p>{focusedPerson.marriagePlace}</p>}
              </div>
            </div>
            <div className="focus-person">
              <div className="focus-avatar">
                {focusedPerson.partner2 && focusedPerson.partner2.imageSrc ? (
                  <img
                    src={focusedPerson.partner2.imageSrc || "/placeholder.svg"}
                    alt={focusedPerson.partner2.name}
                    className="focus-image"
                  />
                ) : focusedPerson.partner2 ? (
                  <div className="focus-placeholder">{focusedPerson.partner2.name.split(" ").map((n) => n[0])}</div>
                ) : null}
              </div>
              <h2 className="focus-name">{focusedPerson.partner2 ? focusedPerson.partner2.name : ""}</h2>
              {focusedPerson.partner2 && focusedPerson.partner2.birth && (
                <p className="focus-detail">Born: {focusedPerson.partner2.birth}</p>
              )}
              {focusedPerson.partner2 &&
                focusedPerson.partner2.death &&
                focusedPerson.partner2.death !== "Living" && (
                  <p className="focus-detail">Died: {focusedPerson.partner2.death}</p>
                )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="focus-overlay" onClick={onClose} ref={modalRef}>
      <div className="focus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="focus-content">
          <div className="focus-avatar">
            {focusedPerson.imageSrc ? (
              <img
                src={focusedPerson.imageSrc || "/placeholder.svg"}
                alt={focusedPerson.name}
                className="focus-image"
              />
            ) : (
              <div className="focus-placeholder">{focusedPerson.name.split(" ").map((n) => n[0])}</div>
            )}
          </div>
          <h2 className="focus-name">{focusedPerson.name}</h2>
          {focusedPerson.birth && <p className="focus-detail">Born: {focusedPerson.birth}</p>}
          {focusedPerson.death && focusedPerson.death !== "Living" && (
            <p className="focus-detail">Died: {focusedPerson.death}</p>
          )}
          {focusedPerson.married && <p className="focus-detail">Marital Status: {focusedPerson.married}</p>}
        </div>
      </div>
    </div>
  )
}

// Main Vernetti Family Tree Component
const VernettiTree = () => {
  const [focusedPerson, setFocusedPerson] = useState(null)

  // Vernetti family data structure - two root families that connect through marriage
  const familyData = {
    parents: [
      {
        name: "Donald Marshall",
        birth: "24 Jan 1912, Niles, Michigan",
        death: "Living",
        imageSrc: "/assets/Vernetti/Grandpa Marshall.jpg",
      },
      {
        name: "Mary Kuzmitz Marshall",
        birth: "02 Nov 1915, South Bend, Indiana",
        death: "Living",
        imageSrc: "/assets/Vernetti/Grandma Marshall.jpg",
        marriageDate: "09 Sep 1944",
      },
    ],
    children: [
      {
        parents: [
          {
            name: "Joan K. Marshall",
            birth: "16 Sep 1945, South Bend, Indiana",
            death: "Living",
            imageSrc: "/assets/Vernetti/Nana.jpg",
          },
        ],
        children: [],
      },
    ],
  }

  // Second root family - Vernetti side
  const vernettiData = {
    parents: [
      {
        name: "John P. Vernetti",
        birth: "27 Aug 1881, Torino, Piemonte, Italy",
        death: "13 Apr 1966 Galen, Montana",
        imageSrc: "/assets/Vernetti/John P. Vernetti.jpeg",
      },
      {
        name: "Maria Picchioldi Vernetti",
        birth: "2 Mar 1892, Italy",
        death: "21 Apr 1969, Butte, Montana",
        imageSrc: "/assets/Vernetti/Maria Picchioldi Vernetti.jpeg",
      }
    ],
    children: [
      {
        parents: [
          {
            name: "Batt J. Vernetti",
            birth: "14 Mar 1913, Butte, Montana",
            death: "28 Apr 2000, Waco, Texas",
            imageSrc: "/assets/Vernetti/Grandpa Vernetti.jpg",
          },
          {
            name: "Anna Theresa Grunenfelder Vernetti",
            birth: "04 Mar 1915, Mandan, North Dakota",
            death: "28 Apr 2000, Waco, Texas",
            imageSrc: "/assets/Vernetti/Grandma Vernetti.jpg",
            marriageDate: "18 Apr 1940",
          },
          {
            name: "Donald Leroy Marshall",
            birth: "24 Jan 1912, Niles, Michigan",
            death: "19 Jan 1998, South Bend, Indiana",
            imageSrc: "/assets/Vernetti/Grandpa Marshall.jpg",
          },
          {
            name: "Mary Kuzmitz Marshall",
            birth: "02 Nov 1915, South Bend, Indiana",
            death: "1 Jan 1996, South Bend, Indiana",
            imageSrc: "/assets/Vernetti/Grandma Marshall.jpg",
            marriageDate: "09 Sep 1944",
          },
        ],
        children: [
          {
            parents: [
              {
                name: "James G. Vernetti",
                birth: "02 Jun 1945, Dennison, Texas",
                death: "15 May 2020",
                imageSrc: "/assets/Vernetti/Grandpa Jim.jpg",
              },
              {
                name: "Joan K. Marshall",
                birth: "16 Sep 1945, South Bend, Indiana",
                death: "Living",
                imageSrc: "/assets/Vernetti/Nana.jpg",
                marriageDate: "17 Aug 1968",
              },
            ],
            children: [
              {
                parents: [
                  {
                    name: "Gavin Patrick Dillon",
                    birth: "22 Feb 1969, Silver Springs, Maryland",
                    death: "Living",
                    imageSrc: "/assets/Vernetti/Gavin.PNG",
                  },
                  {
                    name: "Kathryn Ann Vernetti Dillon",
                    birth: "24 Oct 1969, San Diego, California",
                    death: "Living",
                    imageSrc: "/assets/Vernetti/Kathy.PNG",
                    marriageDate: "02 Nov 1996",
                    marriagePlace: "South Bend, Indiana",
                  },
                ],
                children: [
                  {
                    parents: [
                      {
                        name: "Keelin Ann Dillon",
                        birth: "23 May 2000, Chicago, Illinois",
                        death: "Living",
                        married: "Single",
                        imageSrc: "/assets/Vernetti/Keelin.PNG",
                      },
                    ],
                    children: [],
                  },
                  {
                    parents: [
                      {
                        name: "Rowan James Dillon",
                        birth: "04 Jul 2001, Seattle, Washington",
                        death: "Living",
                        married: "Single",
                        imageSrc: "/assets/Vernetti/Snapchat-1227678694.jpg",
                      },
                    ],
                    children: [],
                  },
                  {
                    parents: [
                      {
                        name: "Shea Kathleen Dillon",
                        birth: "11 Jul 2004, Seattle, Washington",
                        death: "Living",
                        married: "Single",
                        imageSrc: "/assets/Vernetti/Shea.PNG",
                      },
                    ],
                    children: [],
                  },
                ],
              },
              {
                parents: [
                  {
                    name: "Louis Rangel",
                    birth: "29 Apr 1969, Los Angeles, California",
                    death: "Living",
                    imageSrc: "/assets/Vernetti/Uncle Louis.png",
                  },
                  {
                    name: "Kristin Lynn Vernetti Rangel",
                    birth: "29 Apr 1973, Escondido, California",
                    death: "Living",
                    imageSrc: "/assets/Vernetti/Aunt Kristi.png",
                    marriageDate: "13 March 2004",
                    marriagePlace: "San Diego, California",
                  },
                ],
                children: [
                  {
                    parents: [
                      {
                        name: "Nicolina Marie Rangel",
                        birth: "23 Oct 2013, Torrance, California",
                        death: "Living",
                        married: "Single",
                        imageSrc: "/assets/Vernetti/Nico.png",
                      },
                    ],
                    children: [],
                  },
                ],
              },
              {
                parents: [
                  {
                    name: "Brian James Vernetti",
                    birth: "12 Aug 1978, Escondido, California",
                    death: "Living",
                    imageSrc: "/assets/Vernetti/Uncle Brian.PNG",
                  },
                  // {
                  //   name: "Lindsay J. Redman Vernetti",
                  //   birth: "21 Aug 1983, Denver Colorado",
                  //   death: "Living",
                  //   imageSrc: "/assets/Vernetti/Aunt Lindsay.PNG",
                  //   marriageDate: "02 Jan 2016",
                  // },
                ],
                children: [
                  {
                    parents: [
                      {
                        name: "Benjamin James Vernetti",
                        birth: "08 Oct 2019, San Diego, California",
                        death: "Living",
                        married: "Single",
                        imageSrc: "/assets/Vernetti/Ben.PNG",
                      },
                    ],
                    children: [],
                  },
                  {
                    parents: [
                      {
                        name: "Robert Blake Vernetti",
                        birth: "14 Dec 2021, San Diego, California",
                        death: "Living",
                        married: "Single",
                        imageSrc: "/assets/Vernetti/Blake.PNG",
                      },
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }


  return (
    <div className="family-tree-container">
      <div className="tree-header">
        <div className="header-tree-image">
          <img src="/assets/Vernetti/italia.png" alt="Vernetti Family Tree" className="tree-photo" />
        </div>
        <h1 className="tree-title">Vernetti Family Tree</h1>
        <h2 className="other-tree-link">Whalin Family Tree</h2>
        <p className="tree-subtitle">Click on family members to explore their details</p>
      </div>

      <div className="tree-wrapper">
        <ul className="tree-root">
          <FamilyUnit
            parents={vernettiData.parents}
            children={vernettiData.children}
            forceVisible={true}
            onPersonClick={setFocusedPerson}
          />
        </ul>
      </div>

      <FocusModal focusedPerson={focusedPerson} onClose={() => setFocusedPerson(null)} />
    </div>
  )
}

export default VernettiTree
