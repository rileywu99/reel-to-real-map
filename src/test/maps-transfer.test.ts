import { describe, expect, it } from "vitest";
import { exportMapsCsv, GOOGLE_DEMO_PLACES, googleMapsUrl, externalMapsUrl, isGoogleMapsListUrl, parseMapsFile } from "@/lib/maps-transfer";
import { DEFAULT_COLLECTION, REMINDER_DISTANCE_METERS, WEEKEND_REMINDER_DAY, statistics } from "@/lib/workspace";
const csv = 'Name,Latitude,Longitude,Address,Note,City\n"Cafe, One",34.1,-118.2,"Main, LA","Hello ""world""",Los Angeles';
describe("Maps transfer rules", () => {
  it("imports actual CSV coordinates and quoted cells", () => {
    const { places } = parseMapsFile(csv, "takeout.csv");
    expect(places[0]).toMatchObject({ name: "Cafe, One", lat: 34.1, lng: -118.2, note: 'Hello "world"' });
  });
  it("imports Takeout GeoJSON coordinates", () => {
    const result = parseMapsFile(JSON.stringify({ features: [{ geometry: { coordinates: [121.5, 25.1] }, properties: { location: { name: "Taipei cafe" } } }] }), "takeout.json");
    expect(result.places[0]).toMatchObject({ name: "Taipei cafe", lat: 25.1, lng: 121.5 });
  });
  it("never places missing or invalid coordinates on the map", () => {
    const result = parseMapsFile('Name,Latitude,Longitude\nMissing,,\nInvalid,91,181', "bad.csv");
    expect(result.places).toHaveLength(0); expect(result.skipped).toBe(2);
  });
  it("exports the selected places as round-trippable My Maps CSV", () => {
    const { places } = parseMapsFile(csv, "takeout.csv");
    expect(parseMapsFile(exportMapsCsv(places), "export.csv").places[0]).toMatchObject({ name: "Cafe, One", lat: 34.1, lng: -118.2 });
  });
  it("uses Google Maps standard search URL and Apple preference", () => {
    expect(googleMapsUrl(GOOGLE_DEMO_PLACES[0])).toContain("https://www.google.com/maps/search/?api=1&query=");
    expect(externalMapsUrl(GOOGLE_DEMO_PLACES[0], "apple")).toContain("https://maps.apple.com/?ll=34.078,-118.4741");
  });
  it("validates Maps links before the three-place demo import", () => {
    expect(GOOGLE_DEMO_PLACES).toHaveLength(3);
    expect(isGoogleMapsListUrl("https://maps.app.goo.gl/test")).toBe(true);
    expect(isGoogleMapsListUrl("https://google.com.evil.test/maps")).toBe(false);
  });
  it("computes captured count, visit completion and unique cities", () => {
    const { places } = parseMapsFile(csv, "file.csv");
    expect(statistics([...places, { ...places[0], id: "2", visited: true }])).toEqual({ captured: 2, completed: 50, cities: 1 });
  });
  it("defines the nearby reminder distance as 500 metres", () => expect(REMINDER_DISTANCE_METERS).toBe(500));
  it("defines weekly suggestions for Friday", () => expect(WEEKEND_REMINDER_DAY).toBe(5));
  it("preserves a default collection identifier", () => expect(DEFAULT_COLLECTION).toBe("default"));
});
