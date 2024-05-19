// "use client";

// import { useState, useRef, useEffect } from "react";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import { divIcon } from "leaflet";
// import { IoIosSearch, IoMdCloseCircle } from "react-icons/io";
// import markersData from "../../../public/markers.json";

// export default function Maps() {
//   const [searchName, setSearchName] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [recentVisits, setRecentVisits] = useState([]);
//   const [savedPlaces, setSavedPlaces] = useState([]);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter" && suggestions.length > 0) {
//         const firstSuggestion = suggestions[0];
//         if (
//           firstSuggestion &&
//           typeof firstSuggestion === "object" &&
//           firstSuggestion.name
//         ) {
//           const firstMatchedCity = markersData.find((marker) =>
//             marker.cities.some(
//               (city) =>
//                 city.name.toLowerCase() === firstSuggestion.name.toLowerCase()
//             )
//           );
//           if (firstMatchedCity) {
//             const firstCity = firstMatchedCity.cities.find(
//               (city) =>
//                 city.name.toLowerCase() === firstSuggestion.name.toLowerCase()
//             );
//             if (firstCity) {
//               mapRef.current.flyTo(firstCity.geocode, 10);
//               addRecentVisit(firstCity, firstMatchedCity.country);
//             }
//           }
//         }
//         setSuggestions([]);
//       }
//     };
//     if (typeof window !== "undefined") {
//       window.addEventListener("keydown", handleKeyDown);
//       return () => {
//         window.removeEventListener("keydown", handleKeyDown);
//       };
//     }
//   }, [suggestions]);

//   const addRecentVisit = (city, country) => {
//     setRecentVisits((prevVisits) => {
//       const newVisit = {
//         name: city.name,
//         country: country,
//         user: city.User,
//         img: city.img,
//         geocode: city.geocode,
//         avtar: city.avtar,
//       };
//       const filteredVisits = prevVisits.filter(
//         (visit) => visit.name !== city.name || visit.country !== country
//       );
//       return [newVisit, ...filteredVisits].slice(0, 5);
//     });
//   };

//   const addSavedPlace = (place) => {
//     setSavedPlaces((prevSaved) => {
//       const isAlreadySaved = prevSaved.some(
//         (saved) => saved.name === place.name && saved.country === place.country
//       );
//       if (!isAlreadySaved) {
//         return [place, ...prevSaved];
//       }
//       return prevSaved;
//     });
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchName(value);

//     const filteredSuggestions = markersData.flatMap((marker) =>
//       marker.cities
//         .filter(
//           (city) =>
//             city.name.toLowerCase().includes(value.toLowerCase()) ||
//             city.User.toLowerCase().includes(value.toLowerCase()) ||
//             marker.country.toLowerCase().includes(value.toLowerCase())
//         )
//         .map((city) => ({
//           name: city.name,
//           img: city.img,
//           country: marker.country,
//           user: city.User,
//           geocode: city.geocode,
//           avtar: city.avtar,
//         }))
//     );

//     setSuggestions(filteredSuggestions);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSearchName(suggestion.name);
//     mapRef.current.flyTo(suggestion.geocode, 10);
//     addRecentVisit(suggestion, suggestion.country);
//     setSuggestions([]);
//   };

//   const renderPlacesList = (places, title) => {
//     const hasSavedPlaces = savedPlaces.length > 0;

//     if (title === "Recents" && recentVisits.length === 0) {
//       return null;
//     }

//     if (title === "Saved Places" && !hasSavedPlaces) {
//       return null;
//     }

//     return (
//       <div
//         style={{
//           position: "fixed",
//           bottom: title === "Recents" ? "50%" : "20%",
//           left: 5,
//           zIndex: 1000,
//           backgroundColor: "#fff",
//           padding: "10px",
//           borderRadius: "4px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           width: 230,
//         }}
//       >
//         <h3 style={{ margin: "0 0 10px 0" }}>{title}</h3>
//         <ul
//           className="suggestion-list"
//           style={{
//             listStyleType: "none",
//             padding: 0,
//             margin: 0,
//             maxHeight: "150px",
//             overflowY: "auto",
//           }}
//         >
//           {places.map((place, index) => (
//             <li
//               key={index}
//               style={{
//                 padding: "8px 12px",
//                 cursor: "pointer",
//                 borderBottom:
//                   index !== places.length - 1 ? "1px solid #eee" : "none",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//               onClick={() => mapRef.current.flyTo(place.geocode, 10)}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     marginRight: 10,
//                   }}
//                 >
//                   <img
//                     src={place.img}
//                     alt={place.name}
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <span
//                     style={{
//                       color: "black",
//                       fontSize: "11px",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {place.user}
//                   </span>
//                   <span style={{ fontSize: "11px", color: "#ABA0BB" }}>
//                     {place.country}
//                   </span>
//                 </div>
//               </div>
//               {title === "Recents" && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSave(place);
//                   }}
//                   style={{
//                     backgroundColor: isSaved(place) ? "#ff5733" : "#845EC2",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "4px",
//                     padding: "5px 10px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {isSaved(place) ? "Unsave" : "Save"}
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   const toggleSave = (place) => {
//     if (isSaved(place)) {
//       removeSavedPlace(place);
//     } else {
//       addSavedPlace(place);
//     }
//   };

//   const isSaved = (place) => {
//     return savedPlaces.some(
//       (saved) => saved.name === place.name && saved.country === place.country
//     );
//   };

//   const removeSavedPlace = (place) => {
//     setSavedPlaces((prevSaved) =>
//       prevSaved.filter(
//         (saved) => saved.name !== place.name || saved.country !== place.country
//       )
//     );
//   };

//   return (
//     <div style={{ backgroundColor: "#aad3df" }}>
//       <div
//         style={{
//           position: "fixed",
//           top: "7%",
//           left: "5%",
//           zIndex: 100000,
//         }}
//       >
//         <IoIosSearch
//           style={{
//             position: "fixed",
//             top: "8%",
//             left: "5.4%",
//             fontSize: "20px",
//           }}
//         />
//         <input
//           type="text"
//           placeholder="Search country, city, or user..."
//           value={searchName}
//           onChange={handleSearch}
//           style={{
//             backgroundColor: "#fff",
//             color: "black",
//             padding: 10,
//             borderRadius: "7px",
//             width: "500px",
//             paddingLeft: "30px",
//             border: "2px solid #845EC2",
//             outline: "none",
//           }}
//         />
//         {searchName && (
//           <button
//             onClick={() => setSearchName("")}
//             style={{
//               position: "absolute",
//               top: "50%",
//               right: "10px",
//               transform: "translateY(-50%)",
//               backgroundColor: "transparent",
//               border: "none",
//               cursor: "pointer",
//               outline: "none",
//             }}
//           >
//             <IoMdCloseCircle style={{ fontSize: "20px", color: "#8a8a8a" }} />
//           </button>
//         )}
//       </div>
//       <div
//         style={{
//           height: "100vh",
//           width: "100vw",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//         }}
//       >
//         <div style={{ position: "relative", width: "100vw" }}>
//           <ul
//             className="suggestion-list"
//             style={{
//               listStyleType: "none",
//               padding: 0,
//               margin: 0,
//               position: "fixed",
//               top: "13%",
//               left: "5%",
//               width: "23vw",
//               maxHeight: "300px",
//               overflowY: "auto",
//               background: "#fff",
//               borderRadius: "4px",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//               zIndex: 10000,
//             }}
//           >
//             {suggestions.map((suggestion, index) => (
//               <li
//                 key={index}
//                 style={{
//                   padding: "8px 12px",
//                   cursor: "pointer",
//                   borderBottom:
//                     index !== suggestions.length - 1
//                       ? "1px solid #eee"
//                       : "none",
//                   zIndex: 100000,
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//                 onClick={() => handleSuggestionClick(suggestion)}
//               >
//                 <div
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     marginRight: 10,
//                   }}
//                 >
//                   <img
//                     src={suggestion.img}
//                     alt={suggestion.name}
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 </div>

//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <span
//                     style={{
//                       color: "black",
//                       fontSize: "16px",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {suggestion.user}
//                   </span>
//                   <span style={{ fontSize: "13px", color: "#ABA0BB" }}>
//                     <span style={{ fontSize: "13px" }}>{suggestion.name}</span>
//                     {","} {suggestion.country}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         {renderPlacesList(recentVisits, "Recents")}
//         {renderPlacesList(savedPlaces, "Saved Places")}
//         <MapContainer
//           ref={mapRef}
//           style={{ height: "calc(100% - 40px)" }}
//           center={[48.8566, 2.3522]}
//           zoom={3}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <MarkerClusterGroup chunkedLoading>
//             {markersData.map((country, index) =>
//               country.cities.map((city, cityIndex) =>
//                 city.name.toLowerCase().includes(searchName.toLowerCase()) ||
//                 city.User.toLowerCase().includes(searchName.toLowerCase()) ||
//                 country.country
//                   .toLowerCase()
//                   .includes(searchName.toLowerCase()) ? (
//                   <Marker
//                     key={`${index}-${cityIndex}`}
//                     position={city.geocode}
//                     icon={divIcon({
//                       html: `<img src=${city.avtar} style="width: 40px; height: 40px; border-radius: 50%;">`,
//                       className: "custom-marker-icon",
//                     })}
//                   >
//                     <Popup>
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <div style={{ display: "flex", marginBottom: "10px" }}>
//                           <img
//                             style={{
//                               borderRadius: "50%",
//                               width: "40px",
//                               height: "40px",
//                               marginRight: "10px",
//                             }}
//                             src={city.avtar}
//                             alt=""
//                           />
//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               marginTop: "6px",
//                             }}
//                           >
//                             <b style={{ textTransform: "capitalize" }}>
//                               {city.User}
//                             </b>
//                             <b style={{ color: "gray", fontSize: "10px" }}>
//                               {city.name}
//                             </b>
//                           </div>
//                         </div>
//                         {city.img && (
//                           <img
//                             src={city.img}
//                             alt={city.name}
//                             style={{ width: "10vw", borderRadius: "10%" }}
//                           />
//                         )}
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ) : null
//               )
//             )}
//           </MarkerClusterGroup>
//         </MapContainer>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon } from "leaflet";
import { IoIosSearch, IoMdCloseCircle } from "react-icons/io";
import markersData from "../../../public/markers.json";

export default function Maps() {
  const [searchName, setSearchName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        if (
          firstSuggestion &&
          typeof firstSuggestion === "object" &&
          firstSuggestion.name
        ) {
          const firstMatchedCity = markersData.find((marker) =>
            marker.cities.some(
              (city) =>
                city.name.toLowerCase() === firstSuggestion.name.toLowerCase()
            )
          );
          if (firstMatchedCity) {
            const firstCity = firstMatchedCity.cities.find(
              (city) =>
                city.name.toLowerCase() === firstSuggestion.name.toLowerCase()
            );
            if (firstCity) {
              mapRef.current.flyTo(firstCity.geocode, 10);
              addRecentVisit(firstCity, firstMatchedCity.country);
            }
          }
        }
        setSuggestions([]);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [suggestions]);

  const addRecentVisit = (city, country) => {
    setRecentVisits((prevVisits) => {
      const newVisit = {
        name: city.name,
        country: country,
        user: city.User,
        img: city.img,
        geocode: city.geocode,
        avtar: city.avtar,
      };
      const filteredVisits = prevVisits.filter(
        (visit) => visit.name !== city.name || visit.country !== country
      );
      return [newVisit, ...filteredVisits].slice(0, 5);
    });
  };

  const addSavedPlace = (place) => {
    setSavedPlaces((prevSaved) => {
      const isAlreadySaved = prevSaved.some(
        (saved) => saved.name === place.name && saved.country === place.country
      );
      if (!isAlreadySaved) {
        return [place, ...prevSaved];
      }
      return prevSaved;
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchName(value);

    const filteredSuggestions = markersData.flatMap((marker) =>
      marker.cities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(value.toLowerCase()) ||
            city.User.toLowerCase().includes(value.toLowerCase()) ||
            marker.country.toLowerCase().includes(value.toLowerCase())
        )
        .map((city) => ({
          name: city.name,
          img: city.img,
          country: marker.country,
          user: city.User,
          geocode: city.geocode,
          avtar: city.avtar,
        }))
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchName(suggestion.name);
    mapRef.current.flyTo(suggestion.geocode, 10);
    addRecentVisit(suggestion, suggestion.country);
    setSuggestions([]);
  };

  const renderPlacesList = (places, title) => {
    const hasSavedPlaces = savedPlaces.length > 0;

    if (title === "Recents" && recentVisits.length === 0) {
      return null;
    }

    if (title === "Saved Places" && !hasSavedPlaces) {
      return null;
    }

    return (
      <div
        style={{
          position: "fixed",
          bottom: title === "Recents" ? "50%" : "20%",
          left: 5,
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          width: 230,
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>{title}</h3>
        <ul
          className="suggestion-list"
          style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {places.map((place, index) => (
            <li
              key={index}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom:
                  index !== places.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => mapRef.current.flyTo(place.geocode, 10)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginRight: 10,
                  }}
                >
                  <img
                    src={place.img}
                    alt={place.name}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "black",
                      fontSize: "11px",
                      textTransform: "capitalize",
                    }}
                  >
                    {place.user}
                  </span>
                  <span style={{ fontSize: "11px", color: "#ABA0BB" }}>
                    {place.country}
                  </span>
                </div>
              </div>
              {title === "Recents" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(place);
                  }}
                  style={{
                    backgroundColor: isSaved(place) ? "#ff5733" : "#845EC2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  {isSaved(place) ? "Unsave" : "Save"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const toggleSave = (place) => {
    if (isSaved(place)) {
      removeSavedPlace(place);
    } else {
      addSavedPlace(place);
    }
  };

  const isSaved = (place) => {
    return savedPlaces.some(
      (saved) => saved.name === place.name && saved.country === place.country
    );
  };

  const removeSavedPlace = (place) => {
    setSavedPlaces((prevSaved) =>
      prevSaved.filter(
        (saved) => saved.name !== place.name || saved.country !== place.country
      )
    );
  };

  return (
    <div style={{ backgroundColor: "#aad3df" }}>
      <div
        style={{
          position: "fixed",
          top: "7%",
          left: "5%",
          zIndex: 100000,
        }}
      >
        <IoIosSearch
          style={{
            position: "fixed",
            top: "8%",
            left: "5.4%",
            fontSize: "20px",
          }}
        />
        <input
          type="text"
          placeholder="Search country, city, or user..."
          value={searchName}
          onChange={handleSearch}
          style={{
            backgroundColor: "#fff",
            color: "black",
            padding: 10,
            borderRadius: "7px",
            width: "500px",
            paddingLeft: "30px",
            border: "2px solid #845EC2",
            outline: "none",
          }}
        />
        {searchName && (
          <button
            onClick={() => setSearchName("")}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <IoMdCloseCircle style={{ fontSize: "20px", color: "#8a8a8a" }} />
          </button>
        )}
      </div>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", width: "100vw" }}>
          <ul
            className="suggestion-list"
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              position: "fixed",
              top: "13%",
              left: "5%",
              width: "23vw",
              maxHeight: "300px",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              zIndex: 10000,
            }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom:
                    index !== suggestions.length - 1
                      ? "1px solid #eee"
                      : "none",
                  zIndex: 100000,
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginRight: 10,
                  }}
                >
                  <img
                    src={suggestion.img}
                    alt={suggestion.name}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "black",
                      fontSize: "16px",
                      textTransform: "capitalize",
                    }}
                  >
                    {suggestion.user}
                  </span>
                  <span style={{ fontSize: "13px", color: "#ABA0BB" }}>
                    <span style={{ fontSize: "13px" }}>{suggestion.name}</span>
                    {","} {suggestion.country}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {renderPlacesList(recentVisits, "Recents")}
        {renderPlacesList(savedPlaces, "Saved Places")}
        <MapContainer
          ref={mapRef}
          style={{ height: "calc(100% - 40px)" }}
          center={[48.8566, 2.3522]}
          zoom={3}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street View">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite View">
              <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
                url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=YOUR_MAPTILER_API_KEY"
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Traffic">
              <TileLayer
                url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Transit">
              <TileLayer
                url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_THUNDERFOREST_API_KEY"
              />
            </LayersControl.Overlay>
          </LayersControl>
          <MarkerClusterGroup chunkedLoading>
            {markersData.map((country, index) =>
              country.cities.map((city, cityIndex) =>
                city.name.toLowerCase().includes(searchName.toLowerCase()) ||
                city.User.toLowerCase().includes(searchName.toLowerCase()) ||
                country.country
                  .toLowerCase()
                  .includes(searchName.toLowerCase()) ? (
                  <Marker
                    key={`${index}-${cityIndex}`}
                    position={city.geocode}
                    icon={divIcon({
                      html: `<img src=${city.avtar} style="width: 40px; height: 40px; border-radius: 50%;">`,
                      className: "custom-marker-icon",
                    })}
                  >
                    <Popup>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                          <img
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              marginRight: "10px",
                            }}
                            src={city.avtar}
                            alt=""
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginTop: "6px",
                            }}
                          >
                            <b style={{ textTransform: "capitalize" }}>
                              {city.User}
                            </b>
                            <b style={{ color: "gray", fontSize: "10px" }}>
                              {city.name}
                            </b>
                          </div>
                        </div>
                        {city.img && (
                          <img
                            src={city.img}
                            alt={city.name}
                            style={{ width: "10vw", borderRadius: "10%" }}
                          />
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}
