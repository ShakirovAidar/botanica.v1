/* Map data — the ONLY file you need to edit to change what the map shows.
 *
 * Each area is one pin on the map. Coordinates here are APPROXIMATE area
 * centres (the project's neighbourhood), not street addresses.
 *
 * To show an exact project location, add to that project in projects.js:
 *   latitude: 7.99xx, longitude: 98.30xx, locationStatus: "confirmed"
 * The project then gets its own precise "Open in Google Maps" link.
 *
 * Projects not listed in any area appear under "Location to be confirmed".
 */
window.BOTANICA_AREAS = [
  { id: "airport",  name: "Sakhu",          lat: 8.1070, lng: 98.3050, projects: ["skyport"] },
  { id: "layan",    name: "Layan",          lat: 8.0300, lng: 98.3050, projects: ["forestique", "lakeside-2", "sky-valley"] },
  { id: "bang-tao", name: "Bang Tao",       lat: 7.9950, lng: 98.3000, projects: ["grand-avenue", "hythe", "louvre", "modern-loft-ii"] },
  { id: "pru-jampa", name: "Pru Jampa",     lat: 8.0500, lng: 98.3650, projects: ["four-seasons", "pru-jampa", "green-boulevard", "the-verdant"] },
  { id: "thalang",  name: "Thalang",        lat: 8.0050, lng: 98.3350, projects: ["wisdom"] },
  { id: "kamala",   name: "Kamala",        lat: 7.9500, lng: 98.2820, projects: ["montazure", "kamala-ocean-valley"] },
  { id: "karon",    name: "Karon",         lat: 7.8450, lng: 98.2980, projects: ["karon"] },
  { id: "chalong",  name: "Chalong",       lat: 7.8350, lng: 98.3400, projects: ["chalong-bay"] },
  { id: "rawai",    name: "Rawai",         lat: 7.7780, lng: 98.3220, projects: ["grand-sea-through"] },
  { id: "krabi",    name: "Ao Nang, Krabi", lat: 8.0350, lng: 98.8380, projects: ["krabi"] },
  { id: "koh-kaew", name: "Koh Kaew",       lat: 7.9550, lng: 98.3850, projects: ["majestia"] }
];
