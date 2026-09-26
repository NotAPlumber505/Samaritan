package com.samaritan.websocket;

import com.samaritan.websocket.service.DistanceUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class WebsocketApplicationTests {
	private static final double TOLERANCE_KM = 1.0;

	@Test
	void samePointIsZeroDistance() {
		double km = DistanceUtil.distanceKm(40.7128, -74.0060, 40.7128, -74.0060);
		assertEquals(0.0, km, 0.0001);
	}

	@Test
	void newYorkToLosAngeles() {
		double km = DistanceUtil.distanceKm(40.7128, -74.0060, 34.0522, -118.2437);
		assertEquals(3935.75, km, TOLERANCE_KM);
	}

	@Test
	void londonToParis() {
		double km = DistanceUtil.distanceKm(51.5074, -0.1278, 48.8566, 2.3522);
		assertEquals(343.56, km, TOLERANCE_KM);
	}

	@Test
	void oneDegreeOfLatitudeIsAbout111Km() {
		double km = DistanceUtil.distanceKm(0, 0, 1, 0);
		assertEquals(111.195, km, 0.01);
	}

	@Test
	void crossingTheAntimeridianTakesTheShortWay() {
		// 179.5 and -179.5 are only 1 degree apart, not 359
		double km = DistanceUtil.distanceKm(0, 179.5, 0, -179.5);
		assertEquals(111.195, km, 0.01);
	}

	@Test
	void distanceIsTheSameInBothDirections() {
		double aToB = DistanceUtil.distanceKm(40.7128, -74.0060, 34.0522, -118.2437);
		double bToA = DistanceUtil.distanceKm(34.0522, -118.2437, 40.7128, -74.0060);
		assertEquals(aToB, bToA, 0.0000001);
	}

	@Test
	void milesMatchesKilometresConverted() {
		double km = DistanceUtil.distanceKm(51.5074, -0.1278, 48.8566, 2.3522);
		double miles = DistanceUtil.distanceMiles(51.5074, -0.1278, 48.8566, 2.3522);
		assertEquals(km * 0.621371, miles, 0.0000001);
	}
}